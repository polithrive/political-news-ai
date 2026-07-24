"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export default function FadeIn({
  children,
  delay = 0,
  className = "",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setTimeout(() => {
          setVisible(true);
        }, delay);

        observer.disconnect();
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`
        transition-all
        duration-700
        ease-out
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}