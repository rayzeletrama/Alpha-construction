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
  CheckCircle2,
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

  useEffect(() => {
    if (data)
      setForm({
        name: data.name || "",
        ...data.settings,
        browser_title: data.settings?.browser_title || "",
        favicon_url: data.settings?.favicon_url || "",
      });
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
      setForm({ ...form, [field]: res.data.url });
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
      toast.success("Branding sauvegardé !");
    },
  });

  if (isLoading || !form)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-primary" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-center border-b pb-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          Paramètres Généraux
        </h1>
        <button
          onClick={() => mutation.mutate(form)}
          className="bg-primary text-white px-8 py-3 rounded-sm font-bold flex items-center gap-2 hover:brightness-110 shadow-xl shadow-primary/20"
        >
          <Save size={18} /> ENREGISTRER TOUT
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CONFIGURATION NAVIGATEUR (SEO) */}
        <section className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 space-y-6">
          <h2 className="font-bold flex items-center gap-2 uppercase text-xs text-primary tracking-widest">
            <Monitor size={16} /> Fenêtre Navigateur
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">
                Titre de l'onglet (SEO)
              </label>
              <input
                className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
                value={form.browser_title || ""}
                onChange={(e) =>
                  setForm({ ...form, browser_title: e.target.value })
                }
                placeholder="Ex: Alpha - Construction & Rénovation"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">
                Favicon (.ico ou .png)
              </label>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-12 h-12 bg-gray-100 border flex items-center justify-center overflow-hidden">
                  {form.favicon_url ? (
                    <img
                      src={form.favicon_url}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Monitor size={16} className="text-gray-300" />
                  )}
                </div>
                <label className="flex-1 cursor-pointer bg-black text-white text-center py-2 text-[10px] font-bold">
                  {uploading === "favicon_url"
                    ? "CHARGEMENT..."
                    : "CHOISIR L'ICÔNE"}
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

        {/* IDENTITÉ & LOGO */}
        <section className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 space-y-6">
          <h2 className="font-bold flex items-center gap-2 uppercase text-xs text-primary tracking-widest">
            <Globe size={16} /> Identité de Marque
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">
                Nom de l'entreprise
              </label>
              <input
                className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">
                Logo du site
              </label>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-20 h-12 bg-gray-100 border flex items-center justify-center overflow-hidden">
                  {form.logo_url ? (
                    <img
                      src={form.logo_url}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Upload size={16} />
                  )}
                </div>
                <label className="flex-1 cursor-pointer border border-black py-2 text-center text-[10px] font-bold hover:bg-black hover:text-white transition-all">
                  {uploading === "logo_url" ? "ENVOI..." : "CHANGER LE LOGO"}
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

        {/* COULEUR PRIMAIRE */}
        <section className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold flex items-center gap-2 uppercase text-xs text-primary tracking-widest">
            <Palette size={16} /> Apparence
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
