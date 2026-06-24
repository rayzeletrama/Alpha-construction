/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Masonry } from "./pages/Masonry";
import { Renovation } from "./pages/Renovation";
import { Earthwork } from "./pages/Earthwork";
import { Projects } from "./pages/Projects";
import { Contact } from "./pages/Contact";
import { ArticleDetail } from "./pages/ArticleDetail.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminLayout } from "./components/admin/AdminLayout";
import { EditContact } from "./pages/admin/EditContact";
import { EditHome } from "./pages/admin/EditHome";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { Login } from "./pages/admin/Login";
import { EditMasonry } from "./pages/admin/EditMasonry";
import { Dashboard } from "./pages/admin/Dashboard";
import { EditRenovation } from "./pages/admin/EditRenovation";
import { EditEarthwork } from "./pages/admin/EditEarthwork";
import { EditProjects } from "./pages/admin/EditProjects.tsx";
import { Settings } from "./pages/admin/Settings.tsx";
import { EditArticle } from "./pages/admin/EditArticle.tsx";
import { ArticleList } from "./pages/admin/ArticleList.tsx";
import { Toaster } from "sonner";
import { Leads } from "./pages/admin/Leads.tsx";
import { LegalPage } from "./pages/LegalPage.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" expand={false} richColors closeButton />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="maconnerie" element={<Masonry />} />
            <Route path="renovation" element={<Renovation />} />
            <Route path="terrassement" element={<Earthwork />} />
            <Route path="realisations" element={<Projects />} />
            <Route path="contact" element={<Contact />} />
            <Route path="article/:slug" element={<ArticleDetail />} />
            <Route path="mentions-legales" element={<LegalPage />} />
            <Route path="confidentialite" element={<LegalPage />} />
          </Route>

          <Route path="/login" element={<Login />} />

          {/* Admin PROTÉGÉ */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="home" element={<EditHome />} />
              <Route path="contact" element={<EditContact />} />
              <Route path="maconnerie" element={<EditMasonry />} />
              <Route path="renovation" element={<EditRenovation />} />
              <Route path="terrassement" element={<EditEarthwork />} />
              <Route path="realisations" element={<EditProjects />} />
              <Route path="articles" element={<ArticleList />} />
              <Route path="articles/new" element={<EditArticle />} />
              <Route path="articles/edit/:slug" element={<EditArticle />} />
              <Route path="leads" element={<Leads />} />
              {/* Ajout des routes manquantes qui causaient l'erreur console */}
              <Route
                path="products"
                element={<div>Gestion des prix bientôt disponible</div>}
              />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
