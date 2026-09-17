interface EyebrowProps {
  label: string;
  className?: string;
  dark?: boolean;
}

export default function Eyebrow({ label, className = "", dark = false }: EyebrowProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span
        className={`orbit-loader ${dark ? "text-ink" : "text-white"}`}
        aria-hidden="true"
      />
      <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        {label}
      </span>
    </div>
  );
}
