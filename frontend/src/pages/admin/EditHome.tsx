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
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const EditHome = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", "home"],
    queryFn: async () => {
      const { data } = await api.get("/v1/pages/home");
      return data;
    },
  });

  useEffect(() => {
    if (page) setFormData(page.content);
  }, [page]);

  const mutation = useMutation({
    mutationFn: (newContent: any) =>
      api.put("/v1/pages/home", { content: newContent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", "home"] });
      toast.success("Modifications enregistrées !");
    },
    onError: () => toast.error("Erreur lors de la sauvegarde."),
  });

  // --- Gestion de l'Upload d'Images ---
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    section: string,
    index?: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(index !== undefined ? `${section}-${index}` : section);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await api.post("/v1/upload", data, {
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

      toast.success("Image mise à jour");
    } catch (err) {
      toast.error("Erreur lors de l'upload");
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

  // --- Helpers pour les Listes ---
  const addParagraph = () => {
    const newParas = [...formData.about.paragraphs, "Nouveau paragraphe..."];
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

  const removeService = (index: number) => {
    const newServices = formData.expertise.services.filter(
      (_: any, i: number) => i !== index,
    );
    setFormData({
      ...formData,
      expertise: { ...formData.expertise, services: newServices },
    });
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 md:px-0">
      {/* Header Fixe */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b pb-6 gap-4">
        <div>
          <Link
            to="/"
            className="text-xs font-bold text-gray-400 hover:text-primary flex items-center gap-2 mb-2 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Voir le site public
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Édition Accueil
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={mutation.isPending}
          className="w-full md:w-auto bg-primary text-white px-8 py-3 rounded-sm font-bold flex items-center justify-center gap-3 hover:brightness-110 disabled:opacity-50 shadow-xl shadow-primary/20 transition-all"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <Save size={20} />
          )}
          ENREGISTRER LES MODIFICATIONS
        </button>
      </div>

      <div className="space-y-12">
        {/* SECTION HERO */}
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b pb-4 text-primary">
            <ImageIcon size={20} />
            <h2 className="text-lg font-bold uppercase tracking-widest">
              Section Hero
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Sur-titre
                </label>
                <input
                  className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary"
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
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Titre Principal
                </label>
                <textarea
                  rows={3}
                  className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold text-lg"
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
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Image Hero
              </label>
              <div className="relative group aspect-video bg-gray-100 rounded-sm overflow-hidden border border-gray-100">
                <img
                  src={formData.hero.image}
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                  <Upload size={24} className="mb-2" />
                  <span className="font-bold text-xs uppercase tracking-widest">
                    {uploadingField === "hero"
                      ? "Transfert..."
                      : "Changer l'image"}
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
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="p-2 bg-black text-white rounded-sm">
              <Type size={20} />
            </div>
            <h2 className="text-lg font-bold uppercase tracking-widest">
              Section À Propos
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="relative group aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden border border-gray-100">
                <img
                  src={formData.about.image}
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                  <Upload size={24} className="mb-2" />
                  <span className="font-bold text-xs">CHANGER PHOTO</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "about")}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Titre section
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
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Années
                  </label>
                  <input
                    className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-center font-black text-primary"
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
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Paragraphes
                  </label>
                  <button
                    onClick={addParagraph}
                    className="text-primary font-bold text-[10px] flex items-center gap-1 hover:underline"
                  >
                    <Plus size={12} /> AJOUTER
                  </button>
                </div>
                {formData.about.paragraphs.map((p: string, i: number) => (
                  <div key={i} className="flex gap-2">
                    <textarea
                      rows={3}
                      className="flex-1 p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm"
                      value={p || ""}
                      onChange={(e) => {
                        const newParas = [...formData.about.paragraphs];
                        newParas[i] = e.target.value;
                        setFormData({
                          ...formData,
                          about: { ...formData.about, paragraphs: newParas },
                        });
                      }}
                    />
                    <button
                      onClick={() => removeParagraph(i)}
                      className="text-red-400 hover:text-red-600"
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
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-3">
              <div className="w-1 h-6 bg-primary" /> Nos Métiers
            </h2>
            <button
              onClick={addService}
              className="bg-black text-white px-4 py-2 rounded-sm text-[10px] font-black flex items-center gap-2 hover:bg-primary transition-all"
            >
              <Plus size={14} /> AJOUTER UNE EXPERTISE
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {formData.expertise.services.map((service: any, index: number) => (
              <div
                key={index}
                className="p-6 bg-gray-50 border border-gray-200 rounded-sm relative group"
              >
                <button
                  onClick={() => removeService(index)}
                  className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="relative group aspect-video bg-white rounded-sm overflow-hidden border border-gray-200">
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
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <div className="mt-2 text-[8px] text-gray-400 truncate">
                      {service.image}
                    </div>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase">
                        Numéro (ID)
                      </label>
                      <input
                        className="w-full p-2 border border-gray-200 font-black text-primary bg-white"
                        value={service.id || ""}
                        onChange={(e) => {
                          const newS = [...formData.expertise.services];
                          newS[index].id = e.target.value;
                          setFormData({
                            ...formData,
                            expertise: {
                              ...formData.expertise,
                              services: newS,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase">
                        Titre du métier
                      </label>
                      <input
                        className="w-full p-2 border border-gray-200 font-bold bg-white"
                        value={service.title || ""}
                        onChange={(e) => {
                          const newS = [...formData.expertise.services];
                          newS[index].title = e.target.value;
                          setFormData({
                            ...formData,
                            expertise: {
                              ...formData.expertise,
                              services: newS,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase">
                        Description courte
                      </label>
                      <textarea
                        className="w-full p-2 border border-gray-200 text-sm bg-white"
                        rows={2}
                        value={service.description || ""}
                        onChange={(e) => {
                          const newS = [...formData.expertise.services];
                          newS[index].description = e.target.value;
                          setFormData({
                            ...formData,
                            expertise: {
                              ...formData.expertise,
                              services: newS,
                            },
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
