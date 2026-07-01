import { INSTITUTION_LOGO_TAGLINE, INSTITUTION_LOGO_WORDMARK } from "./institution-branding";

type Props = {
  /** Header bar (white text) vs loader / light surfaces vs dark sidebar */
  variant?: "header" | "default" | "sidebar";
  className?: string;
};

/** Text wordmark: WFT with Institutions below — no image logo. */
export function InstitutionLogoMark({ variant = "default", className = "" }: Props) {
  return (
    <div
      className={`institution-logo-mark institution-logo-mark--${variant}${className ? ` ${className}` : ""}`}
      aria-label={`${INSTITUTION_LOGO_WORDMARK} ${INSTITUTION_LOGO_TAGLINE}`}
    >
      <span className="institution-logo-mark-word">{INSTITUTION_LOGO_WORDMARK}</span>
      <span className="institution-logo-mark-tagline">{INSTITUTION_LOGO_TAGLINE}</span>
    </div>
  );
}
