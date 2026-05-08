"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import StatusBadge from "../../../components/ui/StatusBadge";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import ToastStack from "../../../components/ui/ToastStack";
import { useAllContent } from "../../../hooks/useAllContent";
import { useToast } from "../../../hooks/useToast";
import { updateContentStatus } from "../../../services/approval.service";
import { formatDateTime } from "../../../utils/formatDate";

export default function PrincipalApprovalPage() {
  const { data, loading, error, refetch } = useAllContent();
  const { toasts, pushToast, dismissToast } = useToast();

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [reason, setReason] = useState("");

  const pendingItems = useMemo(
    () => data.filter((item) => item.status === "pending"),
    [data]
  );

  const handleApprove = async (contentId) => {
    setActionLoadingId(contentId);

    try {
      await updateContentStatus({
        contentId,
        status: "approved",
      });

      pushToast("Content approved.", "success");
      await refetch();
    } catch (err) {
      pushToast(err.message || "Failed to approve content.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      pushToast("Rejection reason is required.", "error");
      return;
    }

    if (!rejectTarget) {
      return;
    }

    setActionLoadingId(rejectTarget.id);

    try {
      await updateContentStatus({
        contentId: rejectTarget.id,
        status: "rejected",
        rejectionReason: reason.trim(),
      });

      pushToast("Content rejected.", "success");
      setRejectTarget(null);
      setReason("");
      await refetch();
    } catch (err) {
      pushToast(err.message || "Failed to reject content.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Pending Approval</h1>
        <p className="mt-1 text-sm text-slate-600">
          Approve or reject content with mandatory reason for rejection.
        </p>
      </header>

      {loading ? <TableSkeleton rows={6} /> : null}

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!loading && !error && !pendingItems.length ? (
        <EmptyState
          title="No pending items"
          description="All content is reviewed. New pending uploads will appear here."
        />
      ) : null}

      {!loading && pendingItems.length ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingItems.map((item) => (
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
                  <td className="px-4 py-3 text-xs text-slate-600">
                    <p>{formatDateTime(item.startTime)}</p>
                    <p>{formatDateTime(item.endTime)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge label={item.status} variant={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={actionLoadingId === item.id}
                        onClick={() => handleApprove(item.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={actionLoadingId === item.id}
                        onClick={() => {
                          setRejectTarget(item);
                          setReason("");
                        }}
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {rejectTarget ? (
        <Modal
          title="Reject Content"
          description={`Add rejection reason for "${rejectTarget.title}"`}
          onClose={() => {
            setRejectTarget(null);
            setReason("");
          }}
          onConfirm={handleReject}
          confirmLabel="Reject Content"
          isLoading={actionLoadingId === rejectTarget.id}
        >
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Rejection reason *
          </label>
          <textarea
            rows={4}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Enter a clear reason"
          />
        </Modal>
      ) : null}
    </div>
  );
}
