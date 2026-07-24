import Link from "next/link";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
};

type ButtonElementProps =
  BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkElementProps =
  BaseProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  > & {
    href: string;
    external?: boolean;
    prefetch?: boolean;
  };

type ButtonProps =
  | ButtonElementProps
  | LinkElementProps;

const variants: Record<
  ButtonVariant,
  string
> = {
  primary:
    "bg-red-600 text-white hover:bg-red-500",

  secondary:
    "bg-white text-slate-950 hover:bg-slate-200",

  outline:
    "border border-slate-700 bg-transparent text-white hover:border-slate-500 hover:bg-slate-900",
};

function buildClassName(
  variant: ButtonVariant,
  fullWidth: boolean,
  className: string
) {
  return [
    "inline-flex items-center justify-center",
    "rounded-xl px-6 py-4",
    "font-semibold",
    "transition duration-200",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-red-500",
    "focus:ring-offset-2",
    "focus:ring-offset-slate-950",
    fullWidth ? "w-full" : "",
    variants[variant],
    className,
  ].join(" ");
}

export default function Button(
  props: ButtonProps
) {
  const {
    children,
    variant = "primary",
    fullWidth = false,
    className = "",
  } = props;

  const classes = buildClassName(
    variant,
    fullWidth,
    className
  );

  if ("href" in props && props.href) {
    const {
      href,
      external = false,
      prefetch = false,
      ...linkProps
    } = props;

    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...linkProps}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        prefetch={prefetch}
        className={classes}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  const buttonProps =
    props as ButtonElementProps;

  return (
    <button
      {...buttonProps}
      className={classes}
    >
      {children}
    </button>
  );
}