"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import EmptyState from "../../components/ui/EmptyState";
import { useContent } from "../../hooks/useContent";

export default function TeacherLivePage({ params }) {
  const resolvedParams = use(params);
  const teacherId = resolvedParams?.teacherId;

  const { data } = useContent();  

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLiveContent = useCallback(async () => {
    if (!teacherId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setError("");

    try {
      const scheduleStateStatus = data.filter((item) => item.scheduleState === "active");
      setRecords(scheduleStateStatus);
    } catch (err) {
      setError(err.message || "Unable to load live content.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [teacherId, data]);

  useEffect(() => {
    fetchLiveContent();

    const timer = setInterval(fetchLiveContent, 30000);

    return () => clearInterval(timer);
  }, [fetchLiveContent]);

  const primary = useMemo(() => records[0] || null, [records]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-6">

        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <p className="text-xs uppercase tracking-[0.18em] text-sky-400">
            Public Live Page
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Teacher {teacherId} Broadcast
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            This page auto-refreshes every 30 seconds.
          </p>
        </header>


        {loading && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-300">Loading active content...</p>
          </section>
        )}

        {error && (
          <section className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5 text-sm text-rose-200">
            {error}
          </section>
        )}

        {!loading && !error && !records.length && (
          <EmptyState
            title="No approved content available"
            description="There is no approved live content right now."
          />
        )}

        {!loading &&
          records.map((item) => (
            <section
              key={item.id}
              className="flex items-start gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl"
            >
          
              <div className="shrink-0">
                {item.previewUrl ? (
                  <Image
                    src={item.previewUrl}
                    alt={`${item.title} preview`}
                    width={220}
                    height={140}
                    unoptimized
                    className="h-60 w-56 rounded-2xl border border-slate-700 object-cover"
                  />
                ) : (
                  <div className="flex h-60 w-56 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-sm text-slate-400">
                    Preview unavailable
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-sky-400">
                      Now Active
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-white">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-300">
                      {item.description}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium capitalize text-emerald-400">
                    {item.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">Subject</p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {item.subject}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">Schedule State</p>

                    <p className="mt-1 text-sm font-medium capitalize text-white">
                      {item.scheduleState}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">Rotation</p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {item.rotationDuration} sec
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">Start Time</p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {new Date(item.startTime).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">End Time</p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {new Date(item.endTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ))}
      </div>
    </main>
  );
}
