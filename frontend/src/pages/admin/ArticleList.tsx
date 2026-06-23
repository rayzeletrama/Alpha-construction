import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";

export const ArticleList = () => {
  const queryClient = useQueryClient();

  // 1. Récupérer tous les articles
  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles-list"],
    queryFn: async () => (await api.get("/v1/articles")).data,
  });

  // 2. Mutation pour supprimer
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/v1/articles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles-list"] });
      toast.success("Article supprimé définitivement");
    },
  });

  if (isLoading)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-primary" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            Articles de Savoir-Faire
          </h1>
          <p className="text-gray-500 text-sm">
            Gérez les pages de détails techniques et FAQ.
          </p>
        </div>
        <Link
          to="/admin/articles/new"
          className="bg-black text-white px-6 py-3 rounded-sm font-bold text-xs flex items-center gap-2 hover:bg-primary transition-all"
        >
          <Plus size={16} /> CRÉER UN ARTICLE
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {articles?.map((article: any) => (
          <div
            key={article.id}
            className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center justify-between group hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                <img
                  src={article.main_image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                  {article.category}
                </span>
                <h3 className="font-bold text-lg uppercase tracking-tight">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Slug: /article/{article.slug}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/admin/articles/edit/${article.slug}`}
                className="p-2 text-gray-400 hover:text-black transition-colors"
                title="Éditer"
              >
                <Edit size={20} />
              </Link>
              <button
                onClick={() => {
                  if (confirm("Supprimer cet article ?"))
                    deleteMutation.mutate(article.id);
                }}
                className="p-2 text-red-300 hover:text-red-600 transition-colors"
                title="Supprimer"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {articles?.length === 0 && (
          <div className="text-center py-20 bg-gray-50 border-2 border-dashed rounded-sm">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">
              Aucun article technique pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
