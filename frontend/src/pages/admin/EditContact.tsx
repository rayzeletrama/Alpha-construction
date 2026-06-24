import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import {
  Save,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  Map as MapIcon,
  ArrowLeft,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import imageCompression from "browser-image-compression"; // ✅ Ajout compression

export const EditContact = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // 1. Récupérer les données
  const { data: page, isLoading } = useQuery({
    queryKey: ["page", "contact"],
    queryFn: async () => (await api.get("/v1/pages/contact")).data,
  });

  useEffect(() => {
    if (page) setFormData(page.content);
  }, [page]);

  // 2. Mutation de sauvegarde
  const mutation = useMutation({
    mutationFn: (newContent: any) =>
      api.put("/v1/pages/contact", { content: newContent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", "contact"] });
      toast.success("Page Contact mise à jour avec succès !");
    },
    onError: () => toast.error("Erreur lors de la sauvegarde."),
  });

  // 3. Gestion de l'upload d'images avec COMPRESSION
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "hero" | "value",
    index?: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(index !== undefined ? `${type}-${index}` : type);

    try {
      // ✅ Compression pour éviter l'erreur 502 de Render
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      toast.info("Optimisation de l'image...");
      const compressedFile = await imageCompression(file, options);

      // ✅ Correction du nom pour éviter l'erreur .append
      const uploadData = new FormData();
      uploadData.append("file", compressedFile);

      const res = await api.post("/v1/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newUrl = res.data.url;

      if (type === "hero") {
        setFormData({ ...formData, hero: { ...formData.hero, image: newUrl } });
      } else {
        const newArticles = [...formData.values_section.articles];
        newArticles[index!].image = newUrl;
        setFormData({
          ...formData,
          values_section: { ...formData.values_section, articles: newArticles },
        });
      }
      toast.success("Image mise à jour");
    } catch (err) {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploadingField(null);
    }
  };

  // 4. Helpers
  const addValue = () => {
    const newArticle = {
      badge: `Valeurs 0${formData.values_section.articles.length + 1}`,
      title: "Nouvelle Valeur",
      slug: "",
      text: "Description...",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    };
    setFormData({
      ...formData,
      values_section: {
        ...formData.values_section,
        articles: [...formData.values_section.articles, newArticle],
      },
    });
  };

  const removeValue = (index: number) => {
    const newArticles = formData.values_section.articles.filter(
      (_: any, i: number) => i !== index,
    );
    setFormData({
      ...formData,
      values_section: { ...formData.values_section, articles: newArticles },
    });
  };

  const updateArticle = (index: number, field: string, value: string) => {
    const newArticles = [...formData.values_section.articles];
    newArticles[index] = { ...newArticles[index], [field]: value };
    setFormData({
      ...formData,
      values_section: { ...formData.values_section, articles: newArticles },
    });
  };

  if (isLoading || !formData)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 md:px-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <Link
            to="/contact"
            className="text-[10px] font-black text-gray-400 hover:text-primary flex items-center gap-2 mb-2 transition-all uppercase tracking-widest"
          >
            <ArrowLeft size={12} /> Voir la page publique
          </Link>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-black">
            Configuration Contact
          </h1>
        </div>
        <button
          onClick={() => mutation.mutate(formData)}
          disabled={mutation.isPending}
          className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-sm font-bold flex items-center justify-center gap-3 hover:brightness-110 shadow-xl disabled:opacity-50 transition-all"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <Save size={20} />
          )}
          ENREGISTRER
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* SECTION HERO */}
          <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-bold uppercase text-xs text-primary tracking-widest mb-6 flex items-center gap-2">
              <ImageIcon size={16} /> Bannière Hero
            </h2>
            <div className="space-y-4">
              <input
                className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold text-lg"
                value={formData.hero?.title || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, title: e.target.value },
                  })
                }
              />
              <div className="relative group aspect-video bg-gray-100 rounded-sm overflow-hidden border">
                <img
                  src={formData.hero?.image}
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                  <Upload size={24} />
                  <span className="font-bold text-xs uppercase">
                    {uploadingField === "hero" ? "Envoi..." : "Changer"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "hero")}
                  />
                </label>
              </div>
            </div>
          </section>

          {/* COORDONNÉES */}
          <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-bold uppercase text-xs text-black tracking-widest mb-6 flex items-center gap-2">
              <MapIcon size={16} /> Infos & Devis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase">
                  Adresse physique
                </label>
                <textarea
                  className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm"
                  rows={2}
                  value={formData.info_section?.address || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      info_section: {
                        ...formData.info_section,
                        address: e.target.value,
                      },
                    })
                  }
                />

                <label className="text-[10px] font-black text-blue-500 uppercase">
                  Email de réception (Lead)
                </label>
                <input
                  className="w-full p-3 bg-blue-50 border border-blue-100 outline-none focus:border-primary font-bold text-primary"
                  value={formData.form_recipient || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, form_recipient: e.target.value })
                  }
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase">
                  Téléphone
                </label>
                <input
                  className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary"
                  value={formData.info_section?.phone || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      info_section: {
                        ...formData.info_section,
                        phone: e.target.value,
                      },
                    })
                  }
                />

                <label className="text-[10px] font-black text-gray-400 uppercase">
                  Lien Iframe Maps
                </label>
                <input
                  className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-[10px] font-mono"
                  value={formData.info_section?.google_maps_url || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      info_section: {
                        ...formData.info_section,
                        google_maps_url: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </section>
        </div>

        {/* COLONNE DROITE : VALEURS */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-bold uppercase text-xs text-gray-400 tracking-widest">
              Articles de Valeurs
            </h2>
            <button
              onClick={addValue}
              className="text-primary font-black text-[10px] uppercase hover:underline"
            >
              + Ajouter
            </button>
          </div>

          <div className="space-y-6">
            {formData.values_section?.articles?.map(
              (article: any, index: number) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 relative group space-y-4"
                >
                  <button
                    onClick={() => removeValue(index)}
                    className="absolute -top-2 -right-2 p-2 bg-white text-red-400 rounded-full shadow-md hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="relative group h-24 bg-gray-50 rounded-sm overflow-hidden border">
                    <img
                      src={article.image}
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                      <Upload size={14} />
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "value", index)}
                      />
                    </label>
                  </div>

                  <div className="bg-blue-50/50 p-2 rounded-sm border border-blue-100">
                    <label className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-1 mb-1">
                      <LinkIcon size={10} /> Slug de liaison
                    </label>
                    <input
                      className="w-full text-[10px] font-mono bg-transparent outline-none"
                      placeholder="ex: contact-engagement"
                      value={article.slug || ""}
                      onChange={(e) =>
                        updateArticle(index, "slug", e.target.value)
                      }
                    />
                  </div>

                  <input
                    className="w-full text-[10px] font-black text-primary uppercase border-b border-gray-50 outline-none"
                    value={article.badge || ""}
                    onChange={(e) =>
                      updateArticle(index, "badge", e.target.value)
                    }
                  />

                  <input
                    className="w-full font-bold text-sm outline-none"
                    value={article.title || ""}
                    onChange={(e) =>
                      updateArticle(index, "title", e.target.value)
                    }
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
