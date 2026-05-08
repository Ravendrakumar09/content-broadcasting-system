"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";

export const useAuth = (allowedRoles = []) => {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const normalizedRoles = useMemo(() => {
    if (Array.isArray(allowedRoles)) {
      return allowedRoles;
    }

    if (!allowedRoles) {
      return [];
    }

    return [allowedRoles];
  }, [allowedRoles]);

  const isAuthorized =
    !!user &&
    (normalizedRoles.length === 0 || normalizedRoles.includes(user.role));

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    if (!isAuthorized && user.role) {
      const safeRoute =
        user.role === "principal"
          ? "/principal/dashboard"
          : "/teacher/dashboard";

      router.replace(safeRoute);
    }
  }, [isLoading, isAuthorized, pathname, router, user]);

  return {
    user,
    isLoading,
    isAuthorized,
  };
};
