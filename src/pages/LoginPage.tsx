import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { motion } from 'framer-motion';
import { Heart, Shield, Stethoscope, User } from 'lucide-react';

const roles: { role: UserRole; label: string; icon: React.ReactNode; description: string }[] = [
  { role: 'admin', label: 'Administrator', icon: <Shield className="w-6 h-6" />, description: 'System management & configuration' },
  { role: 'doctor', label: 'Doctor', icon: <Stethoscope className="w-6 h-6" />, description: 'Monitor patients & respond to alerts' },
  { role: 'patient', label: 'Patient', icon: <User className="w-6 h-6" />, description: 'View personal health data' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleLogin = () => {
    if (selectedRole) login(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'var(--gradient-accent)' }}
          >
            <Heart className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">VitalWatch</h1>
          <p className="text-primary-foreground/60 text-sm">Remote Patient Monitoring System</p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-card-foreground mb-1">Sign In</h2>
          <p className="text-sm text-muted-foreground mb-5">Select your role to continue</p>

          <div className="space-y-3 mb-6">
            {roles.map((r, i) => (
              <motion.button
                key={r.role}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                onClick={() => setSelectedRole(r.role)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedRole === r.role
                    ? 'border-secondary bg-accent'
                    : 'border-border hover:border-muted-foreground/30 bg-background'
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  selectedRole === r.role ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {r.icon}
                </div>
                <div>
                  <div className="font-medium text-card-foreground">{r.label}</div>
                  <div className="text-xs text-muted-foreground">{r.description}</div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="space-y-3 mb-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              defaultValue={selectedRole ? `${selectedRole}@hospital.com` : ''}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              defaultValue="••••••••"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-secondary-foreground"
            style={{ background: selectedRole ? 'var(--gradient-accent)' : undefined, backgroundColor: selectedRole ? undefined : 'hsl(var(--muted))' }}
          >
            Sign In as {selectedRole ? roles.find(r => r.role === selectedRole)?.label : '...'}
          </button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo mode — select a role and click Sign In
          </p>
        </div>
      </motion.div>
    </div>
  );
}
