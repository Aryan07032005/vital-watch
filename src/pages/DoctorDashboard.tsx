import DashboardLayout from '@/components/DashboardLayout';
import VitalsGrid from '@/components/VitalsGrid';
import RiskScoreMeter from '@/components/RiskScoreMeter';
import AlertFeed from '@/components/AlertFeed';
import VitalChart from '@/components/VitalChart';
import AllPatientsReport from '@/components/AllPatientsReport';
import { useVitalStream } from '@/hooks/useVitalStream';
import { MOCK_PATIENTS, calculateRiskScore } from '@/lib/mockDataStream';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert as AlertType } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ArrowRight, LayoutGrid, User } from 'lucide-react';

function CriticalPopup({ alert, onDismiss, onViewPatient }: { alert: AlertType; onDismiss: () => void; onViewPatient: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      className="fixed top-6 right-6 z-50 w-96 rounded-2xl border-2 border-destructive bg-card p-5 critical-flash"
      style={{ boxShadow: 'var(--shadow-critical)' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-destructive">🚨 CRITICAL ALERT</h4>
            <button onClick={onDismiss} className="p-1 rounded-lg hover:bg-muted transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm font-semibold text-foreground">{alert.patientName}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{alert.message}</p>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {new Date(alert.timestamp).toLocaleTimeString()}
          </p>
          <button
            onClick={() => { onViewPatient(alert.patientId); onDismiss(); }}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-secondary-foreground px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'var(--gradient-accent)' }}
          >
            View Patient <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function DoctorDashboard() {
  const { readings, history, alerts, thresholds, acknowledgeAlert } = useVitalStream();
  const [selectedId, setSelectedId] = useState(MOCK_PATIENTS[0].id);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('all');
  const [popup, setPopup] = useState<AlertType | null>(null);
  const seenAlertIds = useRef<Set<string>>(new Set());

  const checkForCriticalAlerts = useCallback(() => {
    for (const alert of alerts) {
      if (alert.level === 'critical' && !alert.acknowledged && !seenAlertIds.current.has(alert.id)) {
        seenAlertIds.current.add(alert.id);
        setPopup(alert);
        setTimeout(() => setPopup(prev => prev?.id === alert.id ? null : prev), 8000);
        break;
      }
    }
  }, [alerts]);

  useEffect(() => {
    checkForCriticalAlerts();
  }, [checkForCriticalAlerts]);

  const selectedPatient = MOCK_PATIENTS.find(p => p.id === selectedId)!;
  const reading = readings.get(selectedId);
  const patientHistory = history.get(selectedId) || [];

  return (
    <DashboardLayout title="Doctor Dashboard">
      <AnimatePresence>
        {popup && (
          <CriticalPopup
            alert={popup}
            onDismiss={() => setPopup(null)}
            onViewPatient={(id) => { setSelectedId(id); setViewMode('single'); }}
          />
        )}
      </AnimatePresence>

      {/* View mode toggle */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setViewMode('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            viewMode === 'all' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          <LayoutGrid className="w-4 h-4" /> All Patients & Reports
        </button>
        <button
          onClick={() => setViewMode('single')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            viewMode === 'single' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="w-4 h-4" /> Single Patient
        </button>
      </div>

      {viewMode === 'all' ? (
        <AllPatientsReport readings={readings} history={history} thresholds={thresholds} />
      ) : (
        <>
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
        </>
      )}
    </DashboardLayout>
  );
}
