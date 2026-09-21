import React from 'react';
import { demoFeedback } from '@/data/demo';
import { PageHeader } from '@/components/shared/PageHeader';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function FeedbackAnalysis() {
  const ratingData = [
    { name: '5 Star', count: 450 },
    { name: '4 Star', count: 290 },
    { name: '3 Star', count: 67 },
    { name: '2 Star', count: 18 },
    { name: '1 Star', count: 9 },
  ];

  const trendData = [
    { month: 'Jan', rating: 4.6 },
    { month: 'Feb', rating: 4.7 },
    { month: 'Mar', rating: 4.8 },
    { month: 'Apr', rating: 4.7 },
    { month: 'May', rating: 4.9 },
    { month: 'Jun', rating: 4.8 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Feedback" description="Analyze patient satisfaction and reviews" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">4.8</div>
          <div className="flex justify-center text-yellow-400 mb-2">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
          </div>
          <div className="text-sm text-gray-500">Average Rating</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
          <div className="text-sm text-gray-500 mb-1">Total Feedback</div>
          <div className="text-3xl font-bold dark:text-white">834</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-green-100 dark:border-green-900/30 flex flex-col justify-center">
          <div className="text-sm text-green-600 dark:text-green-400 mb-1">Positive (4-5★)</div>
          <div className="text-3xl font-bold dark:text-white">89%</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 flex flex-col justify-center">
          <div className="text-sm text-red-600 dark:text-red-400 mb-1">Negative (1-2★)</div>
          <div className="text-3xl font-bold dark:text-white">3%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Rating Distribution</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} stroke="#9ca3af" />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="#fbbf24" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Trend Over Time</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis domain={[4, 5]} stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={3} dot={{r:4, fill: '#3b82f6'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="font-bold dark:text-white flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Recent Feedback</h3>
        </div>
        <div className="divide-y dark:divide-gray-700">
          {demoFeedback.map(f => (
            <div key={f.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">{f.patientId}</span>
                  <span className="text-gray-500 text-sm ml-2">• {f.doctorId}</span>
                </div>
                <div className="flex text-yellow-400">
                  {Array.from({length: 5}).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < f.overallRating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />)}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{f.comment}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{format(new Date(f.createdAt), 'dd MMM yyyy')}</span>
                <span className={`px-2 py-0.5 rounded-full ${f.overallRating >= 4 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : f.overallRating === 3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {f.overallRating >= 4 ? 'Positive' : f.overallRating === 3 ? 'Neutral' : 'Negative'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
