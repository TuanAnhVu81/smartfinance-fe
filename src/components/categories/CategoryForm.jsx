import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Preset colors for quick selection
const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
  '#ec4899', '#f43f5e', '#64748b', '#78716c'
];

// Form validation schema
const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be under 50 characters"),
  type: z.enum(['INCOME', 'EXPENSE'], { required_error: "Type is required" }),
  icon: z.string().max(10, "Icon is too long").optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/i, "Must be a valid HEX color (e.g., #FF0000)").optional().nullable(),
});

/**
 * Category Form component for Creating and Editing Categories
 * @param {Object} props
 * @param {Object} props.initialData - Data for edit mode (null for creation)
 * @param {Function} props.onSubmit - Callback on submit
 * @param {Function} props.onCancel - Callback to cancel/close
 * @param {boolean} props.isSubmitting - Loading state
 */
const CategoryForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'EXPENSE',
      icon: '📦',
      color: PRESET_COLORS[0],
    },
  });

  const watchColor = watch('color');

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        type: initialData.type || 'EXPENSE',
        icon: initialData.icon || '',
        color: initialData.color || PRESET_COLORS[0],
      });
    } else {
      reset({
        name: '',
        type: 'EXPENSE',
        icon: '📦',
        color: PRESET_COLORS[0],
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data, setError);
  };

  const isEditMode = !!initialData;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {errors.root && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4 border border-red-100">
          {errors.root.message}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          placeholder="e.g., Groceries, Salary..."
          className={`block w-full rounded-lg border ${
            errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          } px-4 py-2.5 outline-none sm:text-sm transition-colors`}
          {...register('name')}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Type Field */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Type <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 py-2.5 px-4 rounded-lg flex-1">
            <input 
              type="radio" 
              value="EXPENSE" 
              className="text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
              {...register('type')}
            />
            <span className="text-sm font-medium text-gray-700">Expense</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 py-2.5 px-4 rounded-lg flex-1">
            <input 
              type="radio" 
              value="INCOME" 
              className="text-green-600 focus:ring-green-500 w-4 h-4 cursor-pointer"
              {...register('type')}
            />
            <span className="text-sm font-medium text-gray-700">Income</span>
          </label>
        </div>
        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Icon Field */}
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
            Icon (Emoji)
          </label>
          <input
            type="text"
            id="icon"
            placeholder="🍔"
            className={`block w-full rounded-lg border ${
              errors.icon ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } px-4 py-2.5 outline-none sm:text-sm text-center text-xl transition-colors`}
            {...register('icon')}
          />
          {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>}
        </div>

        {/* Color Field */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
            Color Hex
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              id="colorPicker"
              className="h-10 w-12 rounded border border-gray-300 cursor-pointer p-0.5"
              {...register('color')}
            />
            <input
              type="text"
              id="colorText"
              className={`block w-full rounded-lg border ${
                errors.color ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } px-3 py-2.5 outline-none sm:text-sm transition-colors uppercase`}
              {...register('color')}
            />
          </div>
          {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>}
        </div>
      </div>

      {/* Color Presets */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">
          Preset Colors
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setValue('color', c)}
              className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                watchColor === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            isEditMode ? 'Save Changes' : 'Create Category'
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
