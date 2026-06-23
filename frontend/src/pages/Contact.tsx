import { motion } from "motion/react";
import {
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export const Contact = () => {
  const { data: page, isLoading } = useQuery({
    queryKey: ["page", "contact"],
    queryFn: async () => {
      const { data } = await api.get("/v1/pages/contact");
      return data;
    },
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Maçonnerie",
    message: "",
  });

  const submitLead = useMutation({
    mutationFn: (data: typeof form) => api.post("/v1/leads", data),
    onSuccess: () => {
      toast.success("Message envoyé !", {
        description: "Nous vous répondrons sous 48h.",
      });
      setForm({ name: "", email: "", subject: "Maçonnerie", message: "" });
    },
    onError: () => toast.error("Une erreur est survenue lors de l'envoi."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead.mutate(form);
  };
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!page) return null;

  const { hero, info_section, values_section } = page.content;

  return (
    <div className="pt-20">
      {/* HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <img
          src={hero.image}
          alt="Contact"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 text-center text-white px-6">
          <motion.span className="text-sm font-bold tracking-widest uppercase text-primary mb-4 block">
            {hero.subtitle}
          </motion.span>
          <motion.h1 className="text-5xl md:text-8xl font-black tracking-tighter">
            {hero.title}
          </motion.h1>
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
              {info_section.title}
            </h2>
            <p className="text-gray-400 font-medium text-lg max-w-xs">
              {info_section.description}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-24">
            <div className="space-y-12">
              <div className="grid sm:grid-cols-2 gap-12">
                <ContactInfo
                  icon={<MapPin />}
                  title="Adresse"
                  content={info_section.address}
                />
                <ContactInfo
                  icon={<Phone />}
                  title="Téléphone"
                  content={info_section.phone}
                />
                <ContactInfo
                  icon={<Mail />}
                  title="Email"
                  content={info_section.email}
                />
                <ContactInfo
                  icon={<Clock />}
                  title="Horaires"
                  content={info_section.hours}
                />
              </div>
              <div className="aspect-video w-full bg-gray-100 rounded-sm overflow-hidden grayscale">
                <iframe
                  src={info_section.google_maps_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* FORMULAIRE (Statique pour le moment) */}
            <div className="bg-gray-50 p-12 rounded-sm">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-gray-400">
                      Nom complet
                    </label>
                    <input
                      required
                      className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:border-primary outline-none transition-colors"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-gray-400">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:border-primary outline-none transition-colors"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-400">
                    Sujet
                  </label>
                  <select
                    className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:border-primary outline-none transition-colors"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                  >
                    <option>Maçonnerie</option>
                    <option>Rénovation</option>
                    <option>Terrassement</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-400">
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:border-primary outline-none transition-colors"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitLead.isPending}
                  className="w-full bg-primary text-white px-12 py-5 rounded-sm font-bold text-sm tracking-widest uppercase hover:brightness-110 transition-all shadow-xl shadow-primary/20 flex justify-center items-center gap-3"
                >
                  {submitLead.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Envoyer le message"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              {values_section.title}
            </h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              {values_section.description}
            </p>
          </div>

          {values_section.articles.map((article: any, i: number) => (
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
                {/* --- LE BOUTON VOIR PLUS --- */}
                {article.slug && (
                  <Link
                    to={`/article/${article.slug}`}
                    className="inline-flex items-center text-primary font-bold text-sm tracking-widest uppercase group"
                  >
                    En savoir plus
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
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

const ContactInfo = ({ icon, title, content }: any) => (
  <div className="space-y-4">
    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-sm text-primary">
      {icon}
    </div>
    <h4 className="text-xl font-black tracking-tighter">{title}</h4>
    <p
      className="text-sm text-gray-500 font-medium leading-relaxed"
      dangerouslySetInnerHTML={{ __html: content }}
    ></p>
  </div>
);
