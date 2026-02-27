import { VitalReading, VitalThresholds } from '@/lib/types';
import { MOCK_PATIENTS, calculateRiskScore, checkVitalLevel } from '@/lib/mockDataStream';
import VitalChart from '@/components/VitalChart';
import { Heart, Thermometer, Wind, Droplets, Gauge, User, FileText, Activity } from 'lucide-react';

interface AllPatientsReportProps {
  readings: Map<string, VitalReading>;
  history: Map<string, VitalReading[]>;
  thresholds: VitalThresholds;
}

export default function AllPatientsReport({ readings, history, thresholds }: AllPatientsReportProps) {
  return (
    <div className="space-y-10">
      {MOCK_PATIENTS.map(patient => {
        const reading = readings.get(patient.id);
        const patientHistory = history.get(patient.id) || [];
        const risk = reading ? calculateRiskScore(reading, thresholds) : null;

        if (!reading) return null;

        const vitals = [
          { label: 'HR', value: reading.heartRate, unit: 'BPM', level: checkVitalLevel(reading.heartRate, thresholds.heartRate), icon: <Heart className="w-3.5 h-3.5" /> },
          { label: 'BP', value: `${reading.bloodPressureSystolic}/${reading.bloodPressureDiastolic}`, unit: 'mmHg', level: checkVitalLevel(reading.bloodPressureSystolic, thresholds.bloodPressureSystolic), icon: <Gauge className="w-3.5 h-3.5" /> },
          { label: 'Temp', value: reading.temperature, unit: '°C', level: checkVitalLevel(reading.temperature, thresholds.temperature), icon: <Thermometer className="w-3.5 h-3.5" /> },
          { label: 'SpO₂', value: reading.spo2, unit: '%', level: checkVitalLevel(reading.spo2, thresholds.spo2), icon: <Droplets className="w-3.5 h-3.5" /> },
          { label: 'Resp', value: reading.respiratoryRate, unit: '/min', level: checkVitalLevel(reading.respiratoryRate, thresholds.respiratoryRate), icon: <Wind className="w-3.5 h-3.5" /> },
          { label: 'Glucose', value: reading.bloodGlucose, unit: 'mg/dL', level: checkVitalLevel(reading.bloodGlucose, thresholds.bloodGlucose), icon: <Droplets className="w-3.5 h-3.5" /> },
        ];

        const statusColor = risk?.level === 'critical' ? 'border-vital-critical' : risk?.level === 'warning' ? 'border-vital-warning' : 'border-vital-safe';
        const statusBg = risk?.level === 'critical' ? 'bg-destructive/5' : risk?.level === 'warning' ? 'bg-vital-warning/5' : 'bg-vital-safe/5';

        return (
          <div key={patient.id} className={`rounded-2xl border-2 ${statusColor} ${statusBg} overflow-hidden`} style={{ boxShadow: 'var(--shadow-card)' }}>
            {/* Patient header */}
            <div className={`px-6 py-4 flex items-center gap-4 border-b ${statusColor}`}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-secondary-foreground" style={{ background: 'var(--gradient-accent)' }}>
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">{patient.name}</h3>
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{patient.id}</span>
                </div>
                <p className="text-xs text-muted-foreground">{patient.age}y • {patient.gender} • {patient.assignedDoctor} • {patient.hospital}</p>
              </div>
              {risk && (
                <div className={`text-center px-4 py-2 rounded-xl ${
                  risk.level === 'critical' ? 'bg-destructive/10 text-destructive' :
                  risk.level === 'warning' ? 'bg-vital-warning/10 text-vital-warning' :
                  'bg-vital-safe/10 text-vital-safe'
                }`}>
                  <div className="text-2xl font-bold font-mono">{risk.score}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider">Risk Score</div>
                </div>
              )}
            </div>

            <div className="p-6">
              {/* Two columns: patient report + live vitals */}
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Patient Report */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <h4 className="text-sm font-semibold text-foreground">Patient Report</h4>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-4 space-y-2.5 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Medical History</span><span className="text-foreground text-right max-w-[60%]">{patient.medicalHistory.join(', ')}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Known Diseases</span><span className="text-foreground">{patient.knownDiseases.join(', ') || 'None'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Allergies</span><span className="text-foreground">{patient.allergies.join(', ') || 'None'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Medications</span><span className="text-foreground text-right max-w-[60%]">{patient.medications.join(', ')}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Emergency Contact</span><span className="text-foreground">{patient.emergencyContact}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Contact</span><span className="text-foreground">{patient.contact}</span></div>
                  </div>
                </div>

                {/* Live Vitals Summary */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <h4 className="text-sm font-semibold text-foreground">Live Vitals</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {vitals.map(v => {
                      const dotColor = v.level === 'critical' ? 'bg-vital-critical vital-pulse' : v.level === 'warning' ? 'bg-vital-warning' : 'bg-vital-safe';
                      return (
                        <div key={v.label} className="bg-card rounded-xl border border-border p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                            {v.icon}
                            <span className="text-[10px] font-medium uppercase tracking-wide">{v.label}</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                          </div>
                          <div className="text-lg font-bold font-mono text-foreground">{v.value}</div>
                          <div className="text-[10px] text-muted-foreground">{v.unit}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* All charts in a single grid */}
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold text-foreground">Vital Trends</h4>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <VitalChart history={patientHistory} vitalKey="heartRate" label="Heart Rate" color="hsl(0, 72%, 51%)" />
                <VitalChart history={patientHistory} vitalKey="spo2" label="SpO₂" color="hsl(210, 70%, 50%)" />
                <VitalChart history={patientHistory} vitalKey="bloodPressureSystolic" label="BP Systolic" color="hsl(280, 60%, 50%)" />
                <VitalChart history={patientHistory} vitalKey="temperature" label="Temperature" color="hsl(38, 92%, 50%)" />
                <VitalChart history={patientHistory} vitalKey="respiratoryRate" label="Respiratory Rate" color="hsl(175, 60%, 40%)" />
                <VitalChart history={patientHistory} vitalKey="bloodGlucose" label="Blood Glucose" color="hsl(330, 60%, 50%)" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
