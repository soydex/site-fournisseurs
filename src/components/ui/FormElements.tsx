import React, {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => (
  <div className="flex flex-col gap-2 w-full group">
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 group-focus-within:text-comy-red transition-colors duration-300 ml-1">
      {label}
    </label>
    <input
      className={`px-4 py-3 bg-white/50 backdrop-blur-sm border rounded-xl outline-none transition-all duration-300
      placeholder:text-slate-300 font-medium text-slate-800
      ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
          : "border-slate-200 hover:border-slate-300 focus:border-comy-red focus:ring-4 focus:ring-comy-red/10 shadow-sm focus:shadow-lg"
      } 
      ${className}`}
      {...props}
    />
    {error && (
      <span className="text-xs text-red-500 font-medium ml-1 animate-pulse">
        {error}
      </span>
    )}
  </div>
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: string[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = "",
  ...props
}) => (
  <div className="flex flex-col gap-2 w-full group">
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 group-focus-within:text-comy-red transition-colors duration-300 ml-1">
      {label}
    </label>
    <div className="relative">
      <select
        className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm border rounded-xl outline-none appearance-none transition-all duration-300 font-medium text-slate-800
        ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            : "border-slate-200 hover:border-slate-300 focus:border-comy-red focus:ring-4 focus:ring-comy-red/10 shadow-sm focus:shadow-lg"
        } 
        ${className}`}
        {...props}
      >
        <option value="" className="text-slate-400">
          Sélectionner une option
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
    {error && (
      <span className="text-xs text-red-500 font-medium ml-1">{error}</span>
    )}
  </div>
);

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className = "",
  ...props
}) => (
  <div className="flex flex-col gap-2 w-full group">
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 group-focus-within:text-comy-red transition-colors duration-300 ml-1">
      {label}
    </label>
    <textarea
      className={`px-4 py-3 bg-white/50 backdrop-blur-sm border rounded-xl outline-none transition-all duration-300 min-h-[120px] resize-y font-medium text-slate-800
      placeholder:text-slate-300
      ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
          : "border-slate-200 hover:border-slate-300 focus:border-comy-red focus:ring-4 focus:ring-comy-red/10 shadow-sm focus:shadow-lg"
      } 
      ${className}`}
      {...props}
    />
    {error && (
      <span className="text-xs text-red-500 font-medium ml-1">{error}</span>
    )}
  </div>
);

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
  }
> = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyles =
    "px-6 py-3 rounded-xl font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 text-sm";
  const variants = {
    primary:
      "bg-comy-red text-white hover:bg-red-700 shadow-glow hover:shadow-red-600/40 hover:-translate-y-0.5 border border-transparent",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg hover:-translate-y-0.5",
    danger:
      "bg-white text-red-600 border border-red-100 hover:bg-red-50 hover:border-red-200 shadow-sm",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
