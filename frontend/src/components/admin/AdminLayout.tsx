import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/axios";

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  // 1. Récupérer les infos du dashboard (dont le nombre de messages non lus)
  const { data: dashboardData } = useQuery({
    queryKey: ["admin-dashboard"], // Partagé avec la page Dashboard.tsx
    queryFn: async () => (await api.get("/v1/dashboard")).data,
    refetchInterval: 30000, // Rafraîchit le badge toutes les 30 secondes
  });

  const unreadCount = dashboardData?.unread_leads_count || 0;

  // Fermer la sidebar sur mobile quand on change de page
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
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
        <span className="font-black tracking-tighter text-xl">ALPHA ADMIN</span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-primary"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* SIDEBAR OVERLAY (Mobile) */}
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
        <div className="hidden lg:block text-2xl font-black tracking-tighter mb-12">
          ALPHA{" "}
          <span className="text-primary text-xs uppercase block">
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 space-y-2 mt-12 lg:mt-0">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-sm transition-all ${
                location.pathname === item.path
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={
                  location.pathname === item.path
                    ? "text-white"
                    : "text-gray-500"
                }
              >
                {item.icon}
              </span>
              <span className="font-bold text-sm tracking-tight">
                {item.name}
              </span>
              {/* AFFICHAGE DU BADGE ROUGE */}
              {item.badge > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-red-500 text-white text-[10px] font-black h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full shadow-lg border-2 border-black"
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </motion.span>
              )}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("auth_token");
            window.location.href = "/login";
          }}
          className="flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-500/10 rounded-sm mt-auto border-t border-white/10 pt-8"
        >
          <LogOut size={20} />
          <span className="font-bold text-sm">Déconnexion</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 lg:p-16 overflow-y-auto mt-16 lg:mt-0">
        <Outlet />
      </main>
    </div>
  );
};
