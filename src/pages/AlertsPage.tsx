import DashboardLayout from '@/components/DashboardLayout';
import AlertFeed from '@/components/AlertFeed';
import { useVitalStream } from '@/hooks/useVitalStream';

export default function AlertsPage() {
  const { alerts, acknowledgeAlert } = useVitalStream();

  return (
    <DashboardLayout title="All Alerts">
      <AlertFeed alerts={alerts} onAcknowledge={acknowledgeAlert} maxItems={50} />
    </DashboardLayout>
  );
}
