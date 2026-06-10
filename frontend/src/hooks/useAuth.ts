import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté via l'API
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");
      const { data } = await api.get("/v1/me");
      return data;
    },
    retry: false,
  });

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem("auth_token");
    queryClient.setQueryData(["auth-user"], null);
    navigate("/login");
  };

  return { user, isLoading, isAuthenticated: !!user && !isError, logout };
};
