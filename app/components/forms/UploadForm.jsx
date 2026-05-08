"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { createContent } from "../../services/content.service";
import { validateContentForm } from "../../validations/content.schema";
import { fileToDataUrl } from "../../utils/validateFile";
import { useAuthContext } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import ToastStack from "../ui/ToastStack";

const defaultValues = {
  title: "",
  subject: "",
  description: "",
  startTime: "",
  endTime: "",
  rotationDuration: "15",
};

export default function UploadForm({ onSuccess }) {
  const { user } = useAuthContext();
  const { toasts, pushToast, dismissToast } = useToast();

  const [values, setValues] = useState(defaultValues);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schedulePreview = useMemo(() => {
    if (!values.startTime || !values.endTime) {
      return "Fill start and end time to preview schedule status.";
    }

    const start = new Date(values.startTime);
    const end = new Date(values.endTime);
    const now = new Date();

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return "Invalid date selected.";
    }

    if (end <= start) {
      return "End time must be after start time.";
    }

    if (now < start) {
      return "Current schedule status: Scheduled";
    }

    if (now > end) {
      return "Current schedule status: Expired";
    }

    return "Current schedule status: Active";
  }, [values.endTime, values.startTime]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setSelectedFile(file);
    setErrors((current) => ({
      ...current,
      file: "",
    }));

    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const resetForm = () => {
    setValues(defaultValues);
    setSelectedFile(null);
    setPreviewUrl("");
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateContentForm({
      ...values,
      file: selectedFile,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!selectedFile || !user?.userId) {
      pushToast("Missing file or user session.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const previewDataUrl = await fileToDataUrl(selectedFile);

      const payload = {
        teacherId: user.userId,
        title: values.title.trim(),
        subject: values.subject.trim(),
        description: values.description.trim(),
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        previewUrl: previewDataUrl,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
        rotationDuration: Number(values.rotationDuration) || 0,
        status: "pending",
        rejectionReason: "",
        createdAt: new Date().toISOString(),
      };

      await createContent(payload);
      pushToast("Content uploaded successfully and sent for approval.", "success");
      resetForm();
      onSuccess?.();
    } catch (error) {
      pushToast(error.message || "Upload failed. Please retry.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900">Upload Content</h2>
        <p className="mt-1 text-sm text-slate-600">
          Allowed file formats: JPG, PNG, GIF up to 10MB.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Title" error={errors.title} required>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Subject" error={errors.subject} required>
            <input
              type="text"
              name="subject"
              value={values.subject}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Start Time" error={errors.startTime} required>
            <input
              type="datetime-local"
              name="startTime"
              value={values.startTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="End Time" error={errors.endTime} required>
            <input
              type="datetime-local"
              name="endTime"
              value={values.endTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Rotation Duration (seconds)" error={errors.rotationDuration}>
            <input
              type="number"
              name="rotationDuration"
              min="1"
              value={values.rotationDuration}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Upload File" error={errors.file} required>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Description" error={errors.description}>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Optional details"
              />
            </Field>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          {schedulePreview}
        </div>

        {previewUrl ? (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-slate-700">Preview</p>
            <Image
              src={previewUrl}
              alt="Selected content preview"
              width={640}
              height={360}
              unoptimized
              className="max-h-64 w-auto rounded-lg border border-slate-200"
            />
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Uploading..." : "Upload Content"}
        </button>
      </form>
    </>
  );
}

function Field({ label, required = false, error = "", children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required ? " *" : ""}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
