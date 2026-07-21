import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
};

export default function ControlButton({
  children,
  className,
  icon,
  ...props
}: ControlButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold",
        "transition duration-200 hover:-translate-y-0.5 hover:border-amber-200/50 hover:bg-white/10",
        "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0",
        className,
      )}
      type="button"
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
