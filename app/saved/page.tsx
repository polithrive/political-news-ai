import ShellInfoPage from "@/app/components/shell/ShellInfoPage";

export default function SavedPage() {
  return (
    <ShellInfoPage
      kicker="Library"
      title="Saved"
      description="Saved briefs will live here so you can come back to a story without hunting through Today. Sign in on this device, then use Share on a brief for now — personal saves are next."
      primaryHref="/signin?next=/saved"
      primaryLabel="Sign in"
    />
  );
}
