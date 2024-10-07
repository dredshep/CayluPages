import { useCallback, useState } from "react";
import api from "@/utils/api";
import { AxiosError, AxiosResponse } from "axios";

type ApiMethod = "get" | "post" | "put" | "delete" | "patch";

const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const request = useCallback(
    async <T>(
      method: ApiMethod,
      url: string,
      data: any = null,
      headers: Record<string, string> = {},
    ): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const response: AxiosResponse<T> = await api[method](url, data, {
          headers,
        });
        setLoading(false);
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        setLoading(false);
        throw axiosError;
      }
    },
    [],
  );

  return { loading, error, request };
};

export default useApi;
