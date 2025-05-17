import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (auth.token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  const register = useCallback(async (userData) => {
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }));

      const res = await api.post("/auth/register", userData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setAuth((prev) => ({
        ...prev,
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      }));

      return true;
    } catch (err) {
      setAuth((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || "Something went wrong",
      }));
      return false;
    }
  }, []);

  const login = useCallback(async (userData) => {
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }));

      const res = await api.post("/auth/login", userData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setAuth((prev) => ({
        ...prev,
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      }));

      return true;
    } catch (err) {
      setAuth((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || "Something went wrong",
      }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  }, []);

  const clearErrors = useCallback(() => {
    setAuth((prev) => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        register,
        login,
        logout,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
