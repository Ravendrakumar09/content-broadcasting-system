"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useAuthContext } from "../../context/AuthContext";

const NAV_ITEMS = {
  teacher: [
    { href: "/teacher/dashboard", label: "Dashboard" },
    { href: "/teacher/upload", label: "Upload Content" },
    { href: "/teacher/my-content", label: "My Content" },
  ],
  principal: [
    { href: "/principal/dashboard", label: "Dashboard" },
    { href: "/principal/approval", label: "Pending Approval" },
    { href: "/principal/all-content", label: "All Content" },
  ],
};

export default function DashboardShell({ role, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthContext();

  const links = useMemo(() => NAV_ITEMS[role] || [], [role]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex w-full max-w-7xl gap-6 p-4 md:p-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex">
          <div>
            <h1 className="text-base font-bold text-slate-900">Broadcast CMS</h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
              {role} panel
            </p>

            <nav className="mt-6 space-y-2">
              {links.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-sky-100 text-sky-700"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Signed in as</p>
            <p className="mt-1 break-all text-sm font-medium text-slate-900">
              {user?.email || "-"}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:hidden">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">Broadcast CMS</p>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                Logout
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {links.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      active
                        ? "bg-sky-100 text-sky-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <main>{children}</main>
        </section>
      </div>
    </div>
  );
}
