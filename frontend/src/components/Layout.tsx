import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Icons from "lucide-react"; // Import massif pour les icônes dynamiques
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { useBranding } from "../hooks/useBranding";

// Helper pour afficher les icônes Lucide par leur nom
const DynamicIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className={className} />;
};

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
            className="hidden sm:block bg-primary text-white px-8 py-3 rounded-sm text-sm font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
          >
            Contact
          </Link>
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <Icons.X size={24} /> : <Icons.Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-lg font-bold ${location.pathname === link.href ? "text-primary" : "text-gray-600"}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const WhyUs = ({ items }: { items: any[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <section className="pt-24 pb-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-sm font-bold tracking-widest text-primary uppercase mb-6 block">
            Pourquoi nous ?
          </span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
            Nos piliers d'excellence.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {items.map((p, i) => (
            <div
              key={i}
              className="bg-gray-50 p-8 rounded-sm hover:bg-gray-100 transition-all group border border-transparent hover:border-primary/10"
            >
              <div className="bg-white w-12 h-12 flex items-center justify-center rounded-sm shadow-sm mb-8 group-hover:scale-110 transition-all text-primary">
                <DynamicIcon name={p.icon} />
              </div>
              <h3 className="text-xl font-black tracking-tighter mb-4 uppercase">
                {p.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Partners = ({ items }: { items: any[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-12">
          Ils nous font confiance
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {items.map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noreferrer">
              <img src={p.logo} alt={p.name} className="h-8 md:h-10 w-auto" />
            </a>
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
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Expertise architecturale et excellence opérationnelle au service du
            bâtiment.
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
            {/* LIENS VERS LES PAGES LÉGALES DYNAMIQUES */}
            <li>
              <Link to="/legal/mentions-legales" className="hover:text-primary">
                Mentions Légales
              </Link>
            </li>
            <li>
              <Link to="/legal/confidentialite" className="hover:text-primary">
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
            <li className="flex items-center">
              <Icons.MapPin className="w-4 h-4 mr-3 text-primary" />{" "}
              {settings?.contact?.address}
            </li>
            <li className="flex items-center">
              <Icons.Mail className="w-4 h-4 mr-3 text-primary" />{" "}
              {settings?.contact?.email}
            </li>
          </ul>
        </div>
      </div>
      <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs font-bold uppercase text-gray-400">
          © 2026 {name}. TOUS DROITS RÉSERVÉS.
        </p>
        <div className="flex items-center space-x-6">
          <a
            href={settings?.socials?.facebook}
            className="text-gray-400 hover:text-primary"
          >
            <Icons.Facebook size={18} />
          </a>
          <a
            href={settings?.socials?.instagram}
            className="text-gray-400 hover:text-primary"
          >
            <Icons.Instagram size={18} />
          </a>
          <a
            href={settings?.socials?.linkedin}
            className="text-gray-400 hover:text-primary"
          >
            <Icons.Linkedin size={18} />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export const Layout = () => {
  const { pathname } = useLocation();
  const { data, isLoading, isError } = useSettings();
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

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Icons.Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  // 2. Si l'API est en erreur (ex: Render dort), on affiche un message propre
  if (isError || !data) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <Icons.AlertTriangle className="text-red-500 mb-4" size={48} />
        <h1 className="text-2xl font-black uppercase tracking-tighter">
          Serveur en cours de réveil
        </h1>
        <p className="text-gray-500 mt-2">
          La connexion avec la base de données prend plus de temps que prévu.
          Veuillez patienter...
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-black text-white px-8 py-3 font-bold uppercase text-xs"
        >
          Réessayer
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <Navbar name={data?.name} settings={data?.settings} />
      <main>
        <Outlet />
        <WhyUs items={data?.settings?.why_us || []} />
        <Partners items={data?.settings?.partners || []} />
        <CTA settings={data?.settings} />
      </main>
      <Footer name={data?.name} settings={data?.settings} />
    </div>
  );
};
