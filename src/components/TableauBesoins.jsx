function TableauBesoins({ data, onDelete }) {
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <div className="overflow-x-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Liste des besoins d'affichage</h2>
      
      {data.length === 0 ? (
        <p className="text-center text-gray-500">Aucune donnée disponible</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b border-r">Date/Heure</th>
              <th className="py-2 px-4 border-b border-r">Annonceur</th>
              <th className="py-2 px-4 border-b border-r">Prestataire</th>
              <th className="py-2 px-4 border-b border-r">Format</th>
              <th className="py-2 px-4 border-b border-r">Format spécifique</th>
              <th className="py-2 px-4 border-b border-r">Format visible</th>
              <th className="py-2 px-4 border-b border-r">Nombre d'affiches</th>
              <th className="py-2 px-4 border-b border-r">Adresse de livraison</th>
              <th className="py-2 px-4 border-b border-r">Commentaires</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-r">{formatDate(item.dateCreation)}</td>
                <td className="py-2 px-4 border-b border-r">{item.nomAnnonceur}</td>
                <td className="py-2 px-4 border-b border-r">{item.nomPrestataire}</td>
                <td className="py-2 px-4 border-b border-r">{item.format}</td>
                <td className="py-2 px-4 border-b border-r">{item.formatSpecifique}</td>
                <td className="py-2 px-4 border-b border-r">{item.formatVisible}</td>
                <td className="py-2 px-4 border-b border-r">{item.nombreAffiches}</td>
                <td className="py-2 px-4 border-b border-r">{item.adresseLivraison}</td>
                <td className="py-2 px-4 border-b border-r">{item.commentaires}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => onDelete(item._id)}  // Utiliser l'ID MongoDB au lieu de l'index
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TableauBesoins;
