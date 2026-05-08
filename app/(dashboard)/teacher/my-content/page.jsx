"use client";

import { useMemo } from "react";
import Image from "next/image";
import EmptyState from "../../../components/ui/EmptyState";
import StatusBadge from "../../../components/ui/StatusBadge";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import { useContent } from "../../../hooks/useContent";
import { formatDateTime, getScheduleLabel } from "../../../utils/formatDate";

export default function TeacherMyContentPage() {
  const { data, loading, error } = useContent();

  const rows = useMemo(() => {
    return data.map((item) => ({
      ...item,
      scheduleLabel: getScheduleLabel(item.startTime, item.endTime),
    }));
  }, [data]);

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">My Content</h1>
        <p className="mt-1 text-sm text-slate-600">
          Track status, timing, and rejection notes for your uploads.
        </p>
      </header>

      {loading ? <TableSkeleton rows={5} /> : null}

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!loading && !error && !rows.length ? (
        <EmptyState
          title="No content uploaded"
          description="Upload your first content item to start the approval workflow."
        />
      ) : null}

      {!loading && rows.length ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Time Window</th>
                <th className="px-4 py-3">Rejection Reason</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.title}</td>
                  <td className="px-4 py-3 text-slate-700">{item.subject}</td>
                  <td className="px-4 py-3">
                    {item.previewUrl ? (
                      <Image
                        src={item.previewUrl}
                        alt={`${item.title} preview`}
                        width={96}
                        height={56}
                        unoptimized
                        className="h-14 w-24 rounded-md border border-slate-200 object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-500">No preview</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={item.status}
                      variant={item.status}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={item.scheduleLabel}
                      variant={item.scheduleLabel.toLowerCase()}
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    <p>{formatDateTime(item.startTime)}</p>
                    <p>{formatDateTime(item.endTime)}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {item.rejectionReason || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
