import { RiskScore as RiskScoreType } from '@/lib/types';
import { motion } from 'framer-motion';

interface RiskScoreMeterProps {
  risk: RiskScoreType;
  patientName?: string;
}

export default function RiskScoreMeter({ risk, patientName }: RiskScoreMeterProps) {
  const color = risk.level === 'critical' ? 'var(--vital-critical)' : risk.level === 'warning' ? 'var(--vital-warning)' : 'var(--vital-safe)';
  const label = risk.level === 'critical' ? '🔴 Critical' : risk.level === 'warning' ? '🟡 Warning' : '🟢 Safe';

  return (
    <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Health Risk Score</h3>
          {patientName && <p className="text-xs text-muted-foreground">{patientName}</p>}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>

      <div className="relative h-3 rounded-full bg-muted overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${risk.score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: `hsl(${color})` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold font-mono text-foreground">{risk.score}</span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>

      {risk.factors.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {risk.factors.map((f, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">{f}</span>
          ))}
        </div>
      )}
    </div>
  );
}
