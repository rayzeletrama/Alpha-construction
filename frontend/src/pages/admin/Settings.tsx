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
  Mail,
  MapPin,
  Linkedin,
  Instagram,
  Facebook,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

export const Settings = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<any>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get("/v1/settings")).data,
  });

  useEffect(() => {
    if (data) {
      // On construit un objet plat pour l'état du formulaire
      setForm({
        name: data.name || "",
        browser_title: data.settings?.browser_title || "",
        logo_url: data.settings?.logo_url || "",
        favicon_url: data.settings?.favicon_url || "",
        primary_color: data.settings?.primary_color || "#0056D2",
        why_us: data.settings?.why_us || [],
        partners: data.settings?.partners || [],
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
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const uploadData = new FormData();
      uploadData.append("file", compressedFile);
      const res = await api.post("/v1/upload", uploadData);
      setForm((prev: any) => ({ ...prev, [field]: res.data.url }));
      toast.success("Image prête !");
    } catch (err) {
      toast.error("Erreur d'envoi");
    } finally {
      setUploading(null);
    }
  };

  const mutation = useMutation({
    mutationFn: (vals: any) => {
      // ✅ STRUCTURE CORRECTE : On sépare le nom des settings
      const payload = {
        name: vals.name,
        settings: {
          browser_title: vals.browser_title,
          logo_url: vals.logo_url,
          favicon_url: vals.favicon_url,
          primary_color: vals.primary_color,
          why_us: vals.why_us,
          partners: vals.partners,
          socials: vals.socials,
          contact: vals.contact,
        },
      };
      return api.put("/v1/settings", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Configuration mise à jour !");
    },
    onError: () => toast.error("Erreur lors de la sauvegarde"),
  });

  if (isLoading || !form)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-primary" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-black">
          Paramètres du SaaS
        </h1>
        <button
          onClick={() => mutation.mutate(form)}
          disabled={mutation.isPending}
          className="w-full md:w-auto bg-primary text-white px-8 py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-xl"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Save size={18} />
          )}
          ENREGISTRER LES MODIFICATIONS
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Identité & SEO */}
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-6">
          <h2 className="font-bold flex items-center gap-2 uppercase text-xs text-primary tracking-widest">
            <Monitor size={16} /> SEO & Identité
          </h2>
          <div className="space-y-4">
            <input
              placeholder="Nom du site"
              className="w-full p-3 border text-sm font-bold"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Titre onglet"
              className="w-full p-3 border text-sm"
              value={form.browser_title || ""}
              onChange={(e) =>
                setForm({ ...form, browser_title: e.target.value })
              }
            />
          </div>
        </section>

        {/* Couleurs */}
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-6">
          <h2 className="font-bold flex items-center gap-2 uppercase text-xs text-primary tracking-widest">
            <Palette size={16} /> Design
          </h2>
          <div className="flex gap-4">
            <input
              type="color"
              className="h-10 w-16 cursor-pointer"
              value={form.primary_color}
              onChange={(e) =>
                setForm({ ...form, primary_color: e.target.value })
              }
            />
            <input
              className="flex-1 p-2 border font-mono text-sm"
              value={form.primary_color}
              onChange={(e) =>
                setForm({ ...form, primary_color: e.target.value })
              }
            />
          </div>
        </section>

        {/* Pourquoi Nous */}
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-6 lg:col-span-2">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="font-bold uppercase text-xs text-primary tracking-widest">
              Nos Piliers (Why Us)
            </h2>
            <button
              onClick={() =>
                setForm({
                  ...form,
                  why_us: [
                    ...form.why_us,
                    { icon: "ShieldCheck", title: "", desc: "" },
                  ],
                })
              }
              className="text-primary font-bold text-[10px] uppercase"
            >
              + Ajouter
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.why_us.map((item: any, i: number) => (
              <div
                key={i}
                className="p-4 bg-gray-50 border rounded-sm relative group space-y-2"
              >
                <button
                  onClick={() => {
                    const n = form.why_us.filter(
                      (_: any, idx: number) => idx !== i,
                    );
                    setForm({ ...form, why_us: n });
                  }}
                  className="absolute top-2 right-2 text-red-400"
                >
                  <Trash2 size={14} />
                </button>
                <input
                  placeholder="Icône Lucide"
                  className="w-full p-2 text-[10px] font-mono border"
                  value={item.icon}
                  onChange={(e) => {
                    const n = [...form.why_us];
                    n[i].icon = e.target.value;
                    setForm({ ...form, why_us: n });
                  }}
                />
                <input
                  placeholder="Titre"
                  className="w-full p-2 text-xs font-bold"
                  value={item.title}
                  onChange={(e) => {
                    const n = [...form.why_us];
                    n[i].title = e.target.value;
                    setForm({ ...form, why_us: n });
                  }}
                />
                <textarea
                  placeholder="Description"
                  className="w-full p-2 text-[11px] border"
                  rows={2}
                  value={item.desc}
                  onChange={(e) => {
                    const n = [...form.why_us];
                    n[i].desc = e.target.value;
                    setForm({ ...form, why_us: n });
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Partenaires */}
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-6 lg:col-span-2">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="font-bold uppercase text-xs text-primary tracking-widest">
              Partenaires de confiance
            </h2>
            <button
              onClick={() =>
                setForm({
                  ...form,
                  partners: [...form.partners, { name: "", logo: "", url: "" }],
                })
              }
              className="text-primary font-bold text-[10px] uppercase"
            >
              + Ajouter
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {form.partners.map((p: any, i: number) => (
              <div
                key={i}
                className="p-3 bg-gray-50 border rounded-sm relative group space-y-2 text-center"
              >
                <button
                  onClick={() => {
                    const n = form.partners.filter(
                      (_: any, idx: number) => idx !== i,
                    );
                    setForm({ ...form, partners: n });
                  }}
                  className="absolute -top-1 -right-1 bg-white shadow-sm p-1 rounded-full text-red-400"
                >
                  <Trash2 size={12} />
                </button>
                <div className="h-10 flex items-center justify-center bg-white border border-gray-100">
                  {p.logo ? (
                    <img src={p.logo} className="h-6 object-contain" />
                  ) : (
                    <Upload size={14} className="text-gray-200" />
                  )}
                </div>
                <input
                  placeholder="Nom"
                  className="w-full p-1 text-[9px] border"
                  value={p.name}
                  onChange={(e) => {
                    const n = [...form.partners];
                    n[i].name = e.target.value;
                    setForm({ ...form, partners: n });
                  }}
                />
                <input
                  placeholder="Logo URL"
                  className="w-full p-1 text-[9px] border"
                  value={p.logo}
                  onChange={(e) => {
                    const n = [...form.partners];
                    n[i].logo = e.target.value;
                    setForm({ ...form, partners: n });
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
