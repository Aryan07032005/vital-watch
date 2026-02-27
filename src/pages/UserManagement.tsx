import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_PATIENTS } from '@/lib/mockDataStream';

export default function UserManagement() {
  return (
    <DashboardLayout title="User Management">
      <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Registered Patients</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">ID</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Age</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Gender</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Doctor</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Hospital</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Diseases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_PATIENTS.map(p => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-mono text-foreground">{p.id}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.age}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.gender}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.assignedDoctor}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.hospital}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.knownDiseases.join(', ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
