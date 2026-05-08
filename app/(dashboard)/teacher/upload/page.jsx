"use client";

import UploadForm from "../../../components/forms/UploadForm";

export default function TeacherUploadPage() {
  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Upload Content</h1>
        <p className="mt-1 text-sm text-slate-600">
          Submit subject content for principal approval.
        </p>
      </header>

      <UploadForm />
    </div>
  );
}
