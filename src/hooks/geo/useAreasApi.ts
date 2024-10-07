import { useCallback, useEffect, useState } from "react";
import { useAdminApi } from "@/hooks/useRoleApi";
import { ApiArea } from "@/types/geo/Area";

export const useAreasApi = () => {
  const { request, loading: apiLoading, error: apiError } = useAdminApi();
  const [areas, setAreas] = useState<ApiArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAreas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request<ApiArea[]>("get", "/areas");
      if (response) {
        setAreas(response);
        return response;
      }
    } catch (err) {
      setError("Error fetching areas. Please try again.");
    } finally {
      setLoading(false);
    }
    return [];
  }, [request]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const updateArea = async (area: ApiArea) => {
    try {
      await request("put", `/api/areas/${area.id}`, area);
      await fetchAreas();
    } catch (err) {
      setError("Error updating area. Please try again.");
    }
  };

  const deleteArea = async (id: string) => {
    try {
      await request("delete", `/api/areas/${id}`);
      await fetchAreas();
    } catch (err) {
      setError("Error deleting area. Please try again.");
    }
  };

  const createArea = async (area: Omit<ApiArea, "id">) => {
    try {
      await request("post", "/api/areas", area);
      await fetchAreas();
    } catch (err) {
      setError("Error creating area. Please try again.");
    }
  };

  return {
    areas,
    loading: loading || apiLoading,
    error: error || apiError,
    fetchAreas,
    updateArea,
    deleteArea,
    createArea,
  };
};
