import DashboardLayout from '@/components/DashboardLayout';
import VitalsGrid from '@/components/VitalsGrid';
import RiskScoreMeter from '@/components/RiskScoreMeter';
import AlertFeed from '@/components/AlertFeed';
import VitalChart from '@/components/VitalChart';
import { useVitalStream } from '@/hooks/useVitalStream';
import { MOCK_PATIENTS, calculateRiskScore } from '@/lib/mockDataStream';
import { useAuth } from '@/contexts/AuthContext';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { readings, history, alerts, thresholds } = useVitalStream();

  // Patient sees their own data (P101)
  const patientId = user?.id || 'P101';
  const patient = MOCK_PATIENTS.find(p => p.id === patientId) || MOCK_PATIENTS[0];
  const reading = readings.get(patient.id);
  const patientHistory = history.get(patient.id) || [];
  const myAlerts = alerts.filter(a => a.patientId === patient.id);

  return (
    <DashboardLayout title="My Health Dashboard">
      {/* Profile card */}
      <div className="bg-card rounded-xl border border-border p-5 mb-6 flex items-center gap-4" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-secondary-foreground" style={{ background: 'var(--gradient-accent)' }}>
          {patient.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">{patient.name}</h2>
          <p className="text-sm text-muted-foreground">{patient.age}y • {patient.gender} • {patient.hospital}</p>
          <p className="text-xs text-muted-foreground">Doctor: {patient.assignedDoctor} • Emergency: {patient.emergencyContact}</p>
        </div>
      </div>

      {reading && (
        <>
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <VitalsGrid reading={reading} thresholds={thresholds} />
            </div>
            <RiskScoreMeter risk={calculateRiskScore(reading, thresholds)} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <VitalChart history={patientHistory} vitalKey="heartRate" label="Heart Rate" color="hsl(0, 72%, 51%)" />
            <VitalChart history={patientHistory} vitalKey="spo2" label="SpO₂" color="hsl(210, 70%, 50%)" />
            <VitalChart history={patientHistory} vitalKey="temperature" label="Temperature" color="hsl(38, 92%, 50%)" />
          </div>

          <AlertFeed alerts={myAlerts} maxItems={10} />
        </>
      )}
    </DashboardLayout>
  );
}
