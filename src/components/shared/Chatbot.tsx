import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { sendChatMessage } from '@/lib/gemini';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function Chatbot() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message based on role
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      let welcomeMsg = 'Hello! I am Intercity Healthcare AI Assistant. How can I help you today?';
      if (user?.role === 'patient') welcomeMsg = `Hi ${user.displayName?.split(' ')[0] || ''}! I can help you schedule doctor visits, check diagnostic reports, or answer hospital service questions.`;
      if (user?.role === 'doctor') welcomeMsg = `Greetings Dr. ${(user.displayName || 'Doctor').split(' ')[0]}! I can assist with clinical schedule lookup, patient queue telemetry, and department protocols.`;
      if (user?.role === 'admin') welcomeMsg = 'Greetings Administrator! I can provide real-time hospital occupancy telemetry, staff duty roster updates, and daily revenue stats.';
      
      setMessages([{ id: 'welcome', role: 'assistant', content: welcomeMsg }]);
    }
  }, [isOpen, user, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendText = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage = textToSend.trim();
    setInput('');
    const newMessage: Message = { id: Date.now().toString(), role: 'user', content: userMessage };
    
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage, user?.role || 'patient');
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response }]);
    } catch {
      let fallback = "You can explore hospital services or book directly through the Appointments tab in your sidebar.";
      const lowerMsg = userMessage.toLowerCase();
      if (lowerMsg.includes('appointment') || lowerMsg.includes('book')) {
        fallback = "To reserve a consultation, visit the 'Book Appointment' or 'AI Appointment Booker' sections in your dashboard.";
      } else if (lowerMsg.includes('emergency') || lowerMsg.includes('urgent')) {
        fallback = "For emergency trauma care, please call +91 (22) 2890-4000 or visit our 24/7 Casualty wing immediately.";
      }
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = user?.role === 'doctor' 
    ? ['Show today agenda', 'Check patient queue', 'Hospital trauma hotline']
    : user?.role === 'admin'
      ? ['Daily revenue stats', 'Bed occupancy status', 'Staff leave summary']
      : ['How to book appointment?', 'Download lab reports', 'Emergency contact number'];

  return (
    <>
      {/* Floating Trigger Button: carefully offset so mobile bottom nav doesn't cover it */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 lg:bottom-6 right-4 lg:right-6 p-3.5 rounded-2xl shadow-xl transition-all duration-200 hover:scale-105 z-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white flex items-center gap-2 border border-white/20 active:scale-95 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-5 h-5 text-teal-300 animate-pulse" />
        <span className="text-xs font-bold hidden sm:inline tracking-tight">AI Assistant</span>
      </button>

      {/* Chat Drawer / Modal Panel */}
      <div 
        className={`fixed bottom-0 lg:bottom-6 right-0 lg:right-6 w-full sm:w-[420px] h-[90dvh] sm:h-[620px] bg-white dark:bg-slate-950 sm:rounded-3xl shadow-2xl flex flex-col z-50 transition-all duration-300 transform origin-bottom-right border border-slate-200/80 dark:border-slate-800 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white sm:rounded-t-3xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur rounded-xl">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">Intercity Clinical AI</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
              </div>
              <p className="text-[10px] text-blue-100 capitalize">{user?.role || 'Guest'} Assistant • Gemini 2.0</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gradient-to-br from-blue-500 to-teal-500 text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={`max-w-[80%] p-3 rounded-2xl leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-xs font-medium' 
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/60 dark:border-slate-800'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-slate-400 text-xs">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 text-white flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl rounded-tl-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendText(q)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:border-blue-400 shrink-0 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 sm:rounded-b-3xl shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendText(input);
            }} 
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about hospital services..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isLoading} 
              className="rounded-xl shrink-0 bg-blue-600 hover:bg-blue-700 h-9 w-9"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-1.5">
            AI medical assistant. Verify critical health decisions with a physician.
          </p>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
