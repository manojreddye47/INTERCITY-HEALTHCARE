import React, { useState } from 'react';
import { demoDoctors } from '@/data/demo';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Clock, Plus, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { WorkingHours as WorkingHoursType } from '@/types';

export default function WorkingHours() {
  const doctor = demoDoctors.find((d) => d.id === 'doc-01') || demoDoctors[0];
  const [hours, setHours] = useState<WorkingHoursType>(doctor.workingHours);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

  const handleSave = () => {
    toast.success('Working hours saved successfully');
  };

  const copyToAllWeekdays = (sourceDay: keyof WorkingHoursType) => {
    const sourceData = hours[sourceDay];
    const newHours = { ...hours };
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach((day) => {
      newHours[day as keyof WorkingHoursType] = {
        ...sourceData,
        breaks: [...sourceData.breaks],
      };
    });
    setHours(newHours);
    toast.success(`Copied ${sourceDay} schedule to all weekdays`);
  };

  const addBreak = (day: keyof WorkingHoursType) => {
    const newHours = { ...hours };
    newHours[day].breaks.push({ start: '13:00', end: '14:00' });
    setHours(newHours);
  };

  const removeBreak = (day: keyof WorkingHoursType, index: number) => {
    const newHours = { ...hours };
    newHours[day].breaks.splice(index, 1);
    setHours(newHours);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Working Hours</h1>
          <p className="text-gray-500 dark:text-gray-400">Configure your weekly availability and breaks.</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {days.map((day) => (
            <Card key={day} className={`transition-colors ${!hours[day].enabled ? 'opacity-75 bg-gray-50 dark:bg-gray-800/50' : ''}`}>
              <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                <div className="w-40 flex items-center justify-between md:justify-start gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={hours[day].enabled}
                      onChange={(e) => setHours({ ...hours, [day]: { ...hours[day], enabled: e.target.checked } })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="font-semibold">{day}</span>
                </div>

                {hours[day].enabled ? (
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <Input 
                          type="time" 
                          value={hours[day].start} 
                          onChange={(e) => setHours({ ...hours, [day]: { ...hours[day], start: e.target.value } })}
                          className="w-32"
                        />
                        <span className="text-gray-500">to</span>
                        <Input 
                          type="time" 
                          value={hours[day].end} 
                          onChange={(e) => setHours({ ...hours, [day]: { ...hours[day], end: e.target.value } })}
                          className="w-32"
                        />
                      </div>
                      
                      {day === 'Monday' && (
                        <Button variant="outline" size="sm" onClick={() => copyToAllWeekdays(day)} className="ml-auto flex items-center gap-1">
                          <Copy className="w-4 h-4" /> Copy to Weekdays
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Breaks</span>
                        <Button variant="ghost" size="sm" onClick={() => addBreak(day)} className="h-8 text-blue-600">
                          <Plus className="w-4 h-4 mr-1" /> Add Break
                        </Button>
                      </div>
                      
                      {hours[day].breaks.map((breakItem, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input 
                            type="time" 
                            value={breakItem.start} 
                            onChange={(e) => {
                              const newHours = { ...hours };
                              newHours[day].breaks[idx].start = e.target.value;
                              setHours(newHours);
                            }}
                            className="w-32"
                          />
                          <span className="text-gray-500">-</span>
                          <Input 
                            type="time" 
                            value={breakItem.end} 
                            onChange={(e) => {
                              const newHours = { ...hours };
                              newHours[day].breaks[idx].end = e.target.value;
                              setHours(newHours);
                            }}
                            className="w-32"
                          />
                          <Button variant="ghost" size="sm" onClick={() => removeBreak(day, idx)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {hours[day].breaks.length === 0 && (
                        <p className="text-sm text-gray-500">No breaks scheduled.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center text-gray-500">Day Off</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Schedule Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <p className="text-gray-500 dark:text-gray-400">Your consultation slots are generated based on these hours and your default slot duration (15 mins).</p>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Example: Monday</h4>
                  {hours.Monday.enabled ? (
                    <>
                      <div className="flex justify-between mb-1">
                        <span>Total Working Time:</span>
                        <span className="font-medium">
                          {/* Rough estimation for preview */}
                          {parseInt(hours.Monday.end) - parseInt(hours.Monday.start)} hours
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Total Break Time:</span>
                        <span className="font-medium">{hours.Monday.breaks.length} hours</span>
                      </div>
                      <div className="flex justify-between mt-3 pt-3 border-t dark:border-gray-700">
                        <span>Available Slots:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">~28 slots</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500">Not working on Monday.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
