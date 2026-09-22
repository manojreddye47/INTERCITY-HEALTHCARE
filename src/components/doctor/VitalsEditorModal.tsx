import React, { useState, useEffect } from 'react';
import { Activity, Plus, Trash2, Check, X, Heart, Thermometer, Droplet, Scale } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export interface VitalItem {
  id: string;
  label: string;
  value: string;
  unit: string;
}

interface VitalsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  initialVitals: Record<string, string>;
  onSave: (vitals: Record<string, string>) => void;
}

const PRESET_VITALS = [
  { label: 'Blood Pressure', unit: 'mmHg', placeholder: '120/80', icon: Activity },
  { label: 'Heart Rate', unit: 'bpm', placeholder: '72', icon: Heart },
  { label: 'Body Temperature', unit: '°F', placeholder: '98.6', icon: Thermometer },
  { label: 'SpO2 Oxygen', unit: '%', placeholder: '98', icon: Droplet },
  { label: 'Blood Glucose', unit: 'mg/dL', placeholder: '95', icon: Droplet },
  { label: 'Body Weight', unit: 'kg', placeholder: '68', icon: Scale },
];

export function VitalsEditorModal({
  isOpen,
  onClose,
  patientName,
  initialVitals,
  onSave,
}: VitalsEditorModalProps) {
  const [vitalList, setVitalList] = useState<VitalItem[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const items: VitalItem[] = Object.entries(initialVitals).map(([key, val], idx) => {
        let unit = '';
        let cleanVal = val;
        if (val.includes('bpm')) {
          unit = 'bpm';
          cleanVal = val.replace('bpm', '').trim();
        } else if (val.includes('°F')) {
          unit = '°F';
          cleanVal = val.replace('°F', '').trim();
        } else if (val.includes('%')) {
          unit = '%';
          cleanVal = val.replace('%', '').trim();
        } else if (val.includes('kg')) {
          unit = 'kg';
          cleanVal = val.replace('kg', '').trim();
        } else if (val.includes('mmHg')) {
          unit = 'mmHg';
          cleanVal = val.replace('mmHg', '').trim();
        }

        let label = key.toUpperCase();
        if (key === 'bp') label = 'Blood Pressure';
        if (key === 'pulse') label = 'Heart Rate';
        if (key === 'temp') label = 'Body Temperature';
        if (key === 'spo2') label = 'SpO2 Oxygen';
        if (key === 'glucose') label = 'Blood Glucose';
        if (key === 'weight') label = 'Body Weight';

        return {
          id: `vital-${idx}-${key}`,
          label,
          value: cleanVal,
          unit,
        };
      });
      setVitalList(items);
      setIsAddingCustom(false);
    }
  }, [isOpen, initialVitals]);

  if (!isOpen) return null;

  const handleUpdateValue = (id: string, val: string) => {
    setVitalList(prev => prev.map(item => item.id === id ? { ...item, value: val } : item));
  };

  const handleUpdateUnit = (id: string, unit: string) => {
    setVitalList(prev => prev.map(item => item.id === id ? { ...item, unit } : item));
  };

  const handleRemoveVital = (id: string) => {
    setVitalList(prev => prev.filter(item => item.id !== id));
    toast.info('Vital parameter removed');
  };

  const handleAddPreset = (preset: typeof PRESET_VITALS[0]) => {
    const existing = vitalList.find(v => v.label.toLowerCase() === preset.label.toLowerCase());
    if (existing) {
      toast.warning(`${preset.label} is already in the list`);
      return;
    }
    const newItem: VitalItem = {
      id: `vital-${Date.now()}`,
      label: preset.label,
      value: preset.placeholder,
      unit: preset.unit,
    };
    setVitalList(prev => [...prev, newItem]);
    toast.success(`Added ${preset.label}`);
  };

  const handleAddCustomVital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newValue.trim()) {
      toast.error('Please enter both vital parameter name and value');
      return;
    }
    const newItem: VitalItem = {
      id: `vital-${Date.now()}`,
      label: newLabel.trim(),
      value: newValue.trim(),
      unit: newUnit.trim(),
    };
    setVitalList(prev => [...prev, newItem]);
    setNewLabel('');
    setNewValue('');
    setNewUnit('');
    setIsAddingCustom(false);
    toast.success(`Added ${newItem.label}`);
  };

  const handleSave = () => {
    const record: Record<string, string> = {};
    vitalList.forEach(item => {
      let key = item.label.toLowerCase().replace(/\s+/g, '_');
      if (item.label.toLowerCase().includes('pressure') || item.label.toLowerCase() === 'bp') key = 'bp';
      if (item.label.toLowerCase().includes('pulse') || item.label.toLowerCase().includes('heart')) key = 'pulse';
      if (item.label.toLowerCase().includes('temp')) key = 'temp';

      const formattedVal = item.unit ? `${item.value} ${item.unit}`.trim() : item.value;
      record[key] = formattedVal;
    });

    onSave(record);
    toast.success(`Patient vitals updated for ${patientName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-0">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Manage Patient Vitals
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Patient: <span className="font-semibold text-slate-700 dark:text-slate-200">{patientName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Add Presets */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Add Common Vitals
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_VITALS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleAddPreset(preset)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3 h-3 text-blue-500" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Vitals List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Current Readings ({vitalList.length})
              </span>
              <button
                type="button"
                onClick={() => setIsAddingCustom(!isAddingCustom)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom Metric</span>
              </button>
            </div>

            {/* Custom Input Form */}
            {isAddingCustom && (
              <form onSubmit={handleAddCustomVital} className="p-3 mb-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block">Add Custom Vital Parameter</span>
                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="text"
                    placeholder="Name (e.g. Respiratory Rate)"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="col-span-6 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Value (16)"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="col-span-3 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Unit (/min)"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="col-span-3 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(false)}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <Button size="sm" type="submit" className="h-7 text-xs px-3 rounded-xl bg-blue-600 hover:bg-blue-700">
                    Add
                  </Button>
                </div>
              </form>
            )}

            {vitalList.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                No vitals recorded. Use the buttons above to add patient vitals.
              </div>
            ) : (
              <div className="space-y-2">
                {vitalList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => handleUpdateValue(item.id, e.target.value)}
                          className="w-28 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                        />
                        <input
                          type="text"
                          value={item.unit}
                          placeholder="unit"
                          onChange={(e) => handleUpdateUnit(item.id, e.target.value)}
                          className="w-18 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-300 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveVital(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Remove vital metric"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <Button
            type="button"
            onClick={handleSave}
            className="rounded-xl px-5 h-9 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            Save Vitals
          </Button>
        </div>
      </div>
    </div>
  );
}
