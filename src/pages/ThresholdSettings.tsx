import DashboardLayout from '@/components/DashboardLayout';
import { useVitalStream } from '@/hooks/useVitalStream';
import { VitalThresholds } from '@/lib/types';
import { useState } from 'react';

type ThresholdKey = keyof VitalThresholds;

const VITAL_LABELS: Record<ThresholdKey, { label: string; unit: string }> = {
  heartRate: { label: 'Heart Rate', unit: 'BPM' },
  bloodPressureSystolic: { label: 'BP Systolic', unit: 'mmHg' },
  bloodPressureDiastolic: { label: 'BP Diastolic', unit: 'mmHg' },
  temperature: { label: 'Temperature', unit: '°C' },
  spo2: { label: 'SpO₂', unit: '%' },
  respiratoryRate: { label: 'Respiratory Rate', unit: '/min' },
  bloodGlucose: { label: 'Blood Glucose', unit: 'mg/dL' },
};

export default function ThresholdSettings() {
  const { thresholds, setThresholds } = useVitalStream();
  const [local, setLocal] = useState<VitalThresholds>({ ...thresholds });
  const [saved, setSaved] = useState(false);

  const updateField = (key: ThresholdKey, field: 'min' | 'max' | 'criticalMin' | 'criticalMax', value: number) => {
    setLocal(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
    setSaved(false);
  };

  const handleSave = () => {
    setThresholds(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout title="Threshold Configuration">
      <div className="max-w-4xl">
        <p className="text-sm text-muted-foreground mb-6">
          Configure safe and critical ranges for patient vital monitoring. Values outside safe range trigger warnings; values outside critical range trigger emergencies.
        </p>

        <div className="space-y-4">
          {(Object.keys(VITAL_LABELS) as ThresholdKey[]).map(key => (
            <div key={key} className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-foreground">{VITAL_LABELS[key].label}</h3>
                <span className="text-xs text-muted-foreground">({VITAL_LABELS[key].unit})</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['criticalMin', 'min', 'max', 'criticalMax'] as const).map(field => (
                  <div key={field}>
                    <label className="text-xs text-muted-foreground block mb-1">
                      {field === 'criticalMin' ? 'Critical Low' : field === 'min' ? 'Warning Low' : field === 'max' ? 'Warning High' : 'Critical High'}
                    </label>
                    <input
                      type="number"
                      step={key === 'temperature' ? 0.1 : 1}
                      value={local[key][field]}
                      onChange={e => updateField(key, field, parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-secondary-foreground transition-all"
            style={{ background: 'var(--gradient-accent)' }}
          >
            Save Thresholds
          </button>
          {saved && <span className="text-sm text-vital-safe font-medium">✓ Saved successfully</span>}
        </div>
      </div>
    </DashboardLayout>
  );
}
