import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
//import { useState } from 'react';
import FormulaireFournisseur from './components/FormulaireFournisseur';
import TableauPage from './pages/TableauPage';
import AdminLoginPage from './pages/AdminLoginPage';
import axios from 'axios';

// Composant de protection des routes admin
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/admin" />;
};

function App() {
  const ajouterBesoin = async (formData) => {
    try {
      await axios.post('/api/besoins', formData);
      alert('Besoin ajouté avec succès!');
    } catch (error) {
      console.error("Erreur lors de l'ajout des données:", error);
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
                <img src="/imgs/logo_comymedia.png" alt="Logo" className="mx-auto mb-4" />
              </div>
              <h1 className="text-3xl font-bold text-center mb-8">
                Gestion des besoins d'affichage
              </h1>
              <div className="max-w-2xl mx-auto">
                <FormulaireFournisseur onSubmit={ajouterBesoin} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
