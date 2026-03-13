import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCategories } from '../../hooks/useCategories';
import MonthYearPicker from '../common/MonthYearPicker';

// Form validation schema
const budgetSchema = z.object({
  amountLimit: z.number({ invalid_type_error: "Limit must be a number" })
    .positive("Limit must be greater than 0"),
  categoryId: z.number({ invalid_type_error: "Please select a category" })
    .min(1, "Please select a category"),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
});

/**
 * Form for creating or editing a budget
 * @param {Object} props
 * @param {Object} props.initialData - Data for edit mode, null if creating
 * @param {Function} props.onSubmit - Callback on submit
 * @param {Function} props.onCancel - Callback to close modal
 * @param {boolean} props.isSubmitting - Loading state
 * @param {number} props.currentMonth - Passed from page state for defaults
 * @param {number} props.currentYear - Passed from page state for defaults
 */
const BudgetForm = ({ initialData, onSubmit, onCancel, isSubmitting, currentMonth, currentYear }) => {
  const { data: categoryResponse, isLoading: isCategoriesLoading } = useCategories();
  
  // Budgets only apply to EXPENSE categories
  const categories = (categoryResponse?.data || []).filter(c => c.type === 'EXPENSE');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      amountLimit: '',
      categoryId: '',
      month: currentMonth,
      year: currentYear,
    },
  });

  const watchMonth = watch('month');
  const watchYear = watch('year');

  useEffect(() => {
    if (initialData) {
      reset({
        amountLimit: initialData.amountLimit,
        categoryId: initialData.category?.id || initialData.categoryId,
        month: initialData.month,
        year: initialData.year,
      });
    } else {
      reset({
        amountLimit: '',
        categoryId: '',
        month: currentMonth,
        year: currentYear,
      });
    }
  }, [initialData, reset, currentMonth, currentYear]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      amountLimit: parseFloat(data.amountLimit),
      categoryId: parseInt(data.categoryId, 10),
    });
  };

  const handleDateChange = ({ month, year }) => {
    setValue('month', month);
    setValue('year', year);
  };

  const isEditMode = !!initialData;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      
      {/* Target Month/Year Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Month <span className="text-red-500">*</span>
        </label>
        {isEditMode ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
            {new Date(0, watchMonth - 1).toLocaleString('en-US', { month: 'long' })} {watchYear}
            <span className="ml-2 text-xs italic text-gray-400">(Cannot be changed in edit mode)</span>
          </div>
        ) : (
          <div className="pointer-events-auto">
            <MonthYearPicker 
              month={watchMonth} 
              year={watchYear} 
              onChange={handleDateChange} 
            />
          </div>
        )}
      </div>

      {/* Category Field */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
          Expense Category <span className="text-red-500">*</span>
        </label>
        <select
          id="categoryId"
          disabled={isCategoriesLoading || isEditMode}
          className={`block w-full rounded-lg border ${
            errors.categoryId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          } p-2.5 outline-none sm:text-sm bg-white disabled:bg-gray-50 disabled:text-gray-500`}
          {...register('categoryId', { valueAsNumber: true })}
        >
          <option value="" disabled>Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.icon || '🔴'} {cat.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
        {isEditMode && <p className="mt-1 text-xs text-gray-400 italic">Category cannot be changed.</p>}
      </div>

      {/* Limit Amount Field */}
      <div>
        <label htmlFor="amountLimit" className="block text-sm font-medium text-gray-700 mb-1">
          Amount Limit <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            id="amountLimit"
            step="0.01"
            min="0"
            className={`block w-full rounded-lg border ${
              errors.amountLimit ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } pl-4 pr-12 py-2.5 outline-none sm:text-sm`}
            placeholder="0.00"
            {...register('amountLimit', { valueAsNumber: true })}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">VND</span>
          </div>
        </div>
        {errors.amountLimit && <p className="mt-1 text-sm text-red-600">{errors.amountLimit.message}</p>}
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
            isEditMode ? 'Save Changes' : 'Create Budget'
          )}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;
