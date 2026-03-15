import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, User, Shield, Camera } from 'lucide-react';
import { useProfile, useUpdateProfile, useChangePassword } from '../../hooks/useUser';
import { useAuthStore } from '../../store/authStore';

// --- Schemas ---
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(50, "Full name is too long"),
  avatarUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

const securitySchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

// --- Components ---

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('general');

  // Fetch current user data
  const { data: profileResponse, isLoading: isProfileLoading } = useProfile();
  const userData = profileResponse?.data;

  return (
    <div className="max-w-4xl mx-auto pb-10 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left ${
                activeTab === 'general' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <User className="w-5 h-5" />
              General Info
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left ${
                activeTab === 'security' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Shield className="w-5 h-5" />
              Security
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 md:p-10">
            {isProfileLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                  <div className="space-y-3 w-1/2">
                    <div className="h-5 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'general' && <GeneralTab userData={userData} />}
                {activeTab === 'security' && <SecurityTab />}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// --- General Tab Component ---
const GeneralTab = ({ userData }) => {
  const updateMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      avatarUrl: '',
    },
  });

  // Watch avatarUrl for immediate preview
  const avatarUrlValue = watch('avatarUrl');

  // Load user data into form
  useEffect(() => {
    if (userData) {
      reset({
        fullName: userData.fullName || '',
        avatarUrl: userData.avatarUrl || '',
      });
    }
  }, [userData, reset]);

  const onSubmit = (data) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        // Reset form keeping new values to clear isDirty state
        reset(data, { keepValues: true });
      }
    });
  };

  // Determine what image to show: The watched input URL (if any), fallback to userData, or empty
  const displayAvatar = avatarUrlValue || userData?.avatarUrl;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <h2 className="text-xl font-bold text-gray-800 mb-6">General Information</h2>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="relative group">
          {displayAvatar ? (
            <img 
              src={displayAvatar} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              onError={(e) => {
                // If the user inputs an invalid image URL, hide the broken image and show letter
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Fallback Letter Avatar */}
          <div 
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md"
            style={{ display: displayAvatar ? 'none' : 'flex' }}
          >
            {(userData?.fullName || 'User').charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold text-gray-900">{userData?.fullName || 'User'}</h3>
          <p className="text-sm text-gray-500 mt-1">Update your photo and personal details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Read-only fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={userData?.username || ''}
              disabled
              className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-lg px-4 py-2.5 outline-none cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={userData?.email || ''}
              disabled
              className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-lg px-4 py-2.5 outline-none cursor-not-allowed"
            />
          </div>
        </div>

        {/* Editable fields */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            className={`w-full border ${
              errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } text-gray-900 text-sm rounded-lg px-4 py-2.5 outline-none transition-colors`}
            {...register('fullName')}
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Avatar URL (Optional)
          </label>
          <input
            type="text"
            id="avatarUrl"
            placeholder="https://example.com/my-photo.jpg"
            className={`w-full border ${
              errors.avatarUrl ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } text-gray-900 text-sm rounded-lg px-4 py-2.5 outline-none transition-colors`}
            {...register('avatarUrl')}
          />
          {errors.avatarUrl && <p className="mt-1 text-sm text-red-600">{errors.avatarUrl.message}</p>}
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={!isDirty || updateMutation.isPending}
            className="inline-flex justify-center items-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Security Tab Component ---
const SecurityTab = () => {
  const changePasswordMutation = useChangePassword();
  const logout = useAuthStore(state => state.logout);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data) => {
    changePasswordMutation.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      },
      {
        onSuccess: () => {
          reset(); // Clear form after success
          // Logout the user and force them to login with new password
          setTimeout(() => {
            logout();
          }, 2000); // Wait 2s so they can read the success toast
        }
      }
    );
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Security</h2>
      <p className="text-sm text-gray-500 mb-8">Ensure your account is using a long, random password to stay secure.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              className={`w-full border ${
                errors.currentPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } text-gray-900 text-sm rounded-lg pl-4 pr-12 py-2.5 outline-none transition-colors`}
              {...register('currentPassword')}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              className={`w-full border ${
                errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } text-gray-900 text-sm rounded-lg pl-4 pr-12 py-2.5 outline-none transition-colors`}
              {...register('newPassword')}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              className={`w-full border ${
                errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } text-gray-900 text-sm rounded-lg pl-4 pr-12 py-2.5 outline-none transition-colors`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="w-full inline-flex justify-center items-center px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
          >
            {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
