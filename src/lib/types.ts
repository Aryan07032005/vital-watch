// Types for the RPM system

export type UserRole = 'admin' | 'doctor' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  medicalHistory: string[];
  knownDiseases: string[];
  allergies: string[];
  medications: string[];
  emergencyContact: string;
  assignedDoctor: string;
  hospital: string;
}

export interface VitalReading {
  patientId: string;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  spo2: number;
  respiratoryRate: number;
  bloodGlucose: number;
  activityLevel: 'resting' | 'light' | 'moderate' | 'active';
  timestamp: string;
}

export interface VitalThresholds {
  heartRate: { min: number; max: number; criticalMin: number; criticalMax: number };
  bloodPressureSystolic: { min: number; max: number; criticalMin: number; criticalMax: number };
  bloodPressureDiastolic: { min: number; max: number; criticalMin: number; criticalMax: number };
  temperature: { min: number; max: number; criticalMin: number; criticalMax: number };
  spo2: { min: number; max: number; criticalMin: number; criticalMax: number };
  respiratoryRate: { min: number; max: number; criticalMin: number; criticalMax: number };
  bloodGlucose: { min: number; max: number; criticalMin: number; criticalMax: number };
}

export type AlertLevel = 'normal' | 'warning' | 'critical';

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  vital: string;
  value: string;
  level: AlertLevel;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface RiskScore {
  score: number;
  level: AlertLevel;
  factors: string[];
}
