import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  initialize: () => () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setError: (error: string | null) => void;
  setDemoUser: (role: UserRole) => void;
}

const DEMO_USERS: Record<UserRole, User> = {
  patient: {
    uid: 'demo-patient',
    email: 'patient@intercity-healthcare.com',
    displayName: 'Rahul Verma',
    role: 'patient',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RahulVerma&backgroundColor=b6e3f4',
    createdAt: '2024-01-01',
  },
  doctor: {
    uid: 'demo-doctor',
    email: 'doctor@intercity-healthcare.com',
    displayName: 'Dr. Arjun Sharma',
    role: 'doctor',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunSharma&backgroundColor=b6e3f4',
    createdAt: '2024-01-15',
  },
  admin: {
    uid: 'demo-admin',
    email: 'admin@intercity-healthcare.com',
    displayName: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01',
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      firebaseUser: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      initialize: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                set({ user: userData, firebaseUser, isInitialized: true });
              } else {
                set({ user: null, firebaseUser: null, isInitialized: true });
              }
            } catch {
              // If Firebase fails, check if we have a persisted demo user
              const current = get().user;
              set({ firebaseUser, isInitialized: true, user: current });
            }
          } else {
            // Keep demo user if it's a demo session
            const current = get().user;
            if (current && current.uid.startsWith('demo-')) {
              set({ firebaseUser: null, isInitialized: true });
            } else {
              set({ user: null, firebaseUser: null, isInitialized: true });
            }
          }
        });
        return unsubscribe;
      },

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const credential = await signInWithEmailAndPassword(auth, email, password);
          const userDoc = await getDoc(doc(db, 'users', credential.user.uid));
          if (userDoc.exists()) {
            set({ user: userDoc.data() as User, firebaseUser: credential.user, isLoading: false });
          } else {
            throw new Error('User profile not found. Please contact support.');
          }
        } catch (err: unknown) {
          const error = err as { code?: string; message?: string };
          const msg = error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found'
            ? 'Invalid email or password'
            : error.code === 'auth/too-many-requests'
            ? 'Too many attempts. Please try again later.'
            : error.message || 'Sign in failed';
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      signUp: async (email: string, password: string, name: string, role: UserRole) => {
        set({ isLoading: true, error: null });
        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(credential.user, { displayName: name });
          const user: User = {
            uid: credential.user.uid,
            email,
            displayName: name,
            role,
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'users', credential.user.uid), user);
          set({ user, firebaseUser: credential.user, isLoading: false });
        } catch (err: unknown) {
          const error = err as { code?: string; message?: string };
          const msg = error.code === 'auth/email-already-in-use'
            ? 'An account with this email already exists'
            : error.code === 'auth/weak-password'
            ? 'Password must be at least 6 characters'
            : error.message || 'Registration failed';
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      signOut: async () => {
        try {
          await firebaseSignOut(auth);
        } catch {
          // ignore
        }
        set({ user: null, firebaseUser: null });
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await sendPasswordResetEmail(auth, email);
          set({ isLoading: false });
        } catch (err: unknown) {
          const error = err as { message?: string };
          const msg = error.message || 'Failed to send reset email';
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      setError: (error) => set({ error }),

      setDemoUser: (role: UserRole) => {
        set({ user: DEMO_USERS[role], isInitialized: true });
      },
    }),
    {
      name: 'smartcare-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
