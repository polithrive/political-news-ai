export function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16 16L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ClockIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 8v4.2L14.8 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ScalesIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4v16" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 20h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 6H6l-3 5h6l-3-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 6h6l3 5h-6l-3-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 4 6 6.5v5.3c0 3.6 2.4 6.3 6 7.7 3.6-1.4 6-4.1 6-7.7V6.5L12 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12.2 11.2 14l3.4-3.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PeopleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="9" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="9" r="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.8 18c.6-2.4 2.6-3.8 4.8-3.8s4.2 1.4 4.8 3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14.2 14.6c1.7 0 3.3 1 3.9 2.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlayIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M9 7.5v9l8-4.5-8-4.5Z" />
    </svg>
  );
}

export function DocumentIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7 4.5h7l4 4V19.5H7V4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M14 4.5V9h4.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function ChartIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 16V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 16V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 16v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function LinkIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M10 14a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 6.93"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 10a5 5 0 0 0-7.07 0L5.52 11.41a5 5 0 0 0 7.07 7.07L14 17.07"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
