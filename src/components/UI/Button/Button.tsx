import React from "react";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  label?: string;
  url?: string;
  target?: "_blank" | "_self";
  rel?: string;
  href?: string; // Add href for anchor tag compatibility
  type?: "button" | "submit" | "reset" | "link";
}
// Combine with anchor props if needed, or keep it simple since it renders both
type Props = ButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function Button({
  label,
  onClick,
  className,
  disabled,
  type,
  children,
  url,
  target,
  rel,
  ...rest
}: Props) {
  const finalRel =
    target === "_blank"
      ? rel
        ? `${rel} noopener noreferrer`
        : "noopener noreferrer"
      : rel;

  return (
    <>
      {type === "link" && (
        <a
          onClick={onClick}
          className={`btn ${className}`}
          aria-label={label}
          href={url}
          target={target}
          rel={finalRel}
          role="button"
          {...rest}
        >
          <div className="btn__content"> {children}</div>
          <div className="btn__overlay"></div>
        </a>
      )}
      {type === "submit" && (
        <button
          onClick={onClick}
          className={`btn ${className}`}
          disabled={disabled}
          aria-label={label}
          role="button"
          type="submit"
          {...rest}
        >
          <div className="btn__content"> {children}</div>
          <div className="btn__overlay"></div>
        </button>
      )}
      {type === "button" && (
        <button
          onClick={onClick}
          className={`btn ${className}`}
          disabled={disabled}
          type="button"
          aria-label={label}
          role="button"
          {...rest}
        >
          <div className="btn__content"> {children}</div>
          <div className="btn__overlay"></div>
        </button>
      )}
    </>
  );
}
