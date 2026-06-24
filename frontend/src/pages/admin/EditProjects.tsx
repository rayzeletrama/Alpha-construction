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
} from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/src/components/admin/Modals";


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

  const { data: page } = useQuery({
    queryKey: ["page", "projects"],
    queryFn: async () => (await api.get("/v1/pages/projects")).data,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects-list"],
    queryFn: async () => (await api.get("/v1/projects")).data,
  });

  useEffect(() => {
    if (page) setPageData(page.content);
  }, [page]);

  const updatePage = useMutation({
    mutationFn: (content: any) => api.put("/v1/pages/projects", { content }),
    onSuccess: () => toast.success("Contenu de la page enregistré"),
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
      toast.success("Projet ajouté !");
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: number) => api.delete(`/v1/projects/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["projects-list"] }),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/v1/upload", formData);
      setNewProject({ ...newProject, image_url: res.data.url });
      toast.success("Image prête");
    } catch (err) {
      toast.error("Erreur upload");
    } finally {
      setIsUploading(false);
    }
  };

  if (!pageData || projectsLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-center border-b pb-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          Gestion Réalisations
        </h1>
        <button
          onClick={() => updatePage.mutate(pageData)}
          className="bg-primary text-white px-8 py-3 rounded-sm font-bold flex items-center gap-2 hover:brightness-110"
        >
          <Save size={18} /> ENREGISTRER TOUT
        </button>
      </div>

      {/* 1. TEXTES DE LA PAGE (HERO / INTRO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-6 shadow-sm border space-y-4">
          <h2 className="font-bold uppercase text-xs text-gray-400">
            Section Hero
          </h2>
          <input
            className="w-full p-3 border font-bold"
            value={pageData.hero.title || ""}
            onChange={(e) =>
              setPageData({
                ...pageData,
                hero: { ...pageData.hero, title: e.target.value },
              })
            }
          />
          <input
            className="w-full p-3 border text-xs"
            value={pageData.hero.image || ""}
            onChange={(e) =>
              setPageData({
                ...pageData,
                hero: { ...pageData.hero, image: e.target.value },
              })
            }
          />
        </section>
        <section className="bg-white p-6 shadow-sm border space-y-4">
          <h2 className="font-bold uppercase text-xs text-gray-400">
            Introduction
          </h2>
          <input
            className="w-full p-3 border font-bold"
            value={pageData.intro.title || ""}
            onChange={(e) =>
              setPageData({
                ...pageData,
                intro: { ...pageData.intro, title: e.target.value },
              })
            }
          />
          <textarea
            className="w-full p-3 border text-sm"
            rows={2}
            value={pageData.intro.description || ""}
            onChange={(e) =>
              setPageData({
                ...pageData,
                intro: { ...pageData.intro, description: e.target.value },
              })
            }
          />
        </section>
      </div>

      {/* 2. GRILLE DU PORTFOLIO (LES PHOTOS) */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Le Portfolio
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-5 py-2 rounded-sm font-bold text-xs flex items-center gap-2 hover:bg-primary transition-all"
          >
            <Plus size={16} /> AJOUTER UNE RÉALISATION
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((proj: any) => (
            <div
              key={proj.id}
              className="bg-white p-4 rounded-sm border group shadow-sm"
            >
              <div className="relative aspect-video bg-gray-100 mb-4 overflow-hidden">
                <img
                  src={proj.image_url}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => deleteProject.mutate(proj.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-sm uppercase">{proj.title}</p>
                <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-sm">
                  <LinkIcon size={12} className="text-blue-400" />
                  <span className="text-[10px] font-mono text-blue-600 truncate">
                    {proj.slug || "Non lié"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ARTICLES DYNAMIQUES (FOCUS EN BAS DE PAGE) */}
      <section className="space-y-6 border-t pt-10">
        <h2 className="text-2xl font-black uppercase tracking-tighter">
          Articles Focus (Bas de page)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pageData.articles.map((art: any, i: number) => (
            <div key={i} className="bg-white p-6 border rounded-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-primary uppercase">
                  Article {i + 1}
                </span>
                <input
                  placeholder="Slug de liaison"
                  className="p-1 border text-[10px] font-mono w-40"
                  value={art.slug || ""}
                  onChange={(e) => {
                    const newArt = [...pageData.articles];
                    newArt[i].slug = e.target.value;
                    setPageData({ ...pageData, articles: newArt });
                  }}
                />
              </div>
              <input
                className="w-full p-2 border font-bold"
                value={art.title || ""}
                onChange={(e) => {
                  const newArt = [...pageData.articles];
                  newArt[i].title = e.target.value;
                  setPageData({ ...pageData, articles: newArt });
                }}
              />
              <textarea
                className="w-full p-2 border text-sm"
                rows={3}
                value={art.text || ""}
                onChange={(e) => {
                  const newArt = [...pageData.articles];
                  newArt[i].text = e.target.value;
                  setPageData({ ...pageData, articles: newArt });
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* MODAL AJOUT RÉALISATION */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle Réalisation"
      >
        <div className="space-y-4">
          <input
            className="w-full p-3 border font-bold"
            placeholder="Titre du projet"
            value={newProject.title}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.target.value })
            }
          />
          <input
            className="w-full p-3 border text-xs font-mono"
            placeholder="Slug de l'article lié (ex: villa-luxe)"
            value={newProject.slug}
            onChange={(e) =>
              setNewProject({ ...newProject, slug: e.target.value })
            }
          />
          <select
            className="w-full p-3 border"
            value={newProject.category}
            onChange={(e) =>
              setNewProject({ ...newProject, category: e.target.value })
            }
          >
            <option>Construction</option>
            <option>Rénovation</option>
            <option>Maçonnerie</option>
            <option>Terrassement</option>
          </select>
          <input type="file" onChange={handleFileUpload} className="text-sm" />
          <button
            onClick={() => addProject.mutate(newProject)}
            className="w-full bg-primary text-white py-4 font-bold uppercase tracking-widest"
          >
            PUBLIER
          </button>
        </div>
      </Modal>
    </div>
  );
};
