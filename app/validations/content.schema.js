import { validateFile } from "../utils/validateFile";

export const validateContentForm = ({
  title,
  subject,
  file,
  startTime,
  endTime,
  rotationDuration,
}) => {
  const errors = {};

  if (!title?.trim()) {
    errors.title = "Title is required.";
  }

  if (!subject?.trim()) {
    errors.subject = "Subject is required.";
  }

  const fileError = validateFile(file);
  if (fileError) {
    errors.file = fileError;
  }

  if (!startTime) {
    errors.startTime = "Start time is required.";
  }

  if (!endTime) {
    errors.endTime = "End time is required.";
  }

  const start = startTime ? new Date(startTime) : null;
  const end = endTime ? new Date(endTime) : null;

  if (start && end && end <= start) {
    errors.endTime = "End time must be after start time.";
  }

  if (rotationDuration !== "" && Number(rotationDuration) <= 0) {
    errors.rotationDuration = "Rotation duration must be greater than 0.";
  }

  return errors;
};
