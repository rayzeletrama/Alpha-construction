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
  Link as LinkIcon,
  ArrowLeft,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/src/components/admin/Modals";
import { Link } from "react-router-dom";
import imageCompression from "browser-image-compression";

export const EditProjects = () => {
  const queryClient = useQueryClient();
  const [pageData, setPageData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [newProject, setNewProject] = useState({
    title: "",
    category: "Construction",
    image_url: "",
    slug: "",
  });

  // 1. Charger le contenu de la page (Hero/Intro/Articles focus)
  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ["page", "projects"],
    queryFn: async () => (await api.get("/v1/pages/projects")).data,
  });

  // 2. Charger la liste des photos du portfolio
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects-list"],
    queryFn: async () => (await api.get("/v1/projects")).data,
  });

  useEffect(() => {
    if (page) setPageData(page.content);
  }, [page]);

  // --- MUTATIONS ---

  const updatePage = useMutation({
    mutationFn: (content: any) => api.put("/v1/pages/projects", { content }),
    onSuccess: () => toast.success("Mise en page enregistrée !"),
    onError: () => toast.error("Erreur de sauvegarde"),
  });

  const addProject = useMutation({
    mutationFn: (newProj: any) => api.post("/v1/projects", newProj),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects-list"] });
      setIsModalOpen(false);
      setNewProject({
        title: "",
        category: "Construction",
        image_url: "",
        slug: "",
      });
      toast.success("Réalisation ajoutée au portfolio");
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: number) => api.delete(`/v1/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects-list"] });
      toast.success("Projet supprimé");
    },
  });

  // --- GESTION UPLOAD AVEC COMPRESSION ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Compression
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      toast.info("Optimisation de l'image...");
      const compressedFile = await imageCompression(file, options);

      // Envoi (Correction du nom de variable pour éviter le bug t.append)
      const uploadData = new FormData();
      uploadData.append("file", compressedFile);

      const res = await api.post("/v1/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewProject((prev) => ({ ...prev, image_url: res.data.url }));
      toast.success("Image prête !");
    } catch (err) {
      toast.error("Échec de l'envoi de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  // --- GESTION ARTICLES FOCUS (BAS DE PAGE) ---
  const addArticleBlock = () => {
    const newArticles = [
      ...(pageData.articles || []),
      {
        badge: "Savoir-faire",
        title: "Nouveau",
        text: "",
        slug: "",
        image: "",
      },
    ];
    setPageData({ ...pageData, articles: newArticles });
  };

  const removeArticleBlock = (index: number) => {
    const newArticles = pageData.articles.filter(
      (_: any, i: number) => i !== index,
    );
    setPageData({ ...pageData, articles: newArticles });
  };

  if (pageLoading || projectsLoading || !pageData)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 px-4 md:px-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <Link
            to="/realisations"
            className="text-[10px] font-black text-gray-400 hover:text-primary flex items-center gap-2 mb-2 uppercase tracking-widest"
          >
            <ArrowLeft size={12} /> Voir la galerie publique
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Gestion des Réalisations
          </h1>
        </div>
        <button
          onClick={() => updatePage.mutate(pageData)}
          disabled={updatePage.isPending}
          className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-sm font-bold flex items-center justify-center gap-3 hover:brightness-110 shadow-xl disabled:opacity-50 transition-all"
        >
          {updatePage.isPending ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <Save size={20} />
          )}
          ENREGISTRER LA PAGE
        </button>
      </div>

      {/* 1. TEXTES DE LA PAGE (CMS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold uppercase text-xs text-primary tracking-widest flex items-center gap-2">
            <ImageIcon size={16} /> Bannière Portfolio
          </h2>
          <input
            className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold text-lg"
            value={pageData.hero?.title || ""}
            onChange={(e) =>
              setPageData({
                ...pageData,
                hero: { ...pageData.hero, title: e.target.value },
              })
            }
            placeholder="Titre Hero"
          />
          <input
            className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-xs"
            value={pageData.hero?.image || ""}
            onChange={(e) =>
              setPageData({
                ...pageData,
                hero: { ...pageData.hero, image: e.target.value },
              })
            }
            placeholder="URL Image Hero"
          />
        </section>

        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold uppercase text-xs text-black tracking-widest">
            Introduction de la galerie
          </h2>
          <input
            className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
            value={pageData.intro?.title || ""}
            onChange={(e) =>
              setPageData({
                ...pageData,
                intro: { ...pageData.intro, title: e.target.value },
              })
            }
            placeholder="Titre d'intro"
          />
          <textarea
            className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm"
            rows={2}
            value={pageData.intro?.description || ""}
            onChange={(e) =>
              setPageData({
                ...pageData,
                intro: { ...pageData.intro, description: e.target.value },
              })
            }
            placeholder="Description d'intro"
          />
        </section>
      </div>

      {/* 2. GRILLE DU PORTFOLIO (CRUD) */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
            <LayoutGrid className="text-primary" /> Photos du Portfolio
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-6 py-2 rounded-sm font-bold text-xs hover:bg-primary transition-all shadow-lg"
          >
            <Plus size={16} className="mr-2" /> AJOUTER UNE RÉALISATION
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects?.map((proj: any) => (
            <div
              key={proj.id}
              className="bg-white p-4 rounded-sm border border-gray-100 group shadow-sm hover:border-primary transition-all"
            >
              <div className="relative aspect-video bg-gray-100 rounded-sm overflow-hidden mb-4">
                <img
                  src={proj.image_url}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={() => {
                    if (confirm("Supprimer ce projet ?"))
                      deleteProject.mutate(proj.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-xs uppercase truncate">
                    {proj.title}
                  </h3>
                  <span className="text-[8px] bg-gray-50 px-2 py-0.5 rounded-full border">
                    {proj.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50/50 p-2 rounded-sm border border-blue-100">
                  <LinkIcon size={12} className="text-blue-400" />
                  <span className="text-[10px] font-mono text-blue-600 truncate">
                    {proj.slug || "Lien désactivé"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ARTICLES FOCUS (BAS DE PAGE) */}
      <section className="space-y-8 border-t pt-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black tracking-tighter uppercase">
            Focus Expertise (Bas de page)
          </h2>
          <button
            onClick={addArticleBlock}
            className="text-primary font-bold text-xs flex items-center gap-1 hover:underline"
          >
            <Plus size={14} /> AJOUTER UN BLOC D'EXPERTISE
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pageData.articles?.map((art: any, i: number) => (
            <div
              key={i}
              className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm space-y-4 relative group"
            >
              <button
                onClick={() => removeArticleBlock(i)}
                className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase">
                    Badge
                  </label>
                  <input
                    className="w-full p-2 border text-[10px] font-black uppercase"
                    value={art.badge || ""}
                    onChange={(e) => {
                      const n = [...pageData.articles];
                      n[i].badge = e.target.value;
                      setPageData({ ...pageData, articles: n });
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-blue-500 uppercase">
                    Slug de liaison
                  </label>
                  <input
                    className="w-full p-2 border border-blue-100 bg-blue-50 text-[10px] font-mono"
                    value={art.slug || ""}
                    onChange={(e) => {
                      const n = [...pageData.articles];
                      n[i].slug = e.target.value;
                      setPageData({ ...pageData, articles: n });
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase">
                  Titre de l'article
                </label>
                <input
                  className="w-full p-2 border font-bold text-sm"
                  value={art.title || ""}
                  onChange={(e) => {
                    const n = [...pageData.articles];
                    n[i].title = e.target.value;
                    setPageData({ ...pageData, articles: n });
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border text-sm"
                  rows={3}
                  value={art.text || ""}
                  onChange={(e) => {
                    const n = [...pageData.articles];
                    n[i].text = e.target.value;
                    setPageData({ ...pageData, articles: n });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL NOUVELLE RÉALISATION */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle Réalisation"
      >
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase">
              Titre du projet
            </label>
            <input
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase">
              Identifiant Article lié (Slug)
            </label>
            <input
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 outline-none font-mono text-xs"
              placeholder="ex: villa-luxe-biarritz"
              value={newProject.slug}
              onChange={(e) =>
                setNewProject({ ...newProject, slug: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase">
              Catégorie
            </label>
            <select
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 outline-none"
              value={newProject.category}
              onChange={(e) =>
                setNewProject({ ...newProject, category: e.target.value })
              }
            >
              <option>Construction</option>
              <option>Rénovation</option>
              <option>Maçonnerie</option>
              <option>Terrassement</option>
              <option>Gros Œuvre</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase">
              Image de la réalisation
            </label>
            <div className="mt-2 flex items-center gap-4">
              <div className="h-20 w-20 bg-gray-100 border rounded-sm flex items-center justify-center overflow-hidden">
                {newProject.image_url ? (
                  <img
                    src={newProject.image_url}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <ImageIcon className="text-gray-300" />
                )}
              </div>
              <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-200 p-4 text-center hover:border-primary transition-all">
                <span className="text-[10px] font-bold text-gray-500">
                  {isUploading ? "OPTIMISATION..." : "CLIQUEZ POUR CHOISIR"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*"
                />
              </label>
            </div>
          </div>
          <button
            onClick={() => addProject.mutate(newProject)}
            disabled={
              !newProject.title || !newProject.image_url || addProject.isPending
            }
            className="w-full bg-primary text-white py-5 font-black uppercase tracking-widest hover:brightness-110 shadow-lg disabled:opacity-30 transition-all flex justify-center items-center gap-3"
          >
            {addProject.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}{" "}
            AJOUTER À LA GALERIE
          </button>
        </div>
      </Modal>
    </div>
  );
};
