import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: '📊' },
    { name: 'Transactions', href: ROUTES.TRANSACTIONS, icon: '💸' },
    { name: 'Budgets', href: ROUTES.BUDGETS, icon: '🎯' },
    { name: 'AI Insights', href: ROUTES.AI_INSIGHT, icon: '🤖' },
    { name: 'Categories', href: ROUTES.CATEGORIES, icon: '📂' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-secondary">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-secondary-light">
          <span className="text-white text-xl font-bold">Smart Finance</span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive(item.href)
                    ? 'bg-primary text-white'
                    : 'text-slate-300 hover:bg-secondary-light hover:text-white'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-button transition-colors`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
