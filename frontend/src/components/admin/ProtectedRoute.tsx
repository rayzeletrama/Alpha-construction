import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("auth_token");

  // 1. Pendant que useAuth vérifie le token avec le backend
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Vérification des accès...
        </p>
      </div>
    );
  }

  // 2. Si aucun token n'existe localement OU si le backend a renvoyé une erreur (isAuthenticated est false)
  if (!token || !isAuthenticated || !user) {
    // On redirige vers login en gardant en mémoire la page où il voulait aller
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Si tout est OK, on affiche la page admin demandée
  return <Outlet />;
};
