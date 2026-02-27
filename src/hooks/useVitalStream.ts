import { useState, useEffect, useRef, useCallback } from 'react';
import { VitalReading, Alert, VitalThresholds } from '@/lib/types';
import { MOCK_PATIENTS, DEFAULT_THRESHOLDS, generateVitalReading, evaluateVitals } from '@/lib/mockDataStream';

export function useVitalStream(intervalMs = 3000) {
  const [readings, setReadings] = useState<Map<string, VitalReading>>(new Map());
  const [history, setHistory] = useState<Map<string, VitalReading[]>>(new Map());
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [thresholds, setThresholds] = useState<VitalThresholds>(DEFAULT_THRESHOLDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    const newReadings = new Map<string, VitalReading>();
    const newAlerts: Alert[] = [];

    for (const patient of MOCK_PATIENTS) {
      const reading = generateVitalReading(patient.id);
      newReadings.set(patient.id, reading);
      const vitAlerts = evaluateVitals(reading, thresholds);
      newAlerts.push(...vitAlerts);
    }

    setReadings(newReadings);
    setHistory(prev => {
      const next = new Map(prev);
      for (const [pid, reading] of newReadings) {
        const arr = next.get(pid) || [];
        arr.push(reading);
        if (arr.length > 60) arr.shift(); // keep last ~3 min
        next.set(pid, arr);
      }
      return next;
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 100));
    }
  }, [thresholds]);

  useEffect(() => {
    tick(); // initial
    intervalRef.current = setInterval(tick, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick, intervalMs]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
  }, []);

  return { readings, history, alerts, thresholds, setThresholds, acknowledgeAlert };
}
