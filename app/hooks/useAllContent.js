"use client";

import { useCallback, useEffect, useState } from "react";
import { getAllContent } from "../services/content.service";

export const useAllContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAllContent();
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to fetch all content.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
