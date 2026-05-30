import { AlertCircle } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  action?: React.ReactNode;
}

export function ErrorBanner({ message, action }: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      <AlertCircle size={18} aria-hidden="true" />
      <span>{message}</span>
      {action}
    </div>
  );
}
