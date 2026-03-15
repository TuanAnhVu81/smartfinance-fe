import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuthStore } from '../../store/authStore';
import { User, Shield, LayoutDashboard, Receipt, Target, Sparkles, FolderTree, X } from 'lucide-react';
import { useEffect } from 'react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const personalNavigation = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: <LayoutDashboard size={18} /> },
    { name: 'Transactions', href: ROUTES.TRANSACTIONS, icon: <Receipt size={18} /> },
    { name: 'Budgets', href: ROUTES.BUDGETS, icon: <Target size={18} /> },
    { name: 'AI Insights', href: ROUTES.AI_INSIGHT, icon: <Sparkles size={18} /> },
    { name: 'Categories', href: ROUTES.CATEGORIES, icon: <FolderTree size={18} /> },
    { name: 'Profile', href: ROUTES.PROFILE, icon: <User size={18} /> },
  ];

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isActive = (path) => location.pathname === path;

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  const SidebarContent = (
    <div className="flex flex-col w-64 bg-slate-900 h-full text-white">
      <div className="flex items-center justify-between h-16 flex-shrink-0 px-6 bg-slate-950">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
            <Sparkles className="text-white" size={18} />
          </div>
          <span className="text-white text-lg font-bold tracking-tight">SmartFinance</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto px-3 py-4 space-y-7">
        {/* Main Navigation Section */}
        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
            Personal
          </h3>
          {personalNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                isActive(item.href)
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              } group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200`}
            >
              <span className={`mr-3 ${isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} transition-colors`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Admin Section - Only for Admins */}
        {isAdmin && (
          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-amber-500/80 uppercase tracking-[0.2em] mb-3">
              System
            </h3>
            <Link
              to={ROUTES.ADMIN}
              className={`${
                isActive(ROUTES.ADMIN)
                  ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20 font-bold'
                  : 'text-amber-500/60 hover:bg-amber-500/10 hover:text-amber-400'
              } group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200`}
            >
              <span className={`mr-3 ${isActive(ROUTES.ADMIN) ? 'text-slate-900' : 'text-amber-500/50 group-hover:text-amber-400'} transition-colors`}>
                <Shield size={18} />
              </span>
              Admin Control
            </Link>
          </div>
        )}
      </div>

      {/* User context footer */}
      <div className="p-4 bg-slate-950/50 border-t border-white/5">
        <div className="flex items-center gap-3 px-2">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-700" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white uppercase border border-slate-600">
              {user?.username?.charAt(0) || 'U'}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate">{user?.username}</span>
            <span className="text-[10px] text-slate-400 truncate capitalize">{user?.roles?.[0]?.replace('ROLE_', '').toLowerCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar for Mobile (Drawer) */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        {SidebarContent}
      </div>

      {/* Sidebar for Desktop (Static) */}
      <div className="hidden md:flex md:flex-shrink-0 z-10">
        {SidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
