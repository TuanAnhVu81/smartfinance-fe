import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useRegisterMutation } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

// Define validation schema using Zod
const schema = z.object({
  username: z.string().min(3, 'Minimum 3 characters').max(50),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useRegisterMutation();

  const onSubmit = (data) => {
    mutate(data, {
      onError: (error) => {
        const responseData = error.response?.data;
        
        // Handle field validation errors from backend
        if (responseData?.errors && responseData.errors.length > 0) {
          responseData.errors.forEach(item => {
            setError(item.field, { type: 'server', message: item.message });
          });
        } else {
          // Handle general errors
          const message = responseData?.message || 'Registration failed';
          setError('root', { message });
        }
      },
    });
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-500 mt-2 text-base">Sign up to get started</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            placeholder="Choose a username"
            {...register('username')}
          />
          {errors.username && (
            <p className="mt-1.5 text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="you@example.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
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
            placeholder="Create a strong password"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Repeat your password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-3 px-4 mt-6 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            'Register'
          )}
        </button>

        {errors.root && (
          <div className="mt-3 p-3 bg-red-50 text-center text-sm text-red-600 rounded-lg border border-red-100">
            {errors.root.message}
          </div>
        )}

        <div className="pt-5 mt-2 text-center text-sm text-gray-600 border-t border-gray-100">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
