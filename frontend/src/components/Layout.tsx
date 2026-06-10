import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  ShieldCheck,
  History,
  Clock,
  MessageSquare,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Menu,
  X,
  Phone,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { useBranding } from "../hooks/useBranding";

// --- Components ---

const Navbar = ({ name, settings }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Maçonnerie", href: "/maconnerie" },
    { name: "Rénovation", href: "/renovation" },
    { name: "Terrassement", href: "/terrassement" },
    { name: "Nos réalisations", href: "/realisations" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter uppercase">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={name} className="h-10 w-auto" />
          ) : (
            name || "ALPHA"
          )}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-semibold transition-colors ${
                location.pathname === link.href
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/contact"
            className="hidden sm:block bg-primary text-white px-8 py-3 rounded-sm text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            Contact
          </Link>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-lg font-bold ${
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-gray-600"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="bg-primary text-white px-8 py-4 rounded-sm font-bold text-sm tracking-widest uppercase w-full text-center"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const WhyUs = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="w-7 h-7 text-primary" />,
      title: "Qualité",
      desc: "Une sélection rigoureuse des matériaux et une exécution sans compromis.",
    },
    {
      icon: <History className="w-7 h-7 text-primary" />,
      title: "Expérience",
      desc: "Plus de 15 ans de savoir-faire technique au service de vos projets.",
    },
    {
      icon: <Clock className="w-7 h-7 text-primary" />,
      title: "Délais",
      desc: "Une gestion de projet optimisée pour respecter vos échéances.",
    },
    {
      icon: <MessageSquare className="w-7 h-7 text-primary" />,
      title: "Écoute",
      desc: "Un interlocuteur unique pour une compréhension totale de vos besoins.",
    },
  ];

  return (
    <section className="pt-24 pb-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <span className="text-sm font-bold tracking-widest text-primary uppercase mb-6 block">
              Pourquoi nous ?
            </span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
              Nos piliers d'excellence.
            </h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="bg-gray-50 p-12 rounded-sm hover:bg-gray-100 transition-all duration-300 group"
            >
              <div className="bg-white w-14 h-14 flex items-center justify-center rounded-sm shadow-sm mb-10 group-hover:scale-110 transition-all">
                {p.icon}
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-6">
                {p.title}
              </h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = ({ settings }: any) => (
  <section className="py-32 px-6 bg-[#0A0A0A] text-white text-center">
    <div className="max-w-5xl mx-auto space-y-12">
      <h2 className="text-5xl md:text-[80px] font-black tracking-tighter leading-[0.9]">
        Prêt à lancer votre projet ?
      </h2>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
        <Link
          to="/contact"
          className="bg-primary text-white px-12 py-5 rounded-sm font-bold text-sm tracking-widest uppercase hover:brightness-110 transition-all shadow-xl shadow-primary/20 w-full sm:w-auto"
        >
          Demander un devis
        </Link>
        {settings?.contact?.phone && (
          <a
            href={`tel:${settings.contact.phone}`}
            className="border border-white/20 text-white px-12 py-5 rounded-sm font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-all w-full sm:w-auto"
          >
            Nous appeler
          </a>
        )}
      </div>
    </div>
  </section>
);

const Footer = ({ name, settings }: any) => (
  <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <div className="text-2xl font-black tracking-tighter uppercase">
            {name || "ALPHA"}
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Expertise architecturale et excellence opérationnelle.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-8">
            Services
          </h4>
          <ul className="space-y-4 text-sm font-medium text-gray-600">
            <li>
              <Link to="/maconnerie" className="hover:text-primary">
                Maçonnerie
              </Link>
            </li>
            <li>
              <Link to="/renovation" className="hover:text-primary">
                Rénovation
              </Link>
            </li>
            <li>
              <Link to="/terrassement" className="hover:text-primary">
                Terrassement
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-8">
            Informations
          </h4>
          <ul className="space-y-4 text-sm font-medium text-gray-600">
            <li>
              <Link to="/mentions-legales" className="hover:text-primary">
                Mentions Légales
              </Link>
            </li>
            <li>
              <Link to="/confidentialite" className="hover:text-primary">
                Confidentialité
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-8">
            Contact
          </h4>
          <ul className="space-y-4 text-sm font-medium text-gray-600">
            {settings?.contact?.address && (
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-primary" />{" "}
                {settings.contact.address}
              </li>
            )}
            {settings?.contact?.email && (
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-primary" />{" "}
                {settings.contact.email}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs font-bold tracking-widest uppercase text-gray-400">
          © 2024 {name || "ALPHA BUSINESS"}. TOUS DROITS RÉSERVÉS.
        </p>
        <div className="flex items-center space-x-6">
          {settings?.socials?.facebook && (
            <a
              href={settings.socials.facebook}
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {settings?.socials?.instagram && (
            <a
              href={settings.socials.instagram}
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {settings?.socials?.linkedin && (
            <a
              href={settings.socials.linkedin}
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  </footer>
);

export const Layout = () => {
  const { pathname } = useLocation();
  const { data } = useSettings();
  useBranding(data?.settings, data?.name);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (data?.settings?.primary_color) {
      document.documentElement.style.setProperty(
        "--color-primary",
        data.settings.primary_color,
      );
    }
  }, [pathname, data]);

  return (
    <div className="min-h-screen">
      <Navbar name={data?.name} settings={data?.settings} />
      <main>
        <Outlet />
        <WhyUs />
        <CTA settings={data?.settings} />
      </main>
      <Footer name={data?.name} settings={data?.settings} />
    </div>
  );
};
