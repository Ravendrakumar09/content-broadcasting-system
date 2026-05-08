"use client";

import { useCallback, useEffect, useState } from "react";
import { getTeacherContent } from "../services/content.service";
import { useAuthContext } from "../context/AuthContext";

export const useContent = () => {
  const { user } = useAuthContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContent = useCallback(async () => {
    if (!user?.userId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await getTeacherContent(user.userId);
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to fetch content.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    data,
    loading,
    error,
    refetch: fetchContent,
  };
};
