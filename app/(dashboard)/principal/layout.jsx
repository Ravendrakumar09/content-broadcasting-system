"use client";

import DashboardShell from "../../components/layout/DashboardShell";
import { useAuth } from "../../hooks/useAuth";

export default function PrincipalLayout({ children }) {
  const { isLoading, isAuthorized } = useAuth("principal");

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Checking your access...
      </div>
    );
  }

  return <DashboardShell role="principal">{children}</DashboardShell>;
}
