import { motion } from "motion/react";
import { ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

// --- Sous-composant Hero ---
const Hero = ({ data }: { data: any }) => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img src={data.image} alt="Hero" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />
    </div>
    <div className="relative z-10 text-center text-white px-6 max-w-5xl">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-bold tracking-[0.4em] uppercase mb-8 block opacity-80"
      >
        {data.subtitle}
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-6xl md:text-[100px] font-black tracking-tighter leading-[0.85] mb-10"
      >
        {data.title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xl md:text-2xl font-light max-w-3xl mx-auto opacity-90 leading-relaxed"
      >
        {data.description}
      </motion.p>
    </div>
  </section>
);

// --- Sous-composant About ---
const About = ({ data }: { data: any }) => (
  <section className="py-32 px-6 bg-white overflow-visible">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
      <div className="relative">
        <img
          src={data.image}
          alt="About"
          className="rounded-sm shadow-2xl w-full aspect-[4/5] object-cover"
        />
        <div className="absolute -bottom-10 -right-10 bg-primary text-white p-12 rounded-sm shadow-2xl hidden lg:block min-w-[280px]">
          <div className="text-6xl font-black mb-2">
            {data.experience_years}
          </div>
          <div className="text-sm font-bold tracking-widest uppercase opacity-90">
            {data.experience_label}
          </div>
        </div>
      </div>
      <div className="space-y-10">
        <div>
          <span className="text-sm font-bold tracking-widest text-primary uppercase mb-6 block">
            {data.subtitle}
          </span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.1]">
            {data.title}
          </h2>
        </div>
        <div className="space-y-8 text-gray-500 text-lg leading-relaxed font-medium">
          {data.paragraphs.map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center text-primary font-bold text-lg group"
        >
          Découvrir notre histoire{" "}
          <ChevronRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </div>
  </section>
);

// --- Sous-composant Expertise ---
const Expertise = ({ data }: { data: any }) => (
  <section className="pt-32 pb-0 bg-gray-50">
    <div className="max-w-7xl mx-auto px-6 text-center mb-24">
      <span className="text-sm font-bold tracking-widest text-primary uppercase mb-6 block">
        {data.subtitle}
      </span>
      <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
        {data.title}
      </h2>
    </div>
    <div className="space-y-0">
      {data.services.map((service: any, i: number) => {
        // Style spécial pour le service du milieu (Rénovation)
        if (service.id === "02") {
          return (
            <div
              key={i}
              className="relative py-48 md:py-64 flex items-center justify-center text-white text-center"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/65" />
              </div>
              <div className="relative z-10 max-w-4xl px-6 space-y-10">
                <span className="text-sm font-bold tracking-widest uppercase opacity-70">
                  Expertise {service.title}
                </span>
                <h3 className="text-5xl md:text-8xl font-black tracking-tighter">
                  {service.title}
                </h3>
                <p className="text-xl md:text-2xl opacity-80 leading-relaxed font-light">
                  {service.description}
                </p>
                <Link
                  to={service.link}
                  className="inline-flex items-center text-white font-bold text-sm tracking-widest uppercase border-b-2 border-white pb-2 group"
                >
                  En savoir plus{" "}
                  <ChevronRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          );
        }

        // Style standard pour 01 et 03
        return (
          <div key={i} className="grid md:grid-cols-2 items-stretch bg-white">
            <div
              className={`relative h-[400px] md:h-auto overflow-hidden ${service.id === "03" ? "md:order-1" : ""}`}
            >
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>
            <div
              className={`flex flex-col justify-center p-12 md:p-24 lg:p-32 space-y-8 ${service.id === "03" ? "md:order-2" : ""}`}
            >
              <div className="text-8xl font-black text-primary/5 leading-none">
                {service.id}
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter">
                {service.title}
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
                {service.description}
              </p>
              <Link
                to={service.link}
                className="inline-flex items-center text-primary font-bold text-sm tracking-widest uppercase group"
              >
                En savoir plus{" "}
                <ChevronRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export const Home = () => {
  const { data: page, isLoading } = useQuery({
    queryKey: ["page", "home"],
    queryFn: async () => {
      const { data } = await api.get("/v1/pages/home");
      return data;
    },
  });

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  if (!page) return null;

  return (
    <>
      <Hero data={page.content.hero} />
      <About data={page.content.about} />
      <Expertise data={page.content.expertise} />
    </>
  );
};
