import { useCallback, useEffect, useState } from "react";
import useApi from "./useApi";
import useAuth from "./useAuth";
import { AxiosError } from "axios";

type ApiMethod = "get" | "post" | "put" | "delete" | "patch";

const useRoleApi = (requiredRole: string) => {
  const { request: apiRequest } = useApi();
  const { user, isAdmin, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [internalUser, setInternalUser] = useState(user);
  const [internalIsAdmin, setInternalIsAdmin] = useState(isAdmin);
  const [internalToken, setInternalToken] = useState(token);

  useEffect(() => {
    setInternalUser(user);
    setInternalIsAdmin(isAdmin);
    setInternalToken(token);
    setError(null);
  }, [user, isAdmin, token]);

  const request = useCallback(
    async <T>(
      method: ApiMethod,
      url: string,
      data: any = null
    ): Promise<T | null> => {
      if (!internalUser) {
        setError(new AxiosError("User not authenticated"));
        return null;
      }

      if (requiredRole === "Admin" && !internalIsAdmin) {
        setError(new AxiosError("User does not have admin privileges"));
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        if (internalToken) {
          const response = await apiRequest<T>(method, url, data, {
            Authorization: `Bearer ${internalToken}`,
          });
          setLoading(false);
          return response;
        } else {
          setError(new AxiosError("User not authenticated"));
          return null;
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        setLoading(false);
        return null;
      }
    },
    [apiRequest, internalUser, internalIsAdmin, internalToken, requiredRole]
  );

  return { loading, error, request };
};

export const useAdminApi = () => useRoleApi("Admin");

// Add other role-specific hooks as needed, for example:
// export const useManagerApi = () => useRoleApi('manager');
// export const useEmployeeApi = () => useRoleApi('employee');

export default useRoleApi;
