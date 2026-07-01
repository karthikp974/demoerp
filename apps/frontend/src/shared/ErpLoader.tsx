import type { CSSProperties } from "react";
import { InstitutionLogoMark } from "./InstitutionLogoMark";

type ErpLoaderTheme = "light" | "dark";

type ErpLoaderProps = {
  label?: string;
  theme?: ErpLoaderTheme;
  size?: number;
  fullScreen?: boolean;
};

export function ErpLoader({ label = "", theme, size = 116, fullScreen = false }: ErpLoaderProps) {
  const style = { "--erp-loader-size": `${size}px` } as CSSProperties;

  return (
    <div
      className={`erp-loader ${fullScreen ? "erp-loader-fullscreen" : "erp-loader-inline"}`}
      data-theme={theme}
      style={style}
      role="status"
      aria-live="polite"
    >
      <div className="erp-loader-mark">
        <div className="erp-loader-ring erp-loader-ring-blue" />
        <div className="erp-loader-ring erp-loader-ring-red" />
        <div className="erp-loader-disc">
          <InstitutionLogoMark className="institution-logo-mark--loader" />
        </div>
      </div>
      {label ? <p className="erp-loader-label">{label}</p> : null}
    </div>
  );
}

export function WftLoader(props: Omit<ErpLoaderProps, "theme">) {
  return <ErpLoader {...props} theme="light" />;
}

export function WftLoaderSDK(props: ErpLoaderProps) {
  return <ErpLoader {...props} />;
}
