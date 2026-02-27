import DashboardLayout from '@/components/DashboardLayout';
import VitalsGrid from '@/components/VitalsGrid';
import RiskScoreMeter from '@/components/RiskScoreMeter';
import AlertFeed from '@/components/AlertFeed';
import VitalChart from '@/components/VitalChart';
import { useVitalStream } from '@/hooks/useVitalStream';
import { MOCK_PATIENTS, calculateRiskScore } from '@/lib/mockDataStream';
import { useState } from 'react';

export default function DoctorDashboard() {
  const { readings, history, alerts, thresholds, acknowledgeAlert } = useVitalStream();
  const [selectedId, setSelectedId] = useState(MOCK_PATIENTS[0].id);

  const selectedPatient = MOCK_PATIENTS.find(p => p.id === selectedId)!;
  const reading = readings.get(selectedId);
  const patientHistory = history.get(selectedId) || [];

  return (
    <DashboardLayout title="Doctor Dashboard">
      {/* Patient selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {MOCK_PATIENTS.map(p => {
          const r = readings.get(p.id);
          const risk = r ? calculateRiskScore(r, thresholds) : null;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                selectedId === p.id ? 'border-secondary bg-accent' : 'border-border bg-card hover:border-muted-foreground/30'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${
                risk?.level === 'critical' ? 'bg-vital-critical vital-pulse' :
                risk?.level === 'warning' ? 'bg-vital-warning' : 'bg-vital-safe'
              }`} />
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">{p.name}</div>
                <div className="text-xs text-muted-foreground">{r ? `${r.heartRate} BPM` : '...'}</div>
              </div>
            </button>
          );
        })}
      </div>

      {reading && (
        <>
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <VitalsGrid reading={reading} thresholds={thresholds} />
            </div>
            <RiskScoreMeter risk={calculateRiskScore(reading, thresholds)} patientName={selectedPatient.name} />
          </div>

          {/* Patient info */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
              <h3 className="text-sm font-semibold text-foreground mb-3">Patient Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Age</span><span className="text-foreground">{selectedPatient.age}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Gender</span><span className="text-foreground">{selectedPatient.gender}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Known Diseases</span><span className="text-foreground">{selectedPatient.knownDiseases.join(', ') || 'None'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Allergies</span><span className="text-foreground">{selectedPatient.allergies.join(', ') || 'None'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Medications</span><span className="text-foreground">{selectedPatient.medications.join(', ')}</span></div>
              </div>
            </div>
            <AlertFeed alerts={alerts.filter(a => a.patientId === selectedId)} onAcknowledge={acknowledgeAlert} maxItems={5} />
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <VitalChart history={patientHistory} vitalKey="heartRate" label="Heart Rate Trend" color="hsl(0, 72%, 51%)" />
            <VitalChart history={patientHistory} vitalKey="spo2" label="SpO₂ Trend" color="hsl(210, 70%, 50%)" />
            <VitalChart history={patientHistory} vitalKey="bloodPressureSystolic" label="BP Systolic" color="hsl(280, 60%, 50%)" />
            <VitalChart history={patientHistory} vitalKey="temperature" label="Temperature" color="hsl(38, 92%, 50%)" />
            <VitalChart history={patientHistory} vitalKey="respiratoryRate" label="Respiratory Rate" color="hsl(175, 60%, 40%)" />
            <VitalChart history={patientHistory} vitalKey="bloodGlucose" label="Blood Glucose" color="hsl(330, 60%, 50%)" />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
