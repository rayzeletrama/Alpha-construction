import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import {
  Save,
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  Upload,
  AlignLeft,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

export const EditArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(slug);

  const [form, setForm] = useState<any>({
    title: "",
    category: "Maçonnerie",
    subtitle: "",
    full_description: "",
    main_image: "",
    sections: [], // Titres + Paragraphes
    faqs: [], // Questions + Réponses
  });

  const [isUploading, setIsUploading] = useState(false);

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => (await api.get(`/v1/articles/${slug}`)).data,
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && article) {
      setForm({
        ...article,
        sections: article.sections || [],
        faqs: article.faqs || [],
      });
    }
  }, [article, isEdit]);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      isEdit
        ? api.put(`/v1/articles/${form.id}`, data)
        : api.post("/v1/articles", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles-list"] });
      toast.success(isEdit ? "Article mis à jour" : "Article publié !");
      navigate("/admin/articles");
    },
    onError: () => toast.error("Une erreur est survenue"),
  });

  // --- LOGIQUE SECTIONS ---
  const addSection = () =>
    setForm({ ...form, sections: [...form.sections, { title: "", text: "" }] });

  const updateSection = (index: number, field: string, value: string) => {
    const newSections = [...form.sections];
    newSections[index][field] = value;
    setForm({ ...form, sections: newSections });
  };

  const removeSection = (index: number) => {
    setForm({
      ...form,
      sections: form.sections.filter((_: any, i: number) => i !== index),
    });
  };

  // --- LOGIQUE FAQ ---
  const addFaq = () =>
    setForm({ ...form, faqs: [...form.faqs, { question: "", answer: "" }] });

  const updateFaq = (index: number, field: string, value: string) => {
    const newFaqs = [...form.faqs];
    newFaqs[index][field] = value;
    setForm({ ...form, faqs: newFaqs });
  };

  const removeFaq = (index: number) => {
    setForm({
      ...form,
      faqs: form.faqs.filter((_: any, i: number) => i !== index),
    });
  };

  // --- GESTION IMAGE ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/v1/upload", formData);
      setForm({ ...form, main_image: res.data.url });
      toast.success("Image téléchargée");
    } catch (err) {
      toast.error("Erreur d'upload");
    } finally {
      setIsUploading(false);
    }
  };

  if (isEdit && isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4">
        <div>
          <Link
            to="/admin/articles"
            className="text-[10px] font-black text-gray-400 hover:text-primary flex items-center gap-2 mb-2 uppercase tracking-widest"
          >
            <ArrowLeft size={12} /> Retour à la liste
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            {isEdit ? "Éditer l'article" : "Nouvel Article Détail"}
          </h1>
        </div>
        <button
          onClick={() => mutation.mutate(form)}
          disabled={mutation.isPending}
          className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-sm font-bold flex items-center justify-center gap-3 hover:brightness-110 shadow-xl"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <Save size={20} />
          )}
          {isEdit ? "SAUVEGARDER" : "PUBLIER L'ARTICLE"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* COLONNE GAUCHE : INFOS & IMAGE */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 space-y-6">
            <h2 className="font-bold uppercase text-xs text-primary tracking-widest flex items-center gap-2">
              Configuration de base
            </h2>
            <div className="space-y-4">
              <input
                placeholder="Titre de l'article (ex: Maçonnerie de Pierre)"
                className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:border-primary font-bold text-xl"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                placeholder="Sous-titre accrocheur"
                className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
              <div className="relative group aspect-video bg-gray-100 rounded-sm overflow-hidden border">
                {form.main_image ? (
                  <img
                    src={form.main_image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    Aucune image
                  </div>
                )}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                  <Upload size={24} className="mb-2" />
                  <span className="font-bold text-xs uppercase">
                    {isUploading
                      ? "Transfert..."
                      : "Changer l'image principale"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </section>

          {/* SECTIONS DYNAMIQUES */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-black uppercase text-xl tracking-tighter flex items-center gap-2">
                <AlignLeft className="text-primary" /> Corps de l'article
                (Sections)
              </h2>
              <button
                onClick={addSection}
                className="text-primary font-bold text-xs flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> AJOUTER UN PARAGRAPHE
              </button>
            </div>

            <div className="space-y-6">
              {form.sections.map((sect: any, i: number) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm relative group"
                >
                  <button
                    onClick={() => removeSection(i)}
                    className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="space-y-4">
                    <input
                      placeholder="Titre de la section (ex: Matériaux utilisés)"
                      className="w-full p-2 border-b border-gray-100 font-bold uppercase text-sm outline-none focus:border-primary bg-transparent"
                      value={sect.title}
                      onChange={(e) =>
                        updateSection(i, "title", e.target.value)
                      }
                    />
                    <textarea
                      placeholder="Développez votre explication technique ici..."
                      className="w-full p-3 bg-gray-50 border-none text-sm leading-relaxed outline-none focus:bg-white transition-all"
                      rows={4}
                      value={sect.text}
                      onChange={(e) => updateSection(i, "text", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* COLONNE DROITE : DESCRIPTION & FAQ */}
        <div className="space-y-10">
          <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold uppercase text-xs text-gray-400 tracking-widest">
              Résumé / Présentation
            </h2>
            <textarea
              placeholder="Texte d'introduction de la page détail..."
              className="w-full p-3 bg-gray-50 border-none text-sm italic outline-none focus:bg-white"
              rows={6}
              value={form.full_description}
              onChange={(e) =>
                setForm({ ...form, full_description: e.target.value })
              }
            />
          </section>

          <section className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="font-bold uppercase text-xs text-gray-400 tracking-widest flex items-center gap-2">
                <HelpCircle size={14} /> FAQ
              </h2>
              <button
                onClick={addFaq}
                className="text-primary font-bold text-[10px] uppercase hover:underline"
              >
                + Ajouter
              </button>
            </div>

            <div className="space-y-4">
              {form.faqs.map((faq: any, i: number) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm space-y-2 relative group"
                >
                  <button
                    onClick={() => removeFaq(i)}
                    className="absolute top-2 right-2 text-red-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                  <input
                    placeholder="Question ?"
                    className="w-full text-xs font-bold border-b border-gray-50 outline-none focus:border-primary py-1"
                    value={faq.question}
                    onChange={(e) => updateFaq(i, "question", e.target.value)}
                  />
                  <textarea
                    placeholder="Réponse..."
                    className="w-full text-[11px] text-gray-500 bg-gray-50 p-2 outline-none"
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => updateFaq(i, "answer", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
