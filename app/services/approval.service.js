import api from "./api";

export const updateContentStatus = async ({
  contentId,
  status,
  rejectionReason = "",
}) => {
  const response = await api.patch(`/content/${contentId}`, {
    status,
    rejectionReason,
  });

  return response.data;
};

export const getPendingContent = async () => {
  const response = await api.get("/content", {
    params: {
      status: "pending",
      _sort: "createdAt",
      _order: "desc",
    },
  });

  return Array.isArray(response.data) ? response.data : [];
};
