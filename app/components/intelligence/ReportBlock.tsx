import type { ReactNode } from "react";

type ReportBlockProps = {
  children: ReactNode;
  id?: string;
  className?: string;
};

export default function ReportBlock({
  children,
  id,
  className = "",
}: ReportBlockProps) {
  return (
    <section
      id={id}
      className={[
        "scroll-mt-24",
        "mt-10",
        "transition-all duration-300",
        className,
      ].join(" ")}
    >
      <div className="mx-auto">
        {children}
      </div>
    </section>
  );
}