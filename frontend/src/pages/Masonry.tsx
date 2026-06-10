import { motion } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export const Masonry = () => {
  const { data: page, isLoading } = useQuery({
    queryKey: ["page", "masonry"],
    queryFn: async () => {
      const { data } = await api.get("/v1/pages/masonry");
      return data;
    },
  });

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  if (!page) return null;

  const { hero, intro, articles } = page.content;

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <img
          src={hero.image}
          alt="Maçonnerie"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 text-center text-white px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold tracking-widest uppercase text-primary mb-4 block"
          >
            {hero.subtitle}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter"
          >
            {hero.title}
          </motion.h1>
        </div>
      </section>

      {/* INTRO & LISTE SERVICES */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
              {intro.title}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed font-medium">
              {intro.text}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {intro.services.map((service: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 text-gray-700 font-semibold"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <img
              src={intro.images[0]}
              alt="Work 1"
              className="rounded-sm shadow-xl aspect-[3/4] object-cover"
            />
            <img
              src={intro.images[1]}
              alt="Work 2"
              className="rounded-sm shadow-xl aspect-[3/4] object-cover mt-12"
            />
          </div>
        </div>
      </section>

      {/* ARTICLES TECHNIQUES */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              Expertise & Savoir-faire
            </h2>
          </div>

          {articles.map((article: any, index: number) => (
            <div
              key={index}
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className={`space-y-6 ${index % 2 !== 0 ? "md:order-2" : ""}`}
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
                className={`relative aspect-video md:aspect-square overflow-hidden rounded-sm shadow-2xl ${index % 2 !== 0 ? "md:order-1" : ""}`}
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
