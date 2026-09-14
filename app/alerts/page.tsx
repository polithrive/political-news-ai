import ShellInfoPage from "@/app/components/shell/ShellInfoPage";

export default function AlertsPage() {
  return (
    <ShellInfoPage
      kicker="Library"
      title="Alerts"
      description="Story alerts are not live yet. When they are, you can get a ping when a watched story moves — without turning Home into a notification feed."
      primaryHref="/premium"
      primaryLabel="See Premium"
    />
  );
}
