import type { ButtonHTMLAttributes } from "react";
import css from "./Button.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  view?: string;
}

export const Button: React.FC<Props> = ({
  children,
  isLoading = false,
  disabled,
  className = "",
  view = "",
  ...props
}) => {
  return (
    <button
      className={`${css.button} ${css[view]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
