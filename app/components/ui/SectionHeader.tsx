import { colors } from "@/lib/design/theme";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  divider?: boolean;
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  divider = true,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <header>
      <div
        className={
          centered
            ? "mx-auto max-w-3xl text-center"
            : "max-w-3xl"
        }
      >
        <p
          className="text-xs font-semibold uppercase tracking-[0.24em]"
          style={{
            color: colors.brand.primary,
          }}
        >
          {eyebrow}
        </p>

        <h2
          className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          style={{
            color: colors.text.primary,
          }}
        >
          {title}
        </h2>

        {subtitle ? (
          <p
            className="mt-3 text-sm leading-6 sm:text-base sm:leading-7"
            style={{
              color: colors.text.secondary,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {divider ? (
        <div
          className="mt-8 h-px"
          style={{
            backgroundColor: colors.border.default,
          }}
        />
      ) : null}
    </header>
  );
}