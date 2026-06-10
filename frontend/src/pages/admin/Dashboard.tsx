import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import {
  Files,
  Package,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
  Loader2,
  RefreshCcw,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export const Dashboard = () => {
  // TanStack Query avec rafraîchissement automatique toutes les 30 secondes
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/v1/dashboard");
      return data;
    },
    refetchInterval: 30000, // Refresh auto toutes les 30s
  });

  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );

  return (
    <div className="space-y-10 pb-20">
      {/* Header avec indicateur de mise à jour */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              Tableau de bord
            </h1>
            {isFetching && (
              <RefreshCcw className="animate-spin text-primary w-4 h-4" />
            )}
          </div>
          <p className="text-gray-500 font-medium">
            Gestion active de{" "}
            <span className="text-black font-bold">
              {data?.tenant_info.name}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Statut Serveur
            </p>
            <p className="text-sm font-bold text-green-500 flex items-center justify-end gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />{" "}
              OPÉRATIONNEL
            </p>
          </div>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.stats.map((stat: any, i: number) => (
          <div
            key={i}
            className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-primary transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-gray-50 rounded-sm group-hover:bg-primary/10 group-hover:text-primary transition-colors text-gray-400">
                {stat.icon === "Files" && <Files size={24} />}
                {stat.icon === "Package" && <Package size={24} />}
                {stat.icon === "Users" && <Users size={24} />}
              </div>
              <span className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest border border-primary/10">
                {stat.trend}
              </span>
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">
              {stat.label}
            </p>
            <p className="text-5xl font-black tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pages Récemment Modifiées */}
        <div className="lg:col-span-2 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-black uppercase text-sm tracking-widest flex items-center gap-2">
              <Clock size={18} className="text-primary" /> Activité récente
            </h2>
            <span className="text-[10px] font-bold text-gray-400">
              MIS À JOUR EN DIRECT
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {data?.recent_pages.map((page: any) => (
              <Link
                key={page.slug}
                to={`/admin/${page.slug}`}
                className="flex items-center justify-between p-6 hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center group-hover:bg-white transition-colors">
                    <Files
                      size={16}
                      className="text-gray-400 group-hover:text-primary"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-primary transition-colors uppercase text-sm tracking-tight">
                      {page.title}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      Modifié{" "}
                      {formatDistanceToNow(new Date(page.updated_at), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
                  <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100">
                    ÉDITER
                  </span>
                  <ChevronRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions & Support */}
        <div className="space-y-6">
          <div className="bg-black text-white p-10 rounded-sm shadow-xl relative overflow-hidden group">
            <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black tracking-tighter uppercase mb-4">
                Site en ligne
              </h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
                Votre plateforme est synchronisée. Les domaines personnalisés
                sont actifs.
              </p>
              <a
                href="/"
                target="_blank"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all w-full justify-center"
              >
                <ExternalLink size={14} /> Voir le site public
              </a>
            </div>
          </div>

          <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm">
            <h3 className="font-black uppercase text-xs tracking-[0.2em] text-gray-400 mb-6 border-b pb-4">
              Assistance Technique
            </h3>
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-600 leading-relaxed">
                Besoin d'une nouvelle fonctionnalité ou d'un déploiement sur un
                domaine spécifique ?
              </p>
              <a
                href="mailto:beru@votre-saas.com"
                className="flex items-center justify-between group p-3 border border-gray-100 rounded-sm hover:border-primary transition-colors"
              >
                <span className="text-xs font-black uppercase tracking-widest">
                  Ouvrir un ticket
                </span>
                <ChevronRight
                  size={14}
                  className="text-gray-300 group-hover:text-primary"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
