import DashboardLayout from '@/components/DashboardLayout';
import VitalsGrid from '@/components/VitalsGrid';
import RiskScoreMeter from '@/components/RiskScoreMeter';
import AlertFeed from '@/components/AlertFeed';
import VitalChart from '@/components/VitalChart';
import { useVitalStream } from '@/hooks/useVitalStream';
import { MOCK_PATIENTS, calculateRiskScore } from '@/lib/mockDataStream';
import { Users, AlertTriangle, Activity, HeartPulse } from 'lucide-react';

export default function AdminDashboard() {
  const { readings, history, alerts, thresholds, acknowledgeAlert } = useVitalStream();

  const criticalPatients = MOCK_PATIENTS.filter(p => {
    const r = readings.get(p.id);
    if (!r) return false;
    return calculateRiskScore(r, thresholds).level === 'critical';
  });

  const totalAlerts = alerts.filter(a => !a.acknowledged).length;

  const stats = [
    { label: 'Total Patients', value: MOCK_PATIENTS.length, icon: <Users className="w-5 h-5" />, color: 'var(--gradient-accent)' },
    { label: 'Critical', value: criticalPatients.length, icon: <AlertTriangle className="w-5 h-5" />, color: 'var(--gradient-critical)' },
    { label: 'Active Alerts', value: totalAlerts, icon: <Activity className="w-5 h-5" />, color: 'var(--gradient-warning)' },
    { label: 'Monitoring', value: readings.size, icon: <HeartPulse className="w-5 h-5" />, color: 'var(--gradient-safe)' },
  ];

  // Pick first patient for detail view
  const selectedPatient = MOCK_PATIENTS[0];
  const selectedReading = readings.get(selectedPatient.id);
  const selectedHistory = history.get(selectedPatient.id) || [];

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl p-4 text-primary-foreground" style={{ background: s.color }}>
            <div className="flex items-center gap-2 mb-2 opacity-80">{s.icon}<span className="text-xs font-medium">{s.label}</span></div>
            <div className="text-3xl font-bold font-mono">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Patient list */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">All Patients</h3>
            </div>
            <div className="divide-y divide-border">
              {MOCK_PATIENTS.map(p => {
                const r = readings.get(p.id);
                const risk = r ? calculateRiskScore(r, thresholds) : null;
                return (
                  <div key={p.id} className="px-5 py-3 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.age}y • {p.gender} • {p.assignedDoctor}</div>
                    </div>
                    {r && (
                      <div className="text-right">
                        <div className="text-sm font-mono text-foreground">{r.heartRate} BPM</div>
                        <div className="text-xs text-muted-foreground">SpO₂ {r.spo2}%</div>
                      </div>
                    )}
                    {risk && (
                      <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        risk.level === 'critical' ? 'bg-destructive/10 text-destructive' :
                        risk.level === 'warning' ? 'bg-vital-warning/10 text-vital-warning' :
                        'bg-vital-safe/10 text-vital-safe'
                      }`}>
                        {risk.score}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <AlertFeed alerts={alerts} onAcknowledge={acknowledgeAlert} />
      </div>

      {/* Detail: first patient */}
      {selectedReading && (
        <>
          <h2 className="text-lg font-semibold text-foreground mb-3">Live Monitoring — {selectedPatient.name}</h2>
          <VitalsGrid reading={selectedReading} thresholds={thresholds} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <VitalChart history={selectedHistory} vitalKey="heartRate" label="Heart Rate" color="hsl(0, 72%, 51%)" />
            <VitalChart history={selectedHistory} vitalKey="spo2" label="SpO₂" color="hsl(210, 70%, 50%)" />
            <VitalChart history={selectedHistory} vitalKey="temperature" label="Temperature" color="hsl(38, 92%, 50%)" />
          </div>
          <div className="mt-4">
            <RiskScoreMeter risk={calculateRiskScore(selectedReading, thresholds)} patientName={selectedPatient.name} />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
