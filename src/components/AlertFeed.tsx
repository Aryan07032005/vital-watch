import { Alert } from '@/lib/types';
import { Bell, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertFeedProps {
  alerts: Alert[];
  onAcknowledge?: (id: string) => void;
  maxItems?: number;
}

export default function AlertFeed({ alerts, onAcknowledge, maxItems = 10 }: AlertFeedProps) {
  const displayed = alerts.slice(0, maxItems);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Bell className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Emergency Alerts</h3>
        <span className="ml-auto text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium">
          {alerts.filter(a => !a.acknowledged).length} active
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-border">
        <AnimatePresence>
          {displayed.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">No alerts</div>
          )}
          {displayed.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`px-5 py-3 flex items-start gap-3 ${alert.acknowledged ? 'opacity-50' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                alert.level === 'critical' ? 'bg-vital-critical vital-pulse' : 'bg-vital-warning'
              }`} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">{alert.patientName}</div>
                <div className="text-xs text-muted-foreground">{alert.message}</div>
                <div className="text-xs text-muted-foreground/60 mt-0.5 font-mono">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
              {onAcknowledge && !alert.acknowledged && (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="flex-shrink-0 p-1.5 rounded-lg bg-muted hover:bg-secondary hover:text-secondary-foreground transition-colors"
                  title="Acknowledge"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
