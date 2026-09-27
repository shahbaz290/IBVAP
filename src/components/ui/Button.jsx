export function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-medium rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-3.5 py-2",
  };
  const variants = {
    primary: "bg-navy-900 text-white border-navy-900 hover:bg-navy-800",
    secondary: "bg-white text-ink-700 border-surface-300 hover:bg-surface-50",
    danger: "bg-accent-red text-white border-accent-red hover:bg-accent-redDark",
    ghost: "bg-transparent text-ink-500 border-transparent hover:bg-surface-100",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
