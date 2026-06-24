import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import {
  Mail,
  Trash2,
  Loader2,
  Calendar,
  User,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export const Leads = () => {
  const queryClient = useQueryClient();

  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads-list"],
    queryFn: async () => (await api.get("/v1/leads")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/v1/leads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads-list"] });
      toast.success("Message supprimé");
    },
  });

  const markAsRead = useMutation({
    mutationFn: (id: number) => api.patch(`/v1/leads/${id}/read`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["leads-list"] }),
  });

  if (isLoading)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-primary" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          Demandes de devis
        </h1>
        <p className="text-gray-500 text-sm">
          Retrouvez ici tous les messages envoyés depuis votre formulaire de
          contact.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {leads?.map((lead: any) => (
          <div
            key={lead.id}
            className={`bg-white p-6 rounded-sm border ${lead.status === "new" ? "border-l-4 border-l-primary shadow-md" : "border-gray-100 opacity-80"} transition-all`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${lead.status === "new" ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}
                  >
                    {lead.status === "new" ? "Nouveau" : "Lu"}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />{" "}
                    {formatDistanceToNow(new Date(lead.created_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-primary">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">
                        Sujet
                      </p>
                      <p className="font-bold text-sm text-primary">
                        {lead.subject}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-sm text-sm text-gray-700 leading-relaxed italic">
                  "{lead.message}"
                </div>
              </div>

              <div className="flex md:flex-col justify-end gap-2">
                {lead.status === "new" && (
                  <button
                    onClick={() => markAsRead.mutate(lead.id)}
                    className="p-3 bg-green-50 text-green-600 rounded-sm hover:bg-green-600 hover:text-white transition-all"
                    title="Marquer comme lu"
                  >
                    <CheckCircle size={20} />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("Supprimer ce message ?"))
                      deleteMutation.mutate(lead.id);
                  }}
                  className="p-3 bg-red-50 text-red-500 rounded-sm hover:bg-red-500 hover:text-white transition-all"
                  title="Supprimer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {leads?.length === 0 && (
          <div className="text-center py-20 bg-white border-2 border-dashed rounded-sm">
            <Mail className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="text-gray-400 font-bold uppercase tracking-widest">
              Aucun message pour le moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
