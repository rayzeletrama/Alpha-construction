import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { Save, Plus, Trash2, Loader2, ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

export const EditArticle = () => {
  const { slug } = useParams(); // Si vide = Mode Création
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(slug);

  const [form, setForm] = useState<any>({
    title: "",
    category: "Maçonnerie",
    full_description: "",
    main_image: "",
    faqs: [],
  });

  // 1. Charger les données SEULEMENT si on est en mode édition
  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => (await api.get(`/v1/articles/${slug}`)).data,
    enabled: isEdit, // Désactive la requête si on crée un nouvel article
  });

  useEffect(() => {
    if (isEdit && article) setForm(article);
  }, [article, isEdit]);

  // 2. Mutation Hybride (POST pour nouveau, PUT pour existant)
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return isEdit
        ? api.put(`/v1/articles/${form.id}`, data)
        : api.post("/v1/articles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles-list"] });
      toast.success(isEdit ? "Article mis à jour" : "Article créé !");
      navigate("/admin/articles"); // Retour à la liste
    },
    onError: () => toast.error("Erreur lors de l'enregistrement"),
  });

  // 3. Gestion FAQ
  const addFaq = () =>
    setForm({ ...form, faqs: [...form.faqs, { question: "", answer: "" }] });
  const updateFaq = (i: number, field: string, val: string) => {
    const newFaqs = [...form.faqs];
    newFaqs[i][field] = val;
    setForm({ ...form, faqs: newFaqs });
  };

  if (isEdit && isLoading)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-center border-b pb-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          {isEdit ? `Modifier : ${form.title}` : "Nouvel Article"}
        </h1>
        <button
          onClick={() => mutation.mutate(form)}
          className="bg-primary text-white px-8 py-3 rounded-sm font-bold flex items-center gap-2"
        >
          <Save size={18} /> {isEdit ? "SAUVEGARDER" : "PUBLIER"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* INFOS DE BASE */}
        <section className="bg-white p-8 rounded-sm shadow-sm space-y-6">
          <h2 className="font-bold text-xs uppercase text-gray-400">
            Informations de base
          </h2>
          <input
            placeholder="Titre de l'article"
            className="w-full p-3 border font-bold"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <select
            className="w-full p-3 border text-sm"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option>Maçonnerie</option>
            <option>Rénovation</option>
            <option>Terrassement</option>
          </select>
          <input
            placeholder="URL Image principale"
            className="w-full p-3 border text-xs"
            value={form.main_image}
            onChange={(e) => setForm({ ...form, main_image: e.target.value })}
          />
        </section>

        {/* DESCRIPTION */}
        <section className="bg-white p-8 rounded-sm shadow-sm space-y-4">
          <h2 className="font-bold text-xs uppercase text-gray-400">
            Description longue
          </h2>
          <textarea
            className="w-full p-3 border text-sm"
            rows={8}
            value={form.full_description}
            onChange={(e) =>
              setForm({ ...form, full_description: e.target.value })
            }
          />
        </section>
      </div>

      {/* FAQ DYNAMIQUE */}
      <section className="bg-white p-8 rounded-sm shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="font-bold text-xs uppercase text-gray-400">
            Questions Fréquentes
          </h2>
          <button onClick={addFaq} className="text-primary font-bold text-xs">
            + AJOUTER UNE QUESTION
          </button>
        </div>
        <div className="space-y-4">
          {form.faqs?.map((faq: any, i: number) => (
            <div
              key={i}
              className="p-4 bg-gray-50 border rounded-sm space-y-3 relative group"
            >
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    faqs: form.faqs.filter((_: any, idx: number) => idx !== i),
                  })
                }
                className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              <input
                placeholder="La question..."
                className="w-full p-2 border-b bg-transparent font-bold"
                value={faq.question}
                onChange={(e) => updateFaq(i, "question", e.target.value)}
              />
              <textarea
                placeholder="La réponse..."
                className="w-full p-2 bg-white border text-sm"
                rows={2}
                value={faq.answer}
                onChange={(e) => updateFaq(i, "answer", e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
