interface EyebrowProps {
  label: string;
  className?: string;
  dark?: boolean;
}

export default function Eyebrow({ label, className = "" }: EyebrowProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        {label}
      </span>
    </div>
  );
}
