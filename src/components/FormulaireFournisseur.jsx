import { useState } from "react";

function FormulaireFournisseur({ onSubmit }) {
  const [formData, setFormData] = useState({
    nomPrestataire: "",
    format: "",
    formatSpecifique: "",
    formatVisible: "",
    nombreAffiches: "",
    adresseLivraison: "",
    commentaires: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Réinitialiser le formulaire
    setFormData({
      nomPrestataire: "",
      format: "",
      formatSpecifique: "",
      formatVisible: "",
      nombreAffiches: "",
      adresseLivraison: "",
      commentaires: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Formulaire de besoins d'affichage
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Nom du prestataire</label>
          <input
            type="text"
            name="nomPrestataire"
            value={formData.nomPrestataire}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Format</label>
          <select
            name="format"
            value={formData.format}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Sélectionnez un format</option>
            <option value="120X176">120X176</option>
            <option value="400X300">400X300</option>
            <option value="275x68">275x68</option>
            <option value="320X240 COLLE">320X240 COLLE</option>
            <option value="99X83">99X83</option>
            <option value="240X160">240X160</option>
            <option value="320X240 DEROULANT">320X240 DEROULANT</option>
            <option value="AUTRE FORMAT">AUTRE FORMAT</option>
          </select>
        </div>

        {formData.format === "AUTRE FORMAT" && (
          <div>
            <label className="block text-gray-700 mb-2">
              Préciser le format
            </label>
            <input
              type="text"
              name="formatSpecifique"
              value={formData.formatSpecifique}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-2">
            Format "visible" pour la création visuelle
          </label>
          <input
            type="text"
            name="formatVisible"
            value={formData.formatVisible}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Nombre d'affiches nécessaires (inclure 10% d'entretien)
          </label>
          <input
            type="number"
            name="nombreAffiches"
            value={formData.nombreAffiches}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Adresse de livraison
          </label>
          <textarea
            name="adresseLivraison"
            value={formData.adresseLivraison}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows="3"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Commentaires (zippage à une autre adresse, spécificités...)
          </label>
          <textarea
            name="commentaires"
            value={formData.commentaires}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows="3"
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Soumettre
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormulaireFournisseur;
