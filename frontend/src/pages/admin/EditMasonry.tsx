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
  Link as LinkIcon,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/src/components/admin/Modals";
import { Link } from "react-router-dom";
import imageCompression from "browser-image-compression"; // ✅ Ajout de la compression

export const EditMasonry = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const [newArticle, setNewArticle] = useState({
    badge: "Focus Technique",
    title: "",
    slug: "", // Pour la liaison dynamique
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

  // ✅ GESTION DE L'UPLOAD AVEC COMPRESSION (Solution au problème de taille/502)
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    path: string,
    index?: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(index !== undefined ? `${path}-${index}` : path);

    try {
      // 1. Options de compression (Max 1Mo, Redimensionnement auto)
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      toast.info("Optimisation de l'image...");
      const compressedFile = await imageCompression(file, options);

      // 2. Préparation de l'envoi (On utilise 'uploadData' pour éviter tout conflit)
      const uploadData = new FormData();
      uploadData.append("file", compressedFile);

      const res = await api.post("/v1/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newUrl = res.data.url;

      // 3. Mise à jour de l'état local selon le champ
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

      toast.success("Image téléchargée et optimisée");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du transfert de l'image");
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
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 md:px-0">
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <Link
            to="/maconnerie"
            className="text-[10px] font-black text-gray-400 hover:text-primary flex items-center gap-2 mb-2 transition-all uppercase tracking-widest"
          >
            <ArrowLeft size={12} /> Voir la page publique
          </Link>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-black">
            Expertise : Maçonnerie
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
        {/* COLONNE GAUCHE : HERO & INTRO */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-bold uppercase text-xs text-primary tracking-widest mb-6 flex items-center gap-2">
              <ImageIcon size={16} /> Section Hero
            </h2>
            <div className="space-y-4">
              <input
                className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold text-xl"
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
                  <Upload size={24} className="mb-2" />
                  <span className="font-bold text-xs uppercase">
                    {uploadingField === "hero" ? "Envoi..." : "Changer l'image"}
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
          </section>

          <section className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-bold uppercase text-xs text-black tracking-widest mb-6 flex items-center gap-2">
              <Type size={16} /> Présentation & Images
            </h2>
            <div className="space-y-4">
              <input
                className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
                value={formData.intro?.title || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    intro: { ...formData.intro, title: e.target.value },
                  })
                }
              />
              <textarea
                className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm leading-relaxed"
                rows={4}
                value={formData.intro?.text || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    intro: { ...formData.intro, text: e.target.value },
                  })
                }
              />
              <div className="grid grid-cols-2 gap-4 pt-4">
                {formData.intro?.images?.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative group aspect-[3/4] bg-gray-50 border rounded-sm overflow-hidden"
                  >
                    <img src={img} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                      <Upload size={20} />
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e, "intro_images", idx)
                        }
                        accept="image/*"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* SIDEBAR : SERVICES */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-bold uppercase text-xs text-gray-400 tracking-widest mb-6 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary" /> Prestations
            </h2>
            <div className="space-y-3">
              {formData.intro?.services?.map((s: string, i: number) => (
                <div key={i} className="flex items-center gap-2 group">
                  <input
                    className="flex-1 text-sm font-bold py-1 bg-transparent border-b border-gray-100 focus:border-primary outline-none"
                    value={s || ""}
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
                    className="opacity-0 group-hover:opacity-100 text-red-400"
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
                      services: [
                        ...formData.intro.services,
                        "Nouvelle prestation",
                      ],
                    },
                  })
                }
                className="w-full mt-4 py-2 border-2 border-dashed border-gray-100 text-[9px] font-black uppercase text-gray-400 hover:text-primary transition-all"
              >
                + Ajouter
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* FOCUS TECHNIQUES AVEC SLUGS */}
      <section className="space-y-8">
        <h2 className="text-2xl font-black tracking-tighter uppercase border-t pt-10">
          Articles de Focus Technique
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {formData.articles?.map((art: any, i: number) => (
            <div
              key={i}
              className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 relative group flex flex-col gap-6"
            >
              <button
                onClick={() => {
                  if (window.confirm("Supprimer ?")) {
                    const newArt = formData.articles.filter(
                      (_: any, idx: number) => idx !== i,
                    );
                    setFormData({ ...formData, articles: newArt });
                  }
                }}
                className="absolute top-4 right-4 p-2 text-gray-200 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-32">
                  <div className="relative group aspect-square bg-gray-50 rounded-sm overflow-hidden border">
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
                  {/* CHAMP SLUG BLEU POUR LIAISON */}
                  <div className="bg-blue-50/50 p-2 rounded-sm border border-blue-100">
                    <label className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-1 mb-1">
                      <LinkIcon size={10} /> Slug de l'article détaillé
                    </label>
                    <input
                      className="w-full text-[10px] font-mono bg-transparent outline-none focus:text-blue-700"
                      placeholder="ex: maconnerie-fondations"
                      value={art.slug || ""}
                      onChange={(e) => {
                        const newArtList = [...formData.articles];
                        newArtList[i].slug = e.target.value;
                        setFormData({ ...formData, articles: newArtList });
                      }}
                    />
                  </div>
                  <input
                    className="w-full text-[10px] font-black text-primary uppercase border-b border-gray-50 outline-none"
                    value={art.badge || ""}
                    onChange={(e) => {
                      const n = [...formData.articles];
                      n[i].badge = e.target.value;
                      setFormData({ ...formData, articles: n });
                    }}
                  />
                  <input
                    className="w-full font-bold text-lg outline-none"
                    value={art.title || ""}
                    onChange={(e) => {
                      const n = [...formData.articles];
                      n[i].title = e.target.value;
                      setFormData({ ...formData, articles: n });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 font-bold uppercase text-xs hover:border-primary hover:text-primary transition-all"
        >
          + Ajouter un nouvel article de focus
        </button>
      </section>

      {/* MODAL AJOUT ARTICLE */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouveau Focus Technique"
      >
        <div className="space-y-4">
          <input
            className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
            placeholder="Titre de l'article"
            value={newArticle.title}
            onChange={(e) =>
              setNewArticle({ ...newArticle, title: e.target.value })
            }
          />
          <input
            className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-mono text-xs"
            placeholder="Slug (ex: maconnerie-beton)"
            value={newArticle.slug}
            onChange={(e) =>
              setNewArticle({ ...newArticle, slug: e.target.value })
            }
          />
          <textarea
            className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm"
            placeholder="Courte description..."
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
              toast.success("Ajouté au brouillon");
            }}
            className="w-full bg-primary text-white py-4 font-black uppercase tracking-widest hover:brightness-110"
          >
            CONFIRMER L'AJOUT
          </button>
        </div>
      </Modal>
    </div>
  );
};
