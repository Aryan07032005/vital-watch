import { VitalReading } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface VitalChartProps {
  history: VitalReading[];
  vitalKey: keyof Pick<VitalReading, 'heartRate' | 'spo2' | 'temperature' | 'bloodPressureSystolic' | 'respiratoryRate' | 'bloodGlucose'>;
  label: string;
  color: string;
}

export default function VitalChart({ history, vitalKey, label, color }: VitalChartProps) {
  const data = history.map((r, i) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    value: r[vitalKey],
    idx: i,
  }));

  return (
    <div className="bg-card rounded-xl border border-border p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{label}</h4>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={35} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} animationDuration={300} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
