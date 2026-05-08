"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useContent } from "../../hooks/useContent";
import { useAuthContext } from "../../context/AuthContext";
import StatCard from "../ui/StatCard";
import EmptyState from "../ui/EmptyState";

export default function TeacherDashboard() {
  const { user } = useAuthContext();
  const { data, loading, error } = useContent();

  const stats = useMemo(() => {
    const total = data.length;
    const pending = data.filter((item) => item.status === "pending").length;
    const approved = data.filter((item) => item.status === "approved").length;
    const rejected = data.filter((item) => item.status === "rejected").length;

    return { total, pending, approved, rejected };
  }, [data]);

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Teacher Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Upload subject content and track approval status.
        </p>
        {user?.userId ? (
          <Link
            href={`/live/${user.userId}`}
            className="mt-3 inline-flex rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-700"
          >
            Open Public Live Page
          </Link>
        ) : null}
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Uploaded" value={loading ? "..." : stats.total} />
        <StatCard title="Pending" value={loading ? "..." : stats.pending} />
        <StatCard title="Approved" value={loading ? "..." : stats.approved} />
        <StatCard title="Rejected" value={loading ? "..." : stats.rejected} />
      </section>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!loading && !data.length ? (
        <EmptyState
          title="No uploaded content yet"
          description="Your uploaded content will appear here once created."
        />
      ) : null}
    </div>
  );
}
