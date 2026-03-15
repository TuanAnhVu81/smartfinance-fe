import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../constants/routes';

/**
 * Professional 404 Not Found Page
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        {/* Decorative elements */}
        <div className="absolute -inset-10 bg-blue-100/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-blue-600 mb-6 rotate-12 hover:rotate-0 transition-transform duration-500">
            <AlertCircle size={48} />
          </div>
          <h1 className="text-9xl font-black text-gray-900 tracking-tighter">404</h1>
        </div>
      </div>

      <div className="max-w-md space-y-4 relative">
        <h2 className="text-2xl font-bold text-gray-900">Oops! Page Not Found</h2>
        <p className="text-gray-500 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 relative">
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 gap-2 group"
        >
          <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all gap-2 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Go Back
        </button>
      </div>

      {/* Footer decoration */}
      <div className="absolute bottom-10 text-gray-400 text-sm font-medium">
        Smart Finance System &bull; Intelligent Money Management
      </div>
    </div>
  );
};

export default NotFoundPage;
