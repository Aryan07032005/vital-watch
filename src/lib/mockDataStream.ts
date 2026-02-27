import { Patient, VitalReading, VitalThresholds, Alert, AlertLevel, RiskScore } from './types';

// Mock patients
export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P101', name: 'Sarah Johnson', age: 68, gender: 'Female', contact: '+1-555-0101',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'], knownDiseases: ['Hypertension'],
    allergies: ['Penicillin'], medications: ['Metformin', 'Lisinopril'],
    emergencyContact: '+1-555-0102', assignedDoctor: 'Dr. Smith', hospital: 'City General'
  },
  {
    id: 'P102', name: 'James Miller', age: 72, gender: 'Male', contact: '+1-555-0201',
    medicalHistory: ['COPD', 'Atrial Fibrillation'], knownDiseases: ['COPD'],
    allergies: ['Sulfa drugs'], medications: ['Warfarin', 'Albuterol'],
    emergencyContact: '+1-555-0202', assignedDoctor: 'Dr. Smith', hospital: 'City General'
  },
  {
    id: 'P103', name: 'Maria Garcia', age: 55, gender: 'Female', contact: '+1-555-0301',
    medicalHistory: ['Asthma'], knownDiseases: ['Asthma'],
    allergies: [], medications: ['Fluticasone'],
    emergencyContact: '+1-555-0302', assignedDoctor: 'Dr. Chen', hospital: 'Metro Health'
  },
  {
    id: 'P104', name: 'Robert Davis', age: 80, gender: 'Male', contact: '+1-555-0401',
    medicalHistory: ['Heart Failure', 'Chronic Kidney Disease'], knownDiseases: ['CHF'],
    allergies: ['Aspirin'], medications: ['Furosemide', 'Enalapril'],
    emergencyContact: '+1-555-0402', assignedDoctor: 'Dr. Chen', hospital: 'Metro Health'
  },
  {
    id: 'P105', name: 'Emily Chen', age: 45, gender: 'Female', contact: '+1-555-0501',
    medicalHistory: ['Type 1 Diabetes'], knownDiseases: ['Type 1 Diabetes'],
    allergies: ['Latex'], medications: ['Insulin'],
    emergencyContact: '+1-555-0502', assignedDoctor: 'Dr. Smith', hospital: 'City General'
  },
];

export const DEFAULT_THRESHOLDS: VitalThresholds = {
  heartRate: { min: 60, max: 100, criticalMin: 40, criticalMax: 130 },
  bloodPressureSystolic: { min: 90, max: 140, criticalMin: 70, criticalMax: 180 },
  bloodPressureDiastolic: { min: 60, max: 90, criticalMin: 40, criticalMax: 120 },
  temperature: { min: 36.5, max: 37.5, criticalMin: 35.0, criticalMax: 39.5 },
  spo2: { min: 95, max: 100, criticalMin: 90, criticalMax: 100 },
  respiratoryRate: { min: 12, max: 20, criticalMin: 8, criticalMax: 30 },
  bloodGlucose: { min: 70, max: 140, criticalMin: 50, criticalMax: 250 },
};

function randomInRange(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

// Store last readings per patient for realistic continuity
const lastReadings: Map<string, VitalReading> = new Map();

export function generateVitalReading(patientId: string): VitalReading {
  const last = lastReadings.get(patientId);
  const drift = (base: number, range: number) => {
    const change = (Math.random() - 0.5) * range;
    return Math.round((base + change) * 10) / 10;
  };

  // Occasionally inject anomalies (15% chance)
  const anomaly = Math.random() < 0.15;

  let reading: VitalReading;

  if (last && !anomaly) {
    reading = {
      patientId,
      heartRate: Math.max(50, Math.min(140, drift(last.heartRate, 6))),
      bloodPressureSystolic: Math.max(80, Math.min(190, drift(last.bloodPressureSystolic, 8))),
      bloodPressureDiastolic: Math.max(50, Math.min(120, drift(last.bloodPressureDiastolic, 5))),
      temperature: Math.max(35, Math.min(40, drift(last.temperature, 0.3))),
      spo2: Math.max(85, Math.min(100, drift(last.spo2, 2))),
      respiratoryRate: Math.max(8, Math.min(32, drift(last.respiratoryRate, 2))),
      bloodGlucose: Math.max(50, Math.min(260, drift(last.bloodGlucose, 10))),
      activityLevel: ['resting', 'light', 'moderate', 'active'][Math.floor(Math.random() * 4)] as VitalReading['activityLevel'],
      timestamp: new Date().toISOString(),
    };
  } else {
    // Fresh or anomaly reading
    const isAnomalous = anomaly;
    reading = {
      patientId,
      heartRate: isAnomalous ? randomInRange(40, 140) : randomInRange(65, 95),
      bloodPressureSystolic: isAnomalous ? randomInRange(80, 180) : randomInRange(110, 135),
      bloodPressureDiastolic: isAnomalous ? randomInRange(50, 110) : randomInRange(65, 85),
      temperature: isAnomalous ? randomInRange(35.5, 39.5) : randomInRange(36.4, 37.4),
      spo2: isAnomalous ? randomInRange(88, 100) : randomInRange(95, 99),
      respiratoryRate: isAnomalous ? randomInRange(9, 28) : randomInRange(13, 19),
      bloodGlucose: isAnomalous ? randomInRange(55, 240) : randomInRange(75, 130),
      activityLevel: ['resting', 'light', 'moderate', 'active'][Math.floor(Math.random() * 4)] as VitalReading['activityLevel'],
      timestamp: new Date().toISOString(),
    };
  }

  lastReadings.set(patientId, reading);
  return reading;
}

export function checkVitalLevel(value: number, threshold: { min: number; max: number; criticalMin: number; criticalMax: number }): AlertLevel {
  if (value < threshold.criticalMin || value > threshold.criticalMax) return 'critical';
  if (value < threshold.min || value > threshold.max) return 'warning';
  return 'normal';
}

export function evaluateVitals(reading: VitalReading, thresholds: VitalThresholds): Alert[] {
  const alerts: Alert[] = [];
  const patient = MOCK_PATIENTS.find(p => p.id === reading.patientId);
  const pName = patient?.name || reading.patientId;

  const checks: { key: keyof VitalThresholds; label: string; value: number; unit: string }[] = [
    { key: 'heartRate', label: 'Heart Rate', value: reading.heartRate, unit: 'BPM' },
    { key: 'bloodPressureSystolic', label: 'BP Systolic', value: reading.bloodPressureSystolic, unit: 'mmHg' },
    { key: 'bloodPressureDiastolic', label: 'BP Diastolic', value: reading.bloodPressureDiastolic, unit: 'mmHg' },
    { key: 'temperature', label: 'Temperature', value: reading.temperature, unit: '°C' },
    { key: 'spo2', label: 'SpO₂', value: reading.spo2, unit: '%' },
    { key: 'respiratoryRate', label: 'Resp. Rate', value: reading.respiratoryRate, unit: '/min' },
    { key: 'bloodGlucose', label: 'Blood Glucose', value: reading.bloodGlucose, unit: 'mg/dL' },
  ];

  for (const check of checks) {
    const level = checkVitalLevel(check.value, thresholds[check.key]);
    if (level !== 'normal') {
      alerts.push({
        id: `${reading.patientId}-${check.key}-${Date.now()}`,
        patientId: reading.patientId,
        patientName: pName,
        vital: check.label,
        value: `${check.value} ${check.unit}`,
        level,
        message: `${check.label} ${level === 'critical' ? 'CRITICAL' : 'Warning'}: ${check.value} ${check.unit}`,
        timestamp: reading.timestamp,
        acknowledged: false,
      });
    }
  }

  return alerts;
}

export function calculateRiskScore(reading: VitalReading, thresholds: VitalThresholds): RiskScore {
  let score = 0;
  const factors: string[] = [];

  const checks: { key: keyof VitalThresholds; label: string; value: number; weight: number }[] = [
    { key: 'heartRate', label: 'Heart Rate', value: reading.heartRate, weight: 15 },
    { key: 'bloodPressureSystolic', label: 'BP Systolic', value: reading.bloodPressureSystolic, weight: 15 },
    { key: 'spo2', label: 'SpO₂', value: reading.spo2, weight: 20 },
    { key: 'temperature', label: 'Temperature', value: reading.temperature, weight: 12 },
    { key: 'respiratoryRate', label: 'Resp. Rate', value: reading.respiratoryRate, weight: 12 },
    { key: 'bloodGlucose', label: 'Blood Glucose', value: reading.bloodGlucose, weight: 10 },
    { key: 'bloodPressureDiastolic', label: 'BP Diastolic', value: reading.bloodPressureDiastolic, weight: 10 },
  ];

  for (const check of checks) {
    const level = checkVitalLevel(check.value, thresholds[check.key]);
    if (level === 'critical') {
      score += check.weight;
      factors.push(`${check.label} critical`);
    } else if (level === 'warning') {
      score += check.weight * 0.5;
      factors.push(`${check.label} elevated`);
    }
  }

  // Normalize to 0-100
  score = Math.min(100, Math.round(score));
  const level: AlertLevel = score >= 60 ? 'critical' : score >= 30 ? 'warning' : 'normal';

  return { score, level, factors };
}
