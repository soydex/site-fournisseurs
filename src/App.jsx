import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FormulaireFournisseur from "./components/FormulaireFournisseur";
import TableauPage from "./pages/TableauPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import axios from "axios";
import DernieresRequetes from "./components/DernieresRequetes";

// Composant de protection des routes admin
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/admin" />;
};

function App() {
  const [dernieresRequetes, setDernieresRequetes] = useState([]);

  useEffect(() => {
    chargerDernieresRequetes();
  });

  const nettoyerLocalStorage = () => {
    const maintenant = new Date().getTime();
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("besoin_")) {
        const timestamp = localStorage.getItem(key).split("|")[1];
        if (maintenant - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
          localStorage.removeItem(key);
        }
      }
    });
  };

  const ajouterBesoin = async (formData) => {
    try {
      const response = await axios.post("/api/besoins", formData);
      const besoinId = response.data._id;
      const timestamp = new Date().getTime();
      localStorage.setItem(`besoin_${besoinId}`, `${besoinId}|${timestamp}`);
      alert("Besoin ajouté avec succès!");
      chargerDernieresRequetes();
    } catch (error) {
      console.error("Erreur lors de l'ajout des données:", error);
    }
  };

  const chargerDernieresRequetes = async () => {
    try {
      nettoyerLocalStorage();
      const mesBesoinsIds = Object.keys(localStorage)
        .filter((key) => key.startsWith("besoin_"))
        .map((key) => localStorage.getItem(key).split("|")[0]);

      const response = await axios.get("/api/besoins");
      const toutesLesRequetes = response.data;
      const mesRequetes = toutesLesRequetes.filter((req) =>
        mesBesoinsIds.includes(req._id)
      );
      setDernieresRequetes(mesRequetes);
    } catch (error) {
      console.error("Erreur lors du chargement des dernières requêtes:", error);
    }
  };

  const supprimerRequete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      try {
        await axios.delete(`/api/besoins/${id}`);
        localStorage.removeItem(`besoin_${id}`);
        setDernieresRequetes((prev) => prev.filter((req) => req._id !== id));
        alert("Demande supprimée avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="container mx-auto px-4 py-8">
              <div className="text-center mb-8">
                <img
                  src="/imgs/logo_comymedia.png"
                  alt="Logo"
                  className="mx-auto mb-4"
                />
              </div>
              <h1 className="text-3xl font-bold text-center mb-8">
                Gestion des besoins d'affichage
              </h1>
              <div className="max-w-2xl mx-auto">
                <FormulaireFournisseur onSubmit={ajouterBesoin} />
                <DernieresRequetes
                  requetes={dernieresRequetes}
                  onSupprimer={supprimerRequete}
                />
              </div>
            </div>
          }
        />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route
          path="/admin/tableau"
          element={
            <ProtectedRoute>
              <TableauPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
