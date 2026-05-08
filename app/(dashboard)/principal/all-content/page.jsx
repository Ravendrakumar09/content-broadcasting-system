"use client";

import { useMemo, useState } from "react";
import EmptyState from "../../../components/ui/EmptyState";
import StatusBadge from "../../../components/ui/StatusBadge";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import { useAllContent } from "../../../hooks/useAllContent";
import { formatDateTime, getScheduleLabel } from "../../../utils/formatDate";

const statusOptions = ["all", "pending", "approved", "rejected"];

export default function PrincipalAllContentPage() {
  const { data, loading, error } = useAllContent();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredItems = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return data.filter((item) => {
      const matchesStatus = status === "all" ? true : item.status === status;
      const matchesSearch = searchTerm
        ? `${item.title} ${item.subject}`.toLowerCase().includes(searchTerm)
        : true;

      return matchesStatus && matchesSearch;
    });
  }, [data, search, status]);

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">All Content</h1>
        <p className="mt-1 text-sm text-slate-600">
          Search and filter all uploaded content across statuses.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or subject"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
          />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All statuses" : option}
              </option>
            ))}
          </select>
        </div>
      </section>

      {loading ? <TableSkeleton rows={6} /> : null}

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!loading && !error && !filteredItems.length ? (
        <EmptyState
          title="No matching records"
          description="Try changing status filter or search text."
        />
      ) : null}

      {!loading && filteredItems.length ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Teacher ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Time Window</th>
                <th className="px-4 py-3">Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const scheduleLabel = getScheduleLabel(item.startTime, item.endTime);

                return (
                  <tr key={item.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3 font-medium text-slate-900">{item.title}</td>
                    <td className="px-4 py-3 text-slate-700">{item.subject}</td>
                    <td className="px-4 py-3 text-slate-700">{item.teacherId}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={item.status} variant={item.status} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={scheduleLabel}
                        variant={scheduleLabel.toLowerCase()}
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
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
