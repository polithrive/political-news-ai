import ShellInfoPage from "@/app/components/shell/ShellInfoPage";

export default function NotInV1Page() {
  return (
    <ShellInfoPage
      kicker="V1"
      title="This is not part of The Angle Report V1"
      description="We are focused on 60-second briefs for today’s stories. Accounts, polls, forecasts, saved lists, and similar surfaces are not live yet."
      primaryLabel="Read Today"
    />
  );
}
