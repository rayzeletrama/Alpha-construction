import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import {
  Save,
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  Type,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const EditHome = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // 1. Récupération des données
  const { data: page, isLoading } = useQuery({
    queryKey: ["page", "home"],
    queryFn: async () => (await api.get("/v1/pages/home")).data,
  });

  useEffect(() => {
    if (page) setFormData(page.content);
  }, [page]);

  // 2. Sauvegarde des modifications
  const mutation = useMutation({
    mutationFn: (newContent: any) =>
      api.put("/v1/pages/home", { content: newContent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", "home"] });
      toast.success("Page d'accueil mise à jour !");
    },
    onError: () => toast.error("Erreur lors de la sauvegarde."),
  });

  // 3. Gestion de l'Upload d'Images (Version corrigée sans erreur .append)
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    section: string,
    index?: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(index !== undefined ? `${section}-${index}` : section);

    // ✅ Correction ici : On utilise 'uploadData' pour éviter le conflit avec 'formData'
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await api.post("/v1/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newUrl = res.data.url;

      if (section === "hero") {
        setFormData({ ...formData, hero: { ...formData.hero, image: newUrl } });
      } else if (section === "about") {
        setFormData({
          ...formData,
          about: { ...formData.about, image: newUrl },
        });
      } else if (section === "service") {
        const newServices = [...formData.expertise.services];
        newServices[index!].image = newUrl;
        setFormData({
          ...formData,
          expertise: { ...formData.expertise, services: newServices },
        });
      }

      toast.success("Image mise à jour avec succès");
    } catch (err) {
      toast.error("Erreur lors de l'envoi de l'image");
    } finally {
      setUploadingField(null);
    }
  };

  if (isLoading || !formData)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );

  const handleSave = () => mutation.mutate(formData);

  // --- Helpers de listes ---
  const addParagraph = () => {
    const newParas = [
      ...(formData.about.paragraphs || []),
      "Nouveau paragraphe...",
    ];
    setFormData({
      ...formData,
      about: { ...formData.about, paragraphs: newParas },
    });
  };

  const removeParagraph = (index: number) => {
    const newParas = formData.about.paragraphs.filter(
      (_: any, i: number) => i !== index,
    );
    setFormData({
      ...formData,
      about: { ...formData.about, paragraphs: newParas },
    });
  };

  const addService = () => {
    const newId = (formData.expertise.services.length + 1)
      .toString()
      .padStart(2, "0");
    const newService = {
      id: newId,
      title: "Nouveau métier",
      slug: "", // Initialisation du slug vide
      description: "Description...",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
      link: "/maconnerie",
    };
    setFormData({
      ...formData,
      expertise: {
        ...formData.expertise,
        services: [...formData.expertise.services, newService],
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 md:px-0">
      {/* BARRE D'ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b pb-6 gap-4">
        <div>
          <Link
            to="/"
            className="text-[10px] font-black text-gray-400 hover:text-primary flex items-center gap-2 mb-2 uppercase transition-all"
          >
            <ArrowLeft size={12} /> Retour au site
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Édition de l'Accueil
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={mutation.isPending}
          className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-sm font-bold flex items-center justify-center gap-3 hover:brightness-110 shadow-xl disabled:opacity-50 transition-all"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <Save size={20} />
          )}
          SAUVEGARDER LES CHANGEMENTS
        </button>
      </div>

      <div className="space-y-12">
        {/* SECTION HERO */}
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
          <h2 className="text-xs font-black uppercase text-primary tracking-widest mb-6 flex items-center gap-2">
            <ImageIcon size={16} /> Bannière Hero
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Surtitre
                </label>
                <input
                  className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-medium"
                  value={formData.hero.subtitle || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, subtitle: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Titre Principal
                </label>
                <textarea
                  rows={3}
                  className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-black text-xl"
                  value={formData.hero.title || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, title: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Image de fond
              </label>
              <div className="relative group aspect-video bg-gray-100 rounded-sm overflow-hidden border">
                <img
                  src={formData.hero.image}
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <span className="text-white font-bold text-xs flex items-center gap-2">
                    <Upload size={18} />{" "}
                    {uploadingField === "hero" ? "Envoi..." : "CHANGER"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "hero")}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION À PROPOS */}
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
          <h2 className="text-xs font-black uppercase text-black tracking-widest mb-6 flex items-center gap-2">
            <Type size={16} /> Notre Identité
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="relative group aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden border">
              <img
                src={formData.about.image}
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Upload size={24} className="text-white" />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "about")}
                />
              </label>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Titre
                  </label>
                  <input
                    className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
                    value={formData.about.title || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, title: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="w-24 text-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Années
                  </label>
                  <input
                    className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-black text-primary"
                    value={formData.about.experience_years || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: {
                          ...formData.about,
                          experience_years: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Paragraphes
                  </label>
                  <button
                    onClick={addParagraph}
                    className="text-primary font-bold text-[10px] hover:underline"
                  >
                    + AJOUTER
                  </button>
                </div>
                {formData.about.paragraphs?.map((p: string, i: number) => (
                  <div key={i} className="flex gap-2">
                    <textarea
                      rows={3}
                      className="flex-1 p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm"
                      value={p || ""}
                      onChange={(e) => {
                        const n = [...formData.about.paragraphs];
                        n[i] = e.target.value;
                        setFormData({
                          ...formData,
                          about: { ...formData.about, paragraphs: n },
                        });
                      }}
                    />
                    <button
                      onClick={() => removeParagraph(i)}
                      className="text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION EXPERTISE */}
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
              Nos Métiers
            </h2>
            <button
              onClick={addService}
              className="bg-black text-white px-4 py-2 rounded-sm text-[10px] font-bold"
            >
              + NOUVELLE EXPERTISE
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {formData.expertise.services.map((service: any, index: number) => (
              <div
                key={index}
                className="p-6 bg-gray-50 border border-gray-100 rounded-sm relative group space-y-4"
              >
                <button
                  onClick={() => {
                    if (confirm("Supprimer ?")) {
                      const n = formData.expertise.services.filter(
                        (_: any, i: number) => i !== index,
                      );
                      setFormData({
                        ...formData,
                        expertise: { ...formData.expertise, services: n },
                      });
                    }
                  }}
                  className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="relative group aspect-video bg-white border overflow-hidden rounded-sm">
                      <img
                        src={service.image}
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Upload size={16} className="text-white" />
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, "service", index)
                          }
                        />
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CHAMP SLUG POUR LIAISON DYNAMIQUE */}
                    <div className="md:col-span-2 bg-blue-50/50 p-2 rounded-sm border border-blue-100">
                      <label className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-1 mb-1">
                        <LinkIcon size={10} /> Slug de l'article lié (ex:
                        maconnerie-pierre)
                      </label>
                      <input
                        className="w-full text-xs font-mono bg-transparent outline-none focus:text-blue-700"
                        placeholder="Lien vers la page détail..."
                        value={service.slug || ""}
                        onChange={(e) => {
                          const n = [...formData.expertise.services];
                          n[index].slug = e.target.value;
                          setFormData({
                            ...formData,
                            expertise: { ...formData.expertise, services: n },
                          });
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        Titre affiché
                      </label>
                      <input
                        className="w-full p-2 border font-bold text-sm"
                        value={service.title || ""}
                        onChange={(e) => {
                          const n = [...formData.expertise.services];
                          n[index].title = e.target.value;
                          setFormData({
                            ...formData,
                            expertise: { ...formData.expertise, services: n },
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
