import api from "./api";
import { getScheduleState } from "../utils/formatDate";

const toArray = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
};

const normalizeContent = (item) => {
  const safeItem = item && typeof item === "object" ? item : {};

  return {
    id: safeItem.id ?? String(Math.random()),
    teacherId: Number(safeItem.teacherId) || 0,
    title: safeItem.title || "Untitled",
    subject: safeItem.subject || "Unknown",
    description: safeItem.description || "",
    fileName: safeItem.fileName || "",
    fileType: safeItem.fileType || "",
    previewUrl: safeItem.previewUrl || "",
    status: safeItem.status || "pending",
    rejectionReason: safeItem.rejectionReason || "",
    startTime: safeItem.startTime || "",
    endTime: safeItem.endTime || "",
    rotationDuration: Number(safeItem.rotationDuration) || 0,
    createdAt: safeItem.createdAt || "",
    scheduleState: getScheduleState(safeItem.startTime, safeItem.endTime),
  };
};

export const getTeacherContent = async (teacherId) => {
  const response = await api.get("/content", {
    params: {
      teacherId,
      _sort: "createdAt",
      _order: "desc",
    },
  });

  return toArray(response.data).map(normalizeContent);
};

export const getAllContent = async () => {
  const response = await api.get("/content", {
    params: {
      _sort: "createdAt",
      _order: "desc",
    },
  });

  return toArray(response.data).map(normalizeContent);
};

export const createContent = async (payload) => {
  const response = await api.post("/content", payload);

  return normalizeContent(response.data);
};

export const getActiveTeacherContent = async (teacherId) => {
  const records = await getTeacherContent(teacherId);

  return records.filter(
    (item) => item.status === "approved" && item.scheduleState === "active"
  );
};
