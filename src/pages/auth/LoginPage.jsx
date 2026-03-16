import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Info, Shield, User as UserIcon } from 'lucide-react';

// Define validation schema using Zod
const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useLoginMutation();

  const handleQuickLogin = (username, password) => {
    setValue('username', username);
    setValue('password', password);
  };

  const onSubmit = (data) => {
    mutate(data, {
      onError: (error) => {
        // Extract error message from API response and set as root error
        const message = error.response?.data?.message || 'Login failed';
        setError('root', { message });
      },
    });
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-500 mt-2 text-base">Please enter your details to sign in</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors ${
              errors.username ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Enter your username"
            {...register('username')}
          />
          {errors.username && (
            <p className="mt-1.5 text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors ${
              errors.password ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="••••••••"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            'Login'
          )}
        </button>

        {errors.root && (
          <div className="mt-3 p-3 bg-red-50 text-center text-sm text-red-600 rounded-lg border border-red-100">
            {errors.root.message}
          </div>
        )}

        <div className="pt-4 text-center text-sm text-gray-600 border-t border-gray-100">
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Register now
          </Link>
        </div>

        {/* Demo Credentials Box */}
        <div className="mt-8 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
          <div className="flex items-center gap-2 mb-3 text-indigo-700">
            <Info size={16} className="text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Demo Credentials</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', '123456A')}
              className="flex flex-col items-start p-2.5 bg-white hover:bg-indigo-100/50 border border-indigo-100 rounded-lg transition-all group text-left"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-0.5">
                <Shield size={12} className="text-indigo-500" />
                <span>Admin Account</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">admin / 123456A</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('anhvt', '12345678')}
              className="flex flex-col items-start p-2.5 bg-white hover:bg-indigo-100/50 border border-indigo-100 rounded-lg transition-all group text-left"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-0.5">
                <UserIcon size={12} className="text-indigo-500" />
                <span>User Account</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">anhvt / 12345678</span>
            </button>
          </div>
          <p className="mt-2.5 text-[10px] text-indigo-400 text-center italic">
            Click an account to auto-fill
          </p>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
