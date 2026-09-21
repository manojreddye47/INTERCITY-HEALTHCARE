import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function FeedbackPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  // Mock visits list
  const [pastAppointments, setPastAppointments] = useState([
    { id: '1', date: '2023-10-15', doctor: 'Dr. Sarah Johnson', dept: 'Cardiology', feedbackGiven: false },
    { id: '2', date: '2023-09-10', doctor: 'Dr. Michael Chen', dept: 'General Practice', feedbackGiven: true },
    { id: '3', date: '2024-03-01', doctor: 'Dr. Arjun Sharma', dept: 'Cardiology', feedbackGiven: false },
  ]);

  const handleGiveFeedback = (appt: any) => {
    setSelectedAppt(appt);
    setRating(5);
    setComments('');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;
    setPastAppointments(prev => prev.map(a => 
      a.id === selectedAppt.id ? { ...a, feedbackGiven: true } : a
    ));
    toast.success(`Thank you! Your ${rating}-star review for ${selectedAppt.doctor} has been recorded.`);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Feedback & Reviews</h1>
        <p className="text-slate-500 dark:text-slate-400">Help us improve by sharing your clinical experience.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Visits</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {pastAppointments.map(appt => (
            <div key={appt.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Consultation with {appt.doctor}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{appt.dept} • {appt.date}</p>
              </div>
              <div>
                {appt.feedbackGiven ? (
                  <span className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Feedback Submitted
                  </span>
                ) : (
                  <button 
                    onClick={() => handleGiveFeedback(appt)}
                    className="flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Give Feedback
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900 dark:text-white">Submit Feedback</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-500">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                How was your experience with <span className="font-medium text-slate-900 dark:text-white">{selectedAppt?.doctor}</span>?
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Rating</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        type="button" 
                        key={star} 
                        onClick={() => setRating(star)}
                        className={`p-1 transition-colors ${star <= rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'fill-none'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Additional Comments</label>
                <textarea 
                  rows={4}
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Tell us what you liked or how we can improve..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
