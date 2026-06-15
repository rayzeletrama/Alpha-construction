import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import {
  Save,
  Loader2,
  Globe,
  Palette,
  Upload,
  Monitor,
  Share2,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

export const Settings = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<any>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get("/v1/settings")).data,
  });

  // Synchronisation sécurisée des données
  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        browser_title: data.settings?.browser_title || "",
        logo_url: data.settings?.logo_url || "",
        favicon_url: data.settings?.favicon_url || "",
        primary_color: data.settings?.primary_color || "#0056D2",
        // On initialise les sous-objets pour éviter les erreurs "undefined"
        socials: {
          facebook: data.settings?.socials?.facebook || "",
          instagram: data.settings?.socials?.instagram || "",
          linkedin: data.settings?.socials?.linkedin || "",
        },
        contact: {
          email: data.settings?.contact?.email || "",
          phone: data.settings?.contact?.phone || "",
          address: data.settings?.contact?.address || "",
        },
      });
    }
  }, [data]);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/v1/upload", formData);
      setForm((prev: any) => ({ ...prev, [field]: res.data.url }));
      toast.success("Fichier mis à jour");
    } catch (err) {
      toast.error("Erreur d'envoi");
    } finally {
      setUploading(null);
    }
  };

  const mutation = useMutation({
    mutationFn: (vals: any) =>
      api.put("/v1/settings", { name: vals.name, settings: vals }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Paramètres enregistrés !");
    },
    onError: () => toast.error("Erreur lors de la sauvegarde"),
  });

  // IMPORTANT : Empêche le rendu si le formulaire n'est pas prêt (évite l'écran blanc)
  if (isLoading || !form)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-primary" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          Configuration globale
        </h1>
        <button
          onClick={() => mutation.mutate(form)}
          disabled={mutation.isPending}
          className="w-full md:w-auto bg-primary text-white px-8 py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-xl shadow-primary/20 transition-all disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Save size={18} />
          )}
          ENREGISTRER TOUT
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SECTION 1 : NAVIGATEUR & SEO */}
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-6">
          <h2 className="font-bold flex items-center gap-2 uppercase text-xs text-primary tracking-widest">
            <Monitor size={16} /> Fenêtre Navigateur
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">
                Titre de l'onglet
              </label>
              <input
                className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
                value={form.browser_title || ""}
                onChange={(e) =>
                  setForm({ ...form, browser_title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">
                Favicon
              </label>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-10 h-10 bg-gray-100 border flex items-center justify-center overflow-hidden">
                  {form.favicon_url ? (
                    <img src={form.favicon_url} className="object-contain" />
                  ) : (
                    <Monitor size={14} />
                  )}
                </div>
                <label className="flex-1 cursor-pointer bg-black text-white text-center py-2 text-[10px] font-bold uppercase">
                  {uploading === "favicon_url" ? "..." : "Changer"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleUpload(e, "favicon_url")}
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 : IDENTITÉ & LOGO */}
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-6">
          <h2 className="font-bold flex items-center gap-2 uppercase text-xs text-primary tracking-widest">
            <Globe size={16} /> Identité de Marque
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">
                Nom du site
              </label>
              <input
                className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">
                Logo principal
              </label>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-20 h-10 bg-gray-100 border flex items-center justify-center overflow-hidden">
                  {form.logo_url ? (
                    <img
                      src={form.logo_url}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Upload size={14} />
                  )}
                </div>
                <label className="flex-1 cursor-pointer border border-black py-2 text-center text-[10px] font-bold hover:bg-black hover:text-white transition-all">
                  {uploading === "logo_url" ? "..." : "Uploader logo"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleUpload(e, "logo_url")}
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 : RÉSEAUX SOCIAUX */}
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-6">
          <h2 className="font-bold flex items-center gap-2 uppercase text-xs text-primary tracking-widest">
            <Share2 size={16} /> Réseaux Sociaux (Footer)
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-sm text-gray-400">
                <Mail size={16} />
              </div>
              <input
                placeholder="Lien Facebook"
                className="flex-1 p-2 bg-gray-50 border-b outline-none focus:border-primary text-sm"
                value={form.socials?.facebook || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    socials: { ...form.socials, facebook: e.target.value },
                  })
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-sm text-gray-400">
                <Share2 size={16} />
              </div>
              <input
                placeholder="Lien Instagram"
                className="flex-1 p-2 bg-gray-50 border-b outline-none focus:border-primary text-sm"
                value={form.socials?.instagram || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    socials: { ...form.socials, instagram: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </section>

        {/* SECTION 4 : CONTACT GLOBAL */}
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-6">
          <h2 className="font-bold flex items-center gap-2 uppercase text-xs text-primary tracking-widest">
            <Phone size={16} /> Contact & Localisation
          </h2>
          <div className="space-y-4">
            <input
              placeholder="Téléphone"
              className="w-full p-2 bg-gray-50 border-b outline-none focus:border-primary text-sm"
              value={form.contact?.phone || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact: { ...form.contact, phone: e.target.value },
                })
              }
            />
            <input
              placeholder="Email public"
              className="w-full p-2 bg-gray-50 border-b outline-none focus:border-primary text-sm"
              value={form.contact?.email || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact: { ...form.contact, email: e.target.value },
                })
              }
            />
            <textarea
              placeholder="Adresse complète"
              rows={2}
              className="w-full p-2 bg-gray-50 border-b outline-none focus:border-primary text-sm"
              value={form.contact?.address || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact: { ...form.contact, address: e.target.value },
                })
              }
            />
          </div>
        </section>

        {/* SECTION 5 : APPARENCE */}
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold flex items-center gap-2 uppercase text-xs text-primary tracking-widest">
            <Palette size={16} /> Couleur d'accentuation
          </h2>
          <div className="flex gap-4">
            <input
              type="color"
              className="h-12 w-20 border-none cursor-pointer"
              value={form.primary_color}
              onChange={(e) =>
                setForm({ ...form, primary_color: e.target.value })
              }
            />
            <input
              className="flex-1 p-2 border font-mono uppercase"
              value={form.primary_color}
              onChange={(e) =>
                setForm({ ...form, primary_color: e.target.value })
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
};
