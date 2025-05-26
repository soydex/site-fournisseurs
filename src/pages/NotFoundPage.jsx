import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page non trouvée</h2>
        <p className="text-gray-600 mb-8">La page que vous recherchez n'existe pas.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
