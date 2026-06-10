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
  X,
  CheckCircle2,
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
  });

  // Fetch Data
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

  // Mutations
  const updatePage = useMutation({
    mutationFn: (content: any) => api.put("/v1/pages/projects", { content }),
    onSuccess: () => toast.success("Mise en page enregistrée"),
    onError: () => toast.error("Erreur lors de la sauvegarde"),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewProject({ ...newProject, image_url: data.url });
      toast.success("Image téléchargée");
    } catch (err) {
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const addProject = useMutation({
    mutationFn: (newProj: any) => api.post("/v1/projects", newProj),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects-list"] });
      setIsModalOpen(false);
      setNewProject({ title: "", category: "Construction", image_url: "" });
      toast.success("Projet ajouté au portfolio !");
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: number) => api.delete(`/v1/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects-list"] });
      toast.success("Projet supprimé");
    },
  });

  if (!pageData || projectsLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <h1 className="text-3xl font-black tracking-tighter uppercase">
          Portfolio
        </h1>
        <button
          onClick={() => updatePage.mutate(pageData)}
          disabled={updatePage.isPending}
          className="w-full md:w-auto bg-primary text-white px-8 py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20"
        >
          {updatePage.isPending ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Save size={18} />
          )}
          ENREGISTRER LES TEXTES
        </button>
      </div>

      {/* SECTION TEXTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm space-y-4 border border-gray-100">
          <h2 className="font-bold uppercase text-xs text-primary tracking-widest flex items-center gap-2">
            <ImageIcon size={14} /> Header & Hero
          </h2>
          <input
            className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
            value={pageData.hero.title || ""}
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
            value={pageData.hero.image || ""}
            onChange={(e) =>
              setPageData({
                ...pageData,
                hero: { ...pageData.hero, image: e.target.value },
              })
            }
            placeholder="URL Image Hero"
          />
        </section>

        <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm space-y-4 border border-gray-100">
          <h2 className="font-bold uppercase text-xs text-primary tracking-widest">
            Introduction
          </h2>
          <input
            className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold"
            value={pageData.intro.title || ""}
            onChange={(e) =>
              setPageData({
                ...pageData,
                intro: { ...pageData.intro, title: e.target.value },
              })
            }
          />
          <textarea
            className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm"
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

      {/* GRILLE DES PROJETS */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black tracking-tighter uppercase">
            Réalisations
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-5 py-2 rounded-sm font-bold text-xs flex items-center gap-2 hover:bg-primary transition-all"
          >
            <Plus size={16} /> AJOUTER
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {projects?.map((proj: any) => (
            <div
              key={proj.id}
              className="group relative aspect-square bg-gray-100 rounded-sm overflow-hidden border border-gray-200"
            >
              <img
                src={proj.image_url}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <p className="text-white text-xs font-black uppercase mb-3 tracking-tighter">
                  {proj.title}
                </p>
                <button
                  onClick={() => {
                    if (confirm("Supprimer ce projet ?"))
                      deleteProject.mutate(proj.id);
                  }}
                  className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL AJOUT PROJET */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouveau Projet"
      >
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase">
              Titre de la réalisation
            </label>
            <input
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 outline-none focus:border-primary"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase">
              Catégorie
            </label>
            <select
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 outline-none focus:border-primary"
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
              Image du projet
            </label>
            <div className="mt-2 flex items-center gap-4">
              <div className="h-20 w-20 bg-gray-100 rounded-sm border flex items-center justify-center overflow-hidden">
                {newProject.image_url ? (
                  <img
                    src={newProject.image_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="text-gray-300" />
                )}
              </div>
              <label className="flex-1 cursor-pointer bg-white border-2 border-dashed border-gray-200 p-4 text-center hover:border-primary transition-colors">
                <span className="text-[10px] font-bold text-gray-500">
                  {isUploading ? "TRANSFERT..." : "CLIQUEZ POUR UPLOADER"}
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
            className="w-full bg-primary text-white py-4 font-black uppercase tracking-widest hover:brightness-110 disabled:opacity-30 transition-all flex justify-center items-center gap-2"
          >
            {addProject.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "AJOUTER AU PORTFOLIO"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};
