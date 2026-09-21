import React from 'react';
import { demoShifts } from '@/data/demo';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Clock, Calendar, Briefcase, MapPin } from 'lucide-react';
import { format, isToday, isFuture, parseISO } from 'date-fns';

export default function DoctorShifts() {
  const shifts = demoShifts.filter(s => s.doctorId === 'doc-01').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const currentShift = shifts.find(s => isToday(parseISO(s.date)));
  const upcomingShifts = shifts.filter(s => isFuture(parseISO(s.date)) && !isToday(parseISO(s.date))).slice(0, 5);
  const shiftHistory = shifts.filter(s => !isFuture(parseISO(s.date)) && !isToday(parseISO(s.date))).reverse();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Shifts</h1>
        <p className="text-gray-500 dark:text-gray-400">View your current and upcoming duty shifts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {currentShift ? (
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Current Duty Shift
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500 block">Date</span>
                    <span className="font-semibold flex items-center gap-1"><Calendar className="w-4 h-4"/> {format(parseISO(currentShift.date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500 block">Time</span>
                    <span className="font-semibold flex items-center gap-1"><Clock className="w-4 h-4"/> {currentShift.start} - {currentShift.end}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500 block">Type</span>
                    <span className="font-semibold flex items-center gap-1"><Briefcase className="w-4 h-4"/> {currentShift.shiftType}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500 block">Department</span>
                    <span className="font-semibold flex items-center gap-1"><MapPin className="w-4 h-4"/> {currentShift.department}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                You do not have a shift scheduled for today.
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Shift History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                    <tr>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Time</th>
                      <th className="p-4 font-medium">Type</th>
                      <th className="p-4 font-medium">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {shiftHistory.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-500">No shift history found.</td>
                      </tr>
                    ) : (
                      shiftHistory.map(shift => (
                        <tr key={shift.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="p-4 font-medium">{format(parseISO(shift.date), 'MMM d, yyyy')}</td>
                          <td className="p-4">{shift.start} - {shift.end}</td>
                          <td className="p-4">{shift.shiftType}</td>
                          <td className="p-4">{shift.department}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingShifts.length === 0 ? (
                  <p className="text-gray-500 text-sm">No upcoming shifts scheduled.</p>
                ) : (
                  upcomingShifts.map(shift => (
                    <div key={shift.id} className="flex gap-4 p-3 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 rounded-md p-2 min-w-[60px] shadow-sm border dark:border-gray-600">
                        <span className="text-xs text-gray-500 uppercase">{format(parseISO(shift.date), 'MMM')}</span>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">{format(parseISO(shift.date), 'd')}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{shift.shiftType}</h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3"/> {shift.start} - {shift.end}</p>
                        <p className="text-xs text-gray-400 mt-1">{shift.department}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
