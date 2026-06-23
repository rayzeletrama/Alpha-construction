import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
import api from "../lib/axios";
import { useState, useEffect } from "react";

export const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => (await api.get(`/v1/articles/${slug}`)).data,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  if (!article)
    return <div className="text-center pt-40">Article introuvable</div>;

  return (
    <div className="pt-20 bg-white">
      {/* Hero Section */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden bg-black">
        <img
          src={article.main_image}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center text-white px-6">
          <span className="text-xs font-bold uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/25">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-6xl font-black uppercase mt-4">
            {article.title}
          </h1>
        </div>
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto space-y-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-black uppercase text-xs font-bold"
        >
          <ArrowLeft size={16} /> Retour
        </button>

        <p className="text-xl md:text-2xl text-center font-medium leading-relaxed">
          {article.full_description}
        </p>

        {/* Sections détaillées */}
        <div className="space-y-10 border-t pt-10">
          {article.sections?.map((sect: any, i: number) => (
            <div key={i} className="space-y-4">
              <h3 className="text-xl font-black uppercase border-l-4 border-primary pl-4">
                {sect.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{sect.text}</p>
            </div>
          ))}
        </div>

        {/* FAQ Dynamique */}
        <div className="pt-12 border-t">
          <h3 className="text-2xl font-black text-center mb-8 uppercase">
            Questions Fréquentes
          </h3>
          <div className="space-y-4">
            {article.faqs?.map((faq: any, i: number) => (
              <details
                key={i}
                className="group border rounded-lg p-4 bg-gray-50"
              >
                <summary className="font-bold cursor-pointer list-none flex justify-between items-center">
                  {faq.question}
                  <ChevronDown className="group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-600 border-t pt-4">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
