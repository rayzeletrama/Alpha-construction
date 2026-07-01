import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  BookOpen,
  Mail,
  Package,
  Settings,
  LogOut,
  Files,
  Menu,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios"; // Vérifie bien ton alias @ ou ../..

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // 1. Récupération des données avec gestion d'état complète
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => (await api.get("/v1/dashboard")).data,
    refetchInterval: 30000,
    retry: 1, // On ne réessaie qu'une fois pour rediriger vite si le token est mort
  });

  // Fermer la sidebar sur mobile quand on change de page
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // 2. GESTION DES ÉTATS CRITIQUES (Sécurité & UX)

  // A. Chargement (Évite l'écran blanc)
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Initialisation du panel...
        </p>
      </div>
    );
  }

  // B. Erreur d'authentification ou expiration de session (Sécurité)
  // Si l'API renvoie 401 ou si une erreur survient, on redirige vers le login
  if (isError || !dashboardData) {
    localStorage.removeItem("auth_token");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const unreadCount = dashboardData?.unread_leads_count || 0;
  const tenantName = dashboardData?.tenant_info?.name || "ADMIN";

  const menuItems = [
    {
      name: "Tableau de bord",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Page Accueil", path: "/admin/home", icon: <Home size={20} /> },
    {
      name: "Messages",
      path: "/admin/leads",
      icon: <Mail size={20} />,
      badge: unreadCount,
    },
    {
      name: "Articles Détails",
      path: "/admin/articles",
      icon: <BookOpen size={20} />,
    },
    {
      name: "Maçonnerie",
      path: "/admin/maconnerie",
      icon: <Package size={20} />,
    },
    {
      name: "Rénovation",
      path: "/admin/renovation",
      icon: <Package size={20} />,
    },
    {
      name: "Terrassement",
      path: "/admin/terrassement",
      icon: <Package size={20} />,
    },
    {
      name: "Portfolio",
      path: "/admin/realisations",
      icon: <Files size={20} />,
    },
    { name: "Contact", path: "/admin/contact", icon: <Mail size={20} /> },
    {
      name: "Paramètres",
      path: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black text-white flex items-center justify-between px-6 z-[60]">
        <span className="font-black tracking-tighter text-xl uppercase">
          {tenantName.split(" ")[0]}
        </span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-primary"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 w-72 bg-black text-white p-8 flex flex-col z-[80]
        transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="hidden lg:block text-2xl font-black tracking-tighter mb-12 uppercase">
          {tenantName}
          <span className="text-primary text-[10px] uppercase block tracking-[0.3em] mt-1">
            Système de Gestion
          </span>
        </div>

        <nav className="flex-1 space-y-1 mt-8 lg:mt-0 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-5 py-3.5 rounded-sm transition-all group ${
                location.pathname === item.path
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`${location.pathname === item.path ? "text-white" : "text-gray-600 group-hover:text-primary"} transition-colors`}
                >
                  {item.icon}
                </span>
                <span className="font-bold text-sm tracking-tight">
                  {item.name}
                </span>
              </div>

              {item.badge > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-red-500 text-white text-[10px] font-black h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full border-2 border-black"
                >
                  {item.badge}
                </motion.span>
              )}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => {
            if (confirm("Voulez-vous vous déconnecter ?")) {
              localStorage.removeItem("auth_token");
              window.location.href = "/login";
            }
          }}
          className="flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-500/10 rounded-sm mt-auto border-t border-white/5 pt-8 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-bold text-sm uppercase tracking-widest">
            Déconnexion
          </span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto mt-16 lg:mt-0">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
