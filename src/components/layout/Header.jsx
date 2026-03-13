import { useAuthStore } from '../../store/authStore';

const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-surface-card shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-text-primary">
          Smart Finance
        </h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-text-primary">
              {user?.fullName || 'User'}
            </span>
            <span className="text-xs text-text-secondary">
              {user?.username || 'Guest'}
            </span>
          </div>
          
          <button
            onClick={logout}
            className="inline-flex items-center px-3 py-1.5 border border-surface-border text-xs font-medium rounded-button text-text-primary bg-surface hover:bg-slate-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
