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
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

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

  // 3. Gestion de l'upload d'images
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "hero" | "value",
    index?: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(index !== undefined ? `${type}-${index}` : type);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await api.post("/v1/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (type === "hero") {
        setFormData({
          ...formData,
          hero: { ...formData.hero, image: res.data.url },
        });
      } else {
        const newArticles = [...formData.values_section.articles];
        newArticles[index!].image = res.data.url;
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

  // 4. Helpers pour la section Valeurs
  const addValue = () => {
    const newArticle = {
      badge: `Valeurs 0${formData.values_section.articles.length + 1}`,
      title: "Nouvelle Valeur",
      text: "Description de l'engagement...",
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
            className="text-[10px] font-black text-gray-400 hover:text-primary flex items-center gap-2 mb-2 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={12} /> Voir la page contact
          </Link>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-black">
            Édition Contact
          </h1>
        </div>
        <button
          onClick={() => mutation.mutate(formData)}
          disabled={mutation.isPending}
          className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-sm font-bold flex items-center justify-center gap-3 hover:brightness-110 shadow-xl shadow-primary/20 transition-all"
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
        {/* COLONNE GAUCHE : HERO & COORDONNÉES */}
        <div className="lg:col-span-2 space-y-10">
          {/* SECTION HERO */}
          <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-bold uppercase text-xs text-primary tracking-widest mb-6 flex items-center gap-2">
              <ImageIcon size={16} /> Bannière Contact
            </h2>
            <div className="space-y-6">
              <input
                className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold text-xl"
                value={formData.hero.title || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, title: e.target.value },
                  })
                }
              />
              <div className="relative group aspect-video bg-gray-100 rounded-sm overflow-hidden border">
                <img
                  src={formData.hero.image}
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                  <Upload size={24} className="mb-2" />
                  <span className="font-bold text-xs uppercase">
                    {uploadingField === "hero"
                      ? "Envoi..."
                      : "Changer l'image Hero"}
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

          {/* COORDONNÉES ET CARTE */}
          <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-bold uppercase text-xs text-black tracking-widest mb-6 flex items-center gap-2">
              <MapIcon size={16} /> Coordonnées & Google Maps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 mb-1">
                    <MapPin size={12} /> Adresse Physique
                  </label>
                  <textarea
                    className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm"
                    rows={2}
                    value={formData.info_section.address || ""}
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
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 mb-1">
                    <Phone size={12} /> Téléphone
                  </label>
                  <input
                    className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm font-bold"
                    value={formData.info_section.phone || ""}
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
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 mb-1">
                    <Mail size={12} /> Email de contact
                  </label>
                  <input
                    className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm font-bold"
                    value={formData.info_section.email || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        info_section: {
                          ...formData.info_section,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 mb-1">
                    <Clock size={12} /> Horaires d'ouverture
                  </label>
                  <input
                    className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm"
                    value={formData.info_section.hours || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        info_section: {
                          ...formData.info_section,
                          hours: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-50">
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">
                Source de la Carte (Iframe SRC)
              </label>
              <input
                className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-[10px] font-mono"
                value={formData.info_section.google_maps_url || ""}
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
          </section>
          <section className="bg-white p-8 rounded-sm shadow-sm border-l-4 border-primary">
            <h2 className="text-lg font-bold mb-4 uppercase flex items-center gap-2">
              <Mail size={18} /> Configuration du formulaire
            </h2>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">
                Email de réception des devis
              </label>
              <input
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
                placeholder="ex: direction@beru-construction.fr"
                value={formData.form_recipient || ""}
                onChange={(e) =>
                  setFormData({ ...formData, form_recipient: e.target.value })
                }
              />
              <p className="text-[10px] text-gray-400 mt-2 italic">
                C'est à cette adresse que seront envoyés les messages des
                clients.
              </p>
            </div>
          </section>
        </div>

        {/* COLONNE DROITE : VALEURS D'ENTREPRISE */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-bold uppercase text-xs text-gray-400 tracking-widest">
              Nos Valeurs
            </h2>
            <button
              onClick={addValue}
              className="text-primary font-black text-[10px] uppercase flex items-center gap-1 hover:underline"
            >
              <Plus size={14} /> Ajouter
            </button>
          </div>

          <div className="space-y-6">
            {formData.values_section.articles.map(
              (article: any, index: number) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 relative group"
                >
                  <button
                    onClick={() => removeValue(index)}
                    className="absolute -top-2 -right-2 p-2 bg-white text-red-400 rounded-full shadow-md hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="space-y-4">
                    <div className="relative group h-32 bg-gray-50 rounded-sm overflow-hidden border">
                      <img
                        src={article.image}
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                        <Upload size={16} />
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "value", index)}
                        />
                      </label>
                    </div>

                    <input
                      placeholder="Badge (ex: Valeurs 01)"
                      className="w-full text-[10px] font-black text-primary uppercase border-b border-gray-50 outline-none"
                      value={article.badge || ""}
                      onChange={(e) =>
                        updateArticle(index, "badge", e.target.value)
                      }
                    />
                    <input
                      placeholder="Titre"
                      className="w-full font-bold text-sm outline-none"
                      value={article.title || ""}
                      onChange={(e) =>
                        updateArticle(index, "title", e.target.value)
                      }
                    />
                    <textarea
                      placeholder="Texte descriptif"
                      className="w-full text-xs text-gray-500 bg-gray-50 p-2 rounded-sm outline-none"
                      rows={3}
                      value={article.text || ""}
                      onChange={(e) =>
                        updateArticle(index, "text", e.target.value)
                      }
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
