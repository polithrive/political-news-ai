"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

export default function AnimatedCounter({
  value,
  duration = 900,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);

  useEffect(() => {
    const start = previousValue.current;
    const change = value - start;
    const startTime = performance.now();

    let frameId: number;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      const current = start + change * eased;

      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        previousValue.current = value;
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}