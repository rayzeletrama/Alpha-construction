import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import {
  Save,
  Plus,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Upload,
  Type,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/src/components/admin/Modals";
import { Link } from "react-router-dom";

export const EditRenovation = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // État pour un nouvel article technique (Rénovation)
  const [newArticle, setNewArticle] = useState({
    badge: "Focus Rénovation",
    title: "",
    text: "",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858",
  });

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", "renovation"],
    queryFn: async () => (await api.get("/v1/pages/renovation")).data,
  });

  useEffect(() => {
    if (page) setFormData(page.content);
  }, [page]);

  const mutation = useMutation({
    mutationFn: (newContent: any) =>
      api.put("/v1/pages/renovation", { content: newContent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", "renovation"] });
      toast.success("Page Rénovation mise à jour !");
    },
    onError: () => toast.error("Erreur lors de la sauvegarde"),
  });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    path: string,
    index?: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(index !== undefined ? `${path}-${index}` : path);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await api.post("/v1/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newUrl = res.data.url;

      if (path === "hero") {
        setFormData({ ...formData, hero: { ...formData.hero, image: newUrl } });
      } else if (path === "intro_images") {
        const newImages = [...formData.intro.images];
        newImages[index!] = newUrl;
        setFormData({
          ...formData,
          intro: { ...formData.intro, images: newImages },
        });
      } else if (path === "article") {
        const newArticles = [...formData.articles];
        newArticles[index!].image = newUrl;
        setFormData({ ...formData, articles: newArticles });
      }

      toast.success("Image mise à jour avec succès");
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

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* HEADER STRATÉGIQUE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <Link
            to="/renovation"
            className="text-[10px] font-black text-gray-400 hover:text-primary flex items-center gap-2 mb-2 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={12} /> Voir la page publique
          </Link>
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            Expertise : Rénovation
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
          SAUVEGARDER LES MODIFICATIONS
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* COLONNE GAUCHE (70%) : CONTENU VISUEL ET TEXTUEL */}
        <div className="lg:col-span-2 space-y-10">
          {/* SECTION HERO */}
          <section className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-bold uppercase text-xs text-primary tracking-widest mb-6 flex items-center gap-2">
              <ImageIcon size={16} /> Section Hero (Bannière)
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">
                  Titre de la bannière
                </label>
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
              </div>
              <div className="relative group aspect-video bg-gray-100 rounded-sm overflow-hidden border">
                <img
                  src={formData.hero.image}
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                  <Upload size={24} className="mb-2" />
                  <span className="font-bold text-xs uppercase tracking-widest">
                    {uploadingField === "hero"
                      ? "Téléchargement..."
                      : "Remplacer l'image hero"}
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

          {/* SECTION INTRODUCTION & PHOTOS DE CHANTIER */}
          <section className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-bold uppercase text-xs text-black tracking-widest mb-6 flex items-center gap-2">
              <Type size={16} /> Présentation et Images d'introduction
            </h2>
            <div className="space-y-6">
              <input
                className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
                placeholder="Titre d'introduction"
                value={formData.intro.title || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    intro: { ...formData.intro, title: e.target.value },
                  })
                }
              />
              <textarea
                className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm leading-relaxed"
                rows={5}
                placeholder="Texte de présentation..."
                value={formData.intro.text || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    intro: { ...formData.intro, text: e.target.value },
                  })
                }
              />

              <div className="grid grid-cols-2 gap-6 pt-4">
                {formData.intro.images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative group aspect-[3/4] bg-gray-50 border rounded-sm overflow-hidden"
                  >
                    <img src={img} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                      <Upload size={20} className="mb-1" />
                      <span className="text-[10px] font-bold uppercase">
                        Changer photo {idx + 1}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e, "intro_images", idx)
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* COLONNE DROITE (30%) : LISTE DES SERVICES */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-bold uppercase text-xs text-gray-400 tracking-widest mb-6 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary" /> Liste des
              services
            </h2>
            <div className="space-y-4">
              {formData.intro.services.map((s: string, i: number) => (
                <div key={i} className="flex items-center gap-3 group">
                  <input
                    className="flex-1 text-sm font-bold py-2 bg-transparent border-b border-gray-100 focus:border-primary outline-none"
                    value={s}
                    onChange={(e) => {
                      const newS = [...formData.intro.services];
                      newS[i] = e.target.value;
                      setFormData({
                        ...formData,
                        intro: { ...formData.intro, services: newS },
                      });
                    }}
                  />
                  <button
                    onClick={() => {
                      const newS = formData.intro.services.filter(
                        (_: any, idx: number) => idx !== i,
                      );
                      setFormData({
                        ...formData,
                        intro: { ...formData.intro, services: newS },
                      });
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    intro: {
                      ...formData.intro,
                      services: [
                        ...formData.intro.services,
                        "Nouveau service de rénovation",
                      ],
                    },
                  })
                }
                className="w-full mt-4 py-3 border-2 border-dashed border-gray-100 text-[10px] font-black uppercase text-gray-400 hover:border-primary hover:text-primary transition-all"
              >
                + Ajouter une prestation
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* SECTION ARTICLES DE TRANSFORMATION (Pleine largeur) */}
      <section className="space-y-8">
        <div className="flex justify-between items-center border-t pt-10">
          <h2 className="text-2xl font-black tracking-tighter uppercase">
            L'Art de la Transformation (Articles)
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-6 py-2 rounded-sm font-bold text-xs flex items-center gap-2 hover:bg-primary transition-all shadow-lg shadow-black/10"
          >
            <Plus size={16} /> AJOUTER UN FOCUS
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {formData.articles.map((art: any, i: number) => (
            <div
              key={i}
              className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 relative group flex flex-col gap-6"
            >
              <button
                onClick={() => {
                  if (confirm("Supprimer cet article de rénovation ?")) {
                    const newArt = formData.articles.filter(
                      (_: any, idx: number) => idx !== i,
                    );
                    setFormData({ ...formData, articles: newArt });
                  }
                }}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-40">
                  <div className="relative group aspect-square bg-gray-50 rounded-sm overflow-hidden border border-gray-100">
                    <img
                      src={art.image}
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                      <Upload size={18} />
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "article", i)}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <input
                    className="w-full text-[10px] font-black text-primary uppercase tracking-widest bg-transparent border-b border-gray-50 outline-none"
                    value={art.badge || ""}
                    onChange={(e) => {
                      const newArt = [...formData.articles];
                      newArt[i].badge = e.target.value;
                      setFormData({ ...formData, articles: newArt });
                    }}
                  />
                  <input
                    className="w-full font-bold text-lg outline-none focus:text-primary transition-colors"
                    value={art.title || ""}
                    onChange={(e) => {
                      const newArt = [...formData.articles];
                      newArt[i].title = e.target.value;
                      setFormData({ ...formData, articles: newArt });
                    }}
                  />
                  <textarea
                    className="w-full text-sm text-gray-500 bg-gray-50 p-4 rounded-sm outline-none focus:bg-white border border-transparent focus:border-gray-100 transition-all leading-relaxed"
                    rows={4}
                    value={art.text || ""}
                    onChange={(e) => {
                      const newArt = [...formData.articles];
                      newArt[i].text = e.target.value;
                      setFormData({ ...formData, articles: newArt });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL NOUVEL ARTICLE DE RÉNOVATION */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvel Article Rénovation"
      >
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase">
              Titre de l'article
            </label>
            <input
              className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold mt-1"
              placeholder="Ex: Rénovation énergétique..."
              value={newArticle.title}
              onChange={(e) =>
                setNewArticle({ ...newArticle, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase">
              Description
            </label>
            <textarea
              className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm mt-1"
              placeholder="Décrivez cette expertise..."
              rows={5}
              value={newArticle.text}
              onChange={(e) =>
                setNewArticle({ ...newArticle, text: e.target.value })
              }
            />
          </div>
          <button
            onClick={() => {
              if (!newArticle.title) return toast.error("Le titre est requis");
              setFormData({
                ...formData,
                articles: [...formData.articles, newArticle],
              });
              setIsModalOpen(false);
              setNewArticle({
                badge: "Focus Rénovation",
                title: "",
                text: "",
                image:
                  "https://images.unsplash.com/photo-1484154218962-a197022b5858",
              });
              toast.success("Article ajouté au brouillon");
            }}
            className="w-full bg-primary text-white py-5 font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
          >
            CONFIRMER L'AJOUT
          </button>
        </div>
      </Modal>
    </div>
  );
};
