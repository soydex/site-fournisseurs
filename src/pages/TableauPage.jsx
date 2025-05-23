import { useState, useEffect, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import TableauBesoins from "../components/TableauBesoins";
import axios from "axios";

function TableauPage() {
  const [besoins, setBesoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBesoins();
  }, []);

  const fetchBesoins = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/besoins");
      setBesoins(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setLoading(false);
    }
  };

  const supprimerBesoin = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) {
      try {
        await axios.delete(`/api/besoins/${id}`);
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
        await axios.delete("/api/besoins");
        setBesoins([]);
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de toutes les données:",
          error
        );
      }
    }
  };

  // Fonction de recherche optimisée avec debounce
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Composant SearchBar optimisé
  const SearchBar = () => (
    <div className="mb-6">
      <div className="relative">
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
            <button
              onClick={viderBaseDeDonnees}
              className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Vider la base de données
            </button>
          </div>
          <TableauBesoins data={filteredBesoins} onDelete={supprimerBesoin} />
        </>
      )}
    </div>
  );
}

export default TableauPage;
