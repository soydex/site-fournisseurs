import { useState, useEffect } from 'react';
import TableauBesoins from '../components/TableauBesoins';
import axios from 'axios';

function TableauPage() {
  const [besoins, setBesoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBesoins();
  }, []);

  const fetchBesoins = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/besoins');
      setBesoins(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setLoading(false);
    }
  };

  const supprimerBesoin = async (id) => {
    try {
      await axios.delete(`/api/besoins/${id}`);
      fetchBesoins();
    } catch (error) {
      console.error("Erreur lors de la suppression des données:", error);
    }
  };

  const viderBaseDeDonnees = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les données ?")) {
      try {
        await axios.delete('/api/besoins');
        setBesoins([]);
      } catch (error) {
        console.error("Erreur lors de la suppression de toutes les données:", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Tableau des besoins</h2>
      {loading ? (
        <p className="text-center">Chargement des données...</p>
      ) : (
        <>
          <div className="text-right mb-4">
            <button
              onClick={viderBaseDeDonnees}
              className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Vider la base de données
            </button>
          </div>
          <TableauBesoins data={besoins} onDelete={supprimerBesoin} />
        </>
      )}
    </div>
  );
}

export default TableauPage;
