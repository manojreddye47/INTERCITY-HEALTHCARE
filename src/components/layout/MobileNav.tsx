import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function MobileNav({ isOpen, setIsOpen }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] flex flex-col bg-white dark:bg-slate-950 shadow-2xl z-50 border-r border-slate-200/80 dark:border-slate-800/80"
          >
            {/* Close Button Header */}
            <div className="absolute top-3 right-3 z-10">
              <button
                type="button"
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                onClick={() => setIsOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar content */}
            <div
              className="h-full overflow-y-auto flex-1"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('a')) {
                  setIsOpen(false);
                }
              }}
            >
              <Sidebar />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
