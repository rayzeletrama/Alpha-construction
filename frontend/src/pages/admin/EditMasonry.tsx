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
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/src/components/admin/Modals";

export const EditMasonry = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // État pour un nouvel article via la Modal
  const [newArticle, setNewArticle] = useState({
    badge: "Focus Technique",
    title: "",
    text: "",
    image: "https://images.unsplash.com/photo-1590069230002-70cc83810bb3",
  });

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", "masonry"],
    queryFn: async () => (await api.get("/v1/pages/masonry")).data,
  });

  useEffect(() => {
    if (page) setFormData(page.content);
  }, [page]);

  const mutation = useMutation({
    mutationFn: (newContent: any) =>
      api.put("/v1/pages/masonry", { content: newContent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", "masonry"] });
      toast.success("Page Maçonnerie mise à jour !");
    },
    onError: () => toast.error("Erreur lors de la sauvegarde"),
  });

  // Gestion de l'upload d'image
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    path: string,
    index?: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(index !== undefined ? `${path}-${index}` : path);
    const data = new FormData();
    formData.append("file", file);

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
      } else if (path === "new_article") {
        setNewArticle({ ...newArticle, image: newUrl });
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
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            Expertise : Maçonnerie
          </h1>
          <p className="text-gray-500 text-sm italic">
            Modifiez le contenu technique de la page Maçonnerie.
          </p>
        </div>
        <button
          onClick={() => mutation.mutate(formData)}
          disabled={mutation.isPending}
          className="w-full md:w-auto bg-primary text-white px-10 py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Save size={18} />
          )}
          ENREGISTRER LA PAGE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLONNE GAUCHE : HERO & INTRO */}
        <div className="lg:col-span-2 space-y-8">
          {/* SECTION HERO */}
          <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-bold uppercase text-xs text-primary tracking-widest mb-6 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary" /> Bannière Hero
            </h2>
            <div className="space-y-4">
              <input
                className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold text-xl"
                value={formData.hero.title || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, title: e.target.value },
                  })
                }
                placeholder="Titre de la page"
              />
              <div className="relative group aspect-[21/9] bg-gray-100 rounded-sm overflow-hidden border">
                <img
                  src={formData.hero.image}
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <span className="text-white font-bold text-xs flex items-center gap-2">
                    <Upload size={16} />{" "}
                    {uploadingField === "hero"
                      ? "Chargement..."
                      : "CHANGER L'IMAGE"}
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

          {/* SECTION INTRODUCTION */}
          <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-bold uppercase text-xs text-black tracking-widest mb-6 flex items-center gap-2">
              <div className="w-1 h-4 bg-black" /> Présentation Générale
            </h2>
            <div className="space-y-4">
              <input
                className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
                value={formData.intro.title || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    intro: { ...formData.intro, title: e.target.value },
                  })
                }
              />
              <textarea
                className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm"
                rows={4}
                value={formData.intro.text || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    intro: { ...formData.intro, text: e.target.value },
                  })
                }
              />

              <div className="grid grid-cols-2 gap-4 pt-4">
                {formData.intro.images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative group aspect-[3/4] bg-gray-50 border rounded-sm overflow-hidden"
                  >
                    <img src={img} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Upload size={16} className="text-white" />
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

        {/* COLONNE DROITE : SERVICES (LISTE) */}
        <div className="space-y-8">
          <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-bold uppercase text-xs text-gray-400 tracking-widest mb-6">
              Expertises détaillées
            </h2>
            <div className="space-y-3">
              {formData.intro.services.map((s: string, i: number) => (
                <div key={i} className="flex items-center gap-2 group">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <input
                    className="flex-1 text-sm font-semibold py-1 bg-transparent border-b border-transparent focus:border-gray-200 outline-none"
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
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    intro: {
                      ...formData.intro,
                      services: [...formData.intro.services, "Nouveau service"],
                    },
                  })
                }
                className="w-full mt-4 py-2 border-2 border-dashed border-gray-100 text-[10px] font-black uppercase text-gray-400 hover:border-primary hover:text-primary transition-all"
              >
                + Ajouter une ligne
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* ARTICLES TECHNIQUES (Articles) */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black tracking-tighter uppercase">
            Focus Techniques
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-5 py-2 rounded-sm font-bold text-xs flex items-center gap-2"
          >
            <Plus size={16} /> NOUVEL ARTICLE
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {formData.articles.map((art: any, i: number) => (
            <div
              key={i}
              className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 relative group"
            >
              <button
                onClick={() => {
                  if (confirm("Supprimer cet article technique ?")) {
                    const newArt = formData.articles.filter(
                      (_: any, idx: number) => idx !== i,
                    );
                    setFormData({ ...formData, articles: newArt });
                  }
                }}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-32">
                  <div className="relative group aspect-square bg-gray-100 rounded-sm overflow-hidden">
                    <img
                      src={art.image}
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Upload size={14} className="text-white" />
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
                    className="w-full text-xs font-black text-primary uppercase bg-transparent border-b border-gray-50 outline-none"
                    value={art.badge || ""}
                    onChange={(e) => {
                      const newArt = [...formData.articles];
                      newArt[i].badge = e.target.value;
                      setFormData({ ...formData, articles: newArt });
                    }}
                  />
                  <input
                    className="w-full font-bold text-lg outline-none"
                    value={art.title || ""}
                    onChange={(e) => {
                      const newArt = [...formData.articles];
                      newArt[i].title = e.target.value;
                      setFormData({ ...formData, articles: newArt });
                    }}
                  />
                  <textarea
                    className="w-full text-sm text-gray-500 bg-gray-50 p-3 rounded-sm outline-none"
                    rows={3}
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

      {/* MODAL NOUVEL ARTICLE */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvel Focus Technique"
      >
        <div className="space-y-4">
          <input
            className="w-full p-3 bg-gray-50 border border-gray-100 outline-none"
            placeholder="Titre de l'article"
            value={newArticle.title}
            onChange={(e) =>
              setNewArticle({ ...newArticle, title: e.target.value })
            }
          />
          <textarea
            className="w-full p-3 bg-gray-50 border border-gray-100 outline-none"
            placeholder="Description technique..."
            rows={4}
            value={newArticle.text}
            onChange={(e) =>
              setNewArticle({ ...newArticle, text: e.target.value })
            }
          />
          <button
            onClick={() => {
              setFormData({
                ...formData,
                articles: [...formData.articles, newArticle],
              });
              setIsModalOpen(false);
              toast.success("Article ajouté à la liste !");
            }}
            className="w-full bg-primary text-white py-4 font-black uppercase tracking-widest hover:brightness-110"
          >
            Ajouter au brouillon
          </button>
        </div>
      </Modal>
    </div>
  );
};
