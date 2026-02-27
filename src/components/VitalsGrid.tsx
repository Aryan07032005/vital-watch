import { VitalReading, VitalThresholds, AlertLevel } from '@/lib/types';
import { checkVitalLevel } from '@/lib/mockDataStream';
import { motion } from 'framer-motion';
import { Heart, Thermometer, Wind, Droplets, Activity, Gauge } from 'lucide-react';
import { ReactNode } from 'react';

interface VitalCardProps {
  label: string;
  value: number;
  unit: string;
  icon: ReactNode;
  level: AlertLevel;
  index?: number;
}

function VitalCard({ label, value, unit, icon, level, index = 0 }: VitalCardProps) {
  const levelStyles: Record<AlertLevel, string> = {
    normal: 'border-vital-safe/20 bg-card',
    warning: 'border-vital-warning/40 bg-card',
    critical: 'border-vital-critical/40 bg-card critical-flash',
  };

  const dotColor: Record<AlertLevel, string> = {
    normal: 'bg-vital-safe',
    warning: 'bg-vital-warning',
    critical: 'bg-vital-critical',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl border-2 p-4 transition-all ${levelStyles[level]}`}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
        <div className={`w-2.5 h-2.5 rounded-full ${dotColor[level]} ${level !== 'normal' ? 'vital-pulse' : ''}`} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold font-mono text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </motion.div>
  );
}

interface VitalsGridProps {
  reading: VitalReading;
  thresholds: VitalThresholds;
}

export default function VitalsGrid({ reading, thresholds }: VitalsGridProps) {
  const vitals: Omit<VitalCardProps, 'index'>[] = [
    { label: 'Heart Rate', value: reading.heartRate, unit: 'BPM', icon: <Heart className="w-4 h-4" />, level: checkVitalLevel(reading.heartRate, thresholds.heartRate) },
    { label: 'BP Systolic', value: reading.bloodPressureSystolic, unit: 'mmHg', icon: <Gauge className="w-4 h-4" />, level: checkVitalLevel(reading.bloodPressureSystolic, thresholds.bloodPressureSystolic) },
    { label: 'BP Diastolic', value: reading.bloodPressureDiastolic, unit: 'mmHg', icon: <Gauge className="w-4 h-4" />, level: checkVitalLevel(reading.bloodPressureDiastolic, thresholds.bloodPressureDiastolic) },
    { label: 'Temperature', value: reading.temperature, unit: '°C', icon: <Thermometer className="w-4 h-4" />, level: checkVitalLevel(reading.temperature, thresholds.temperature) },
    { label: 'SpO₂', value: reading.spo2, unit: '%', icon: <Droplets className="w-4 h-4" />, level: checkVitalLevel(reading.spo2, thresholds.spo2) },
    { label: 'Resp. Rate', value: reading.respiratoryRate, unit: '/min', icon: <Wind className="w-4 h-4" />, level: checkVitalLevel(reading.respiratoryRate, thresholds.respiratoryRate) },
    { label: 'Glucose', value: reading.bloodGlucose, unit: 'mg/dL', icon: <Droplets className="w-4 h-4" />, level: checkVitalLevel(reading.bloodGlucose, thresholds.bloodGlucose) },
    { label: 'Activity', value: reading.activityLevel === 'resting' ? 0 : reading.activityLevel === 'light' ? 1 : reading.activityLevel === 'moderate' ? 2 : 3, unit: ['Rest', 'Light', 'Mod', 'Active'][reading.activityLevel === 'resting' ? 0 : reading.activityLevel === 'light' ? 1 : reading.activityLevel === 'moderate' ? 2 : 3], icon: <Activity className="w-4 h-4" />, level: 'normal' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {vitals.map((v, i) => <VitalCard key={v.label} {...v} index={i} />)}
    </div>
  );
}
