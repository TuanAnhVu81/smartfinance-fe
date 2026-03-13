import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';

// Layouts
import AuthLayout from './components/layout/AuthLayout';
import MainLayout from './components/layout/MainLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Simple placeholder for pages to be implemented
const RegisterPage = () => <div className="text-text-primary">Sign Up</div>;
const TransactionsPage = () => <div className="text-text-primary font-bold text-2xl">Transactions</div>;
const BudgetsPage = () => <div className="text-text-primary font-bold text-2xl">Budgets</div>;
const AiInsightPage = () => <div className="text-text-primary font-bold text-2xl">AI Insights</div>;
const CategoriesPage = () => <div className="text-text-primary font-bold text-2xl">Categories</div>;
const ProfilePage = () => <div className="text-text-primary font-bold text-2xl">Profile</div>;
const AdminPage = () => <div className="text-text-primary font-bold text-2xl">Admin</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (Auth) */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        {/* Protected routes (Main App) */}
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
          <Route path={ROUTES.BUDGETS} element={<BudgetsPage />} />
          <Route path={ROUTES.AI_INSIGHT} element={<AiInsightPage />} />
          <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.ADMIN} element={<AdminPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
