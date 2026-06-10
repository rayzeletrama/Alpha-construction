import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { Loader2 } from "lucide-react";

export const Projects = () => {
  const [filter, setFilter] = useState("Tous");

  // 1. Récupérer le contenu de la page
  const {
    data: page,
    isLoading: pageLoading,
    isError: pageError,
  } = useQuery({
    queryKey: ["page", "projects"],
    queryFn: async () => (await api.get("/v1/pages/projects")).data,
    retry: false,
  });

  // 2. Récupérer la liste des projets
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects-list"],
    queryFn: async () => (await api.get("/v1/projects")).data,
    retry: false,
  });

  if (pageLoading || projectsLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  if (pageError || !page || !page.content) {
    return (
      <div className="h-screen flex items-center justify-center pt-20">
        Erreur : Contenu introuvable.
      </div>
    );
  }

  const content = page.content;
  const categories = [
    "Tous",
    ...new Set(projects?.map((p: any) => p.category)),
  ];

  const filteredProjects =
    filter === "Tous"
      ? projects
      : projects?.filter((p: any) => p.category === filter);

  return (
    <div className="pt-20">
      {/* HERO DYNAMIQUE */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <img
          src={content.hero.image}
          alt="Portfolio"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 text-center text-white px-6">
          <motion.span className="text-sm font-bold tracking-widest uppercase text-primary mb-4 block">
            {content.hero.subtitle}
          </motion.span>
          <motion.h1 className="text-5xl md:text-8xl font-black tracking-tighter">
            {content.hero.title}
          </motion.h1>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
              {content.intro.title}
            </h2>
            <p className="text-gray-400 font-medium text-lg max-w-xs">
              {content.intro.description}
            </p>
          </div>

          {/* FILTRES GÉNÉRÉS DYNAMIQUEMENT */}
          <div className="flex flex-wrap gap-4 mb-16">
            {categories.map((cat: any) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-all ${filter === cat ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GRILLE DE PROJETS DYNAMIQUE */}
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects?.map((project: any) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative aspect-square overflow-hidden rounded-sm cursor-pointer"
                >
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-10">
                    <span className="text-primary text-xs font-bold tracking-widest uppercase mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-white text-2xl font-black tracking-tighter">
                      {project.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ARTICLES DYNAMIQUES */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-32">
          {content.articles.map((article: any, i: number) => (
            <div key={i} className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                className={`space-y-6 ${i % 2 !== 0 ? "md:order-2" : ""}`}
              >
                <span className="text-primary font-bold tracking-widest uppercase text-sm">
                  {article.badge}
                </span>
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter">
                  {article.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {article.text}
                </p>
              </motion.div>
              <div
                className={`relative aspect-video md:aspect-square overflow-hidden rounded-sm shadow-2xl ${i % 2 !== 0 ? "md:order-1" : ""}`}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
