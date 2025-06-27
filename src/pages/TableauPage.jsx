import { useState, useEffect, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import * as XLSX from "xlsx";
import TableauBesoins from "../components/TableauBesoins";
import axios from "axios";

function TableauPage() {
  const [besoins, setBesoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBesoins = useCallback(async () => {
    try {
      setLoading(true);
      const cachedData = sessionStorage.getItem("besoinsCache");
      const cacheTimestamp = sessionStorage.getItem("besoinsCacheTimestamp");

      if (cachedData && cacheTimestamp && Date.now() - cacheTimestamp < 60000) {
        setBesoins(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      const response = await axios.get("https://api.comymedia.fr/api/besoins");
      setBesoins(response.data);
      sessionStorage.setItem("besoinsCache", JSON.stringify(response.data));
      sessionStorage.setItem("besoinsCacheTimestamp", Date.now().toString());
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchBesoins, 30000);
    fetchBesoins();
    return () => clearInterval(interval);
  }, [fetchBesoins]);

  // Fonction de recherche optimisée avec debounce
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  // Filtrage optimisé avec useMemo
  const filteredBesoins = useMemo(() => {
    if (!searchQuery) return besoins;

    const searchLower = searchQuery.toLowerCase();
    return besoins.filter((besoin) =>
      Object.values(besoin).some((value) =>
        String(value).toLowerCase().includes(searchLower)
      )
    );
  }, [besoins, searchQuery]);

  const supprimerBesoin = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) {
      try {
        await axios.delete(`https://api.comymedia.fr/api/besoins/${id}`);
        // Mettre à jour l'état local après la suppression
        setBesoins(besoins.filter((besoin) => besoin._id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const viderBaseDeDonnees = async () => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer toutes les données ?")
    ) {
      try {
        await axios.delete("https://api.comymedia.fr/api/besoins");
        setBesoins([]);
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de toutes les données:",
          error
        );
      }
    }
  };

  const exportToExcel = () => {
    const dataToExport = filteredBesoins.map((item) => ({
      "Date/Heure": new Date(item.dateCreation).toLocaleString("fr-FR"),
      Annonceur: item.nomAnnonceur,
      Prestataire: item.nomPrestataire,
      Format: item.format,
      "Format spécifique": item.formatSpecifique,
      "Format visible": item.formatVisible,
      "Nombre d'affiches": item.nombreAffiches,
      "Adresse de livraison": item.adresseLivraison,
      Commentaires: item.commentaires,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Besoins");
    XLSX.writeFile(
      wb,
      `besoins_${new Date().toLocaleDateString("fr-FR")}.xlsx`
    );
  };

  // Composant SearchBar optimisé
  const SearchBar = () => (
    <div className="mb-6">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-3 h-5 w-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              const inputElement = document.querySelector('input[type="text"]');
              if (inputElement) inputElement.value = "";
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Réinitialiser
          </button>
        )}
      </div>
      {searchQuery && (
        <div className="mt-2 text-sm text-gray-600">
          {filteredBesoins.length} résultat(s) trouvé(s)
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Tableau des besoins</h2>
      {loading ? (
        <p className="text-center">Chargement des données...</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <SearchBar />
            <div className="space-x-4">
              <button
                onClick={exportToExcel}
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Exporter vers Excel
              </button>
              <button
                onClick={viderBaseDeDonnees}
                className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Vider la base de données
              </button>
            </div>
          </div>
          <TableauBesoins data={filteredBesoins} onDelete={supprimerBesoin} />
        </>
      )}
    </div>
  );
}

export default TableauPage;
