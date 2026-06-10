import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import {
  Save,
  Loader2,
  Globe,
  Palette,
  Share2,
  Upload,
  Monitor,
} from "lucide-react";

export const Settings = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<any>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get("/v1/settings")).data,
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        logo_url: data.settings?.logo_url || "",
        favicon_url: data.settings?.favicon_url || "",
        browser_title: data.settings?.browser_title || "",
        primary_color: data.settings?.primary_color || "#0056D2",
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

  // Fonction pour uploader un fichier
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ ...form, [field]: data.url });
    } catch (err) {
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(null);
    }
  };

  const mutation = useMutation({
    mutationFn: (vals: any) =>
      api.put("/v1/settings", {
        name: vals.name,
        settings: vals,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      alert("Site mis à jour !");
    },
  });

  if (isLoading || !form)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center border-b pb-6">
        <h1 className="text-3xl font-black tracking-tighter uppercase">
          Configuration du Site
        </h1>
        <button
          onClick={() => mutation.mutate(form)}
          className="bg-primary text-white px-8 py-3 rounded-sm font-bold flex items-center gap-2"
        >
          <Save size={18} /> Sauvegarder les changements
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* IDENTITÉ & LOGO */}
        <section className="bg-white p-8 rounded-sm shadow-sm space-y-6">
          <h2 className="font-bold flex items-center gap-2 uppercase text-sm text-primary">
            <Globe size={18} /> Marque & Logo
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Nom de l'entreprise
              </label>
              <input
                className="w-full mt-1 p-2 border"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Upload Logo */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Logo Principal
              </label>
              <div className="mt-2 flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-100 rounded-sm flex items-center justify-center overflow-hidden border">
                  {form.logo_url ? (
                    <img
                      src={form.logo_url}
                      className="object-contain h-full w-full"
                    />
                  ) : (
                    <Upload size={20} className="text-gray-300" />
                  )}
                </div>
                <label className="cursor-pointer bg-gray-50 px-4 py-2 border text-xs font-bold hover:bg-gray-100 transition-colors">
                  {uploading === "logo_url"
                    ? "Chargement..."
                    : "CHANGER LE LOGO"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "logo_url")}
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* ONGLET NAVIGATEUR (SEO) */}
        <section className="bg-white p-8 rounded-sm shadow-sm space-y-6 border-l-4 border-black">
          <h2 className="font-bold flex items-center gap-2 uppercase text-sm">
            <Monitor size={18} /> Onglet Navigateur
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Titre de la page (Browser Title)
              </label>
              <input
                className="w-full mt-1 p-2 border"
                placeholder="Ex: Alpha - Construction Premium"
                value={form.browser_title}
                onChange={(e) =>
                  setForm({ ...form, browser_title: e.target.value })
                }
              />
            </div>

            {/* Upload Favicon */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Favicon (Icône de l'onglet)
              </label>
              <div className="mt-2 flex items-center gap-4">
                <div className="h-8 w-8 bg-gray-100 rounded-sm flex items-center justify-center overflow-hidden border">
                  {form.favicon_url ? (
                    <img src={form.favicon_url} className="object-contain" />
                  ) : (
                    <Upload size={14} className="text-gray-300" />
                  )}
                </div>
                <label className="cursor-pointer bg-gray-50 px-4 py-2 border text-[10px] font-bold hover:bg-gray-100">
                  UPLOAD .ICO / .PNG
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "favicon_url")}
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* DESIGN & COULEURS */}
        <section className="bg-white p-8 rounded-sm shadow-sm space-y-4">
          <h2 className="font-bold flex items-center gap-2 uppercase text-sm text-primary">
            <Palette size={18} /> Design
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

        {/* RÉSEAUX SOCIAUX & CONTACT */}
        <section className="bg-white p-8 rounded-sm shadow-sm space-y-4">
          <h2 className="font-bold flex items-center gap-2 uppercase text-sm text-primary">
            <Share2 size={18} /> Contact & Social
          </h2>
          <input
            placeholder="Email"
            className="w-full p-2 border"
            value={form.contact.email}
            onChange={(e) =>
              setForm({
                ...form,
                contact: { ...form.contact, email: e.target.value },
              })
            }
          />
          <input
            placeholder="Facebook"
            className="w-full p-2 border"
            value={form.socials.facebook}
            onChange={(e) =>
              setForm({
                ...form,
                socials: { ...form.socials, facebook: e.target.value },
              })
            }
          />
        </section>
      </div>
    </div>
  );
};
