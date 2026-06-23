import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { Save, Plus, Trash2, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export const EditArticle = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<any>(null);

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => (await api.get(`/v1/articles/${slug}`)).data,
  });

  useEffect(() => {
    if (article) setForm(article);
  }, [article]);

  const mutation = useMutation({
    mutationFn: (data: any) => api.put(`/v1/articles/${form.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article", slug] });
      toast.success("Article technique mis à jour !");
    },
  });

  // Gestion FAQ dynamique
  const addFaq = () =>
    setForm({
      ...form,
      faqs: [...(form.faqs || []), { question: "", answer: "" }],
    });
  const updateFaq = (i: number, field: string, val: string) => {
    const newFaqs = [...form.faqs];
    newFaqs[i][field] = val;
    setForm({ ...form, faqs: newFaqs });
  };

  if (isLoading || !form) return <Loader2 className="animate-spin" />;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-center border-b pb-6">
        <h1 className="text-2xl font-black uppercase tracking-tighter">
          Édition : {form.title}
        </h1>
        <button
          onClick={() => mutation.mutate(form)}
          className="bg-primary text-white px-6 py-2 rounded-sm font-bold flex items-center gap-2"
        >
          <Save size={18} /> ENREGISTRER
        </button>
      </div>

      {/* CONTENU PRINCIPAL */}
      <section className="bg-white p-8 rounded-sm shadow-sm space-y-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 border-b pb-2">
          Contenu Principal
        </h2>
        <input
          className="w-full p-3 border font-bold"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="w-full p-3 border text-sm"
          rows={4}
          value={form.full_description}
          onChange={(e) =>
            setForm({ ...form, full_description: e.target.value })
          }
        />
      </section>

      {/* SECTION FAQ DYNAMIQUE */}
      <section className="bg-white p-8 rounded-sm shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400">
            Questions Fréquentes (FAQ)
          </h2>
          <button
            onClick={addFaq}
            className="text-primary text-[10px] font-black uppercase flex items-center gap-1"
          >
            <Plus size={14} /> Ajouter
          </button>
        </div>
        <div className="space-y-6">
          {form.faqs?.map((faq: any, i: number) => (
            <div
              key={i}
              className="p-4 bg-gray-50 border rounded-sm relative group"
            >
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    faqs: form.faqs.filter((_: any, idx: number) => idx !== i),
                  })
                }
                className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
              <div className="space-y-3">
                <input
                  placeholder="La question..."
                  className="w-full p-2 border-b bg-transparent font-bold outline-none"
                  value={faq.question}
                  onChange={(e) => updateFaq(i, "question", e.target.value)}
                />
                <textarea
                  placeholder="La réponse détaillée..."
                  className="w-full p-2 bg-white border text-sm outline-none"
                  rows={3}
                  value={faq.answer}
                  onChange={(e) => updateFaq(i, "answer", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
