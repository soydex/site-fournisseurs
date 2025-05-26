function DernieresRequetes({ requetes, onSupprimer }) {
  if (!requetes.length) return null;

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Vos dernières demandes</h3>
      <div className="space-y-4">
        {requetes.map(requete => (
          <div key={requete._id} className="p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{requete.nomPrestataire}</p>
                <p className="text-sm text-gray-600">Format: {requete.format}</p>
                <p className="text-sm text-gray-600">Nombre d'affiches: {requete.nombreAffiches}</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(requete.dateCreation).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <button
                onClick={() => onSupprimer(requete._id)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DernieresRequetes;
