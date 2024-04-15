import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps {
  label: ReactNode;
  icon?: ReactNode;
  hoverText?: string;
  className?: string;
  props?: ButtonHTMLAttributes<HTMLButtonElement>;
  onClick?: () => void;
}

export default function Button({ label, icon, className, props, onClick, hoverText }: ButtonProps) {
  return (
    <button
      className={`btn ${className ?? ""}`}
      onClick={onClick}
      title={hoverText}
      {...props}
    >
      <div className="btn-inner">
        {icon}
        {label}
      </div>
    </button>
  );
}
