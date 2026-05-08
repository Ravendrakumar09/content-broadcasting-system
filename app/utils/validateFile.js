const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const validateFile = (file) => {
  if (!file) {
    return "File is required.";
  }

  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG, and GIF files are allowed.";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File size must be 10MB or smaller.";
  }

  return "";
};

export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file."));

    reader.readAsDataURL(file);
  });
};
