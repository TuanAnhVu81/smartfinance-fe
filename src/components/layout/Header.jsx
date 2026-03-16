import { useAuthStore } from '../../store/authStore';
import { Menu } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    // 1. Clear all React Query cache to prevent data leakage between users
    queryClient.clear();
    // 2. Clear auth store (tokens, user info)
    logout();
  };

  return (
    <header className="bg-white shadow-sm z-10 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="md:hidden mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Smart Finance
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium text-gray-900">
              {user?.fullName || 'User'}
            </span>
            <span className="text-xs text-gray-500">
              {user?.username || 'Guest'}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
