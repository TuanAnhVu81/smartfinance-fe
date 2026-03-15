import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCategories } from '../../hooks/useCategories';

// Form validation schema
const transactionSchema = z.object({
  amount: z.number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  categoryId: z.number({ invalid_type_error: "Please select a category" })
    .min(1, "Please select a category"),
  transactionDate: z.string().min(1, "Date is required").refine((date) => {
    return new Date(date) <= new Date();
  }, { message: "Date cannot be in the future" }),
  note: z.string().max(255, "Note must not exceed 255 characters").optional().nullable(),
});

/**
 * Transaction Form component (can be rendered inside a Modal)
 * @param {Object} props
 * @param {Object} props.initialData - Data for edit mode (null for creation)
 * @param {Function} props.onSubmit - Callback on successful submission
 * @param {Function} props.onCancel - Callback to close/cancel form
 * @param {boolean} props.isSubmitting - Loading state of mutation
 */
const TransactionForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const { data: categoryResponse, isLoading: isCategoriesLoading } = useCategories();
  const categories = categoryResponse?.data || [];

  // Group categories for better dropdown UI
  const incomeCategories = categories.filter(c => c.type === 'INCOME');
  const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

  // Format date to YYYY-MM-DD for native date input
  const getTodayFormatted = () => new Date().toISOString().split('T')[0];
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return getTodayFormatted();
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (e) {
      return getTodayFormatted();
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: '',
      categoryId: '',
      transactionDate: getTodayFormatted(),
      note: '',
    },
  });

  // Reset form when initialData changes (e.g., when opening edit modal)
  useEffect(() => {
    if (initialData) {
      reset({
        amount: Math.abs(initialData.amount), // Always display positive amount in form
        categoryId: initialData.categoryId || initialData.category?.id,
        transactionDate: formatDateForInput(initialData.transactionDate),
        note: initialData.note || '',
      });
    } else {
      reset({
        amount: '',
        categoryId: '',
        transactionDate: getTodayFormatted(),
        note: '',
      });
    }
  }, [initialData, reset]);

  // Handle form submission and cast types
  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      amount: parseFloat(data.amount),
      categoryId: parseInt(data.categoryId, 10),
    }, setError); // Pass setError to parent so it can map API errors
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {errors.root && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4 border border-red-100">
          {errors.root.message}
        </div>
      )}
      
      {/* Amount Field */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            className={`block w-full rounded-lg border ${
              errors.amount ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            } pl-4 pr-12 py-2.5 outline-none sm:text-sm`}
            placeholder="0.00"
            {...register('amount', { valueAsNumber: true })}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">VND</span>
          </div>
        </div>
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
      </div>

      {/* Category Field */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="categoryId"
          disabled={isCategoriesLoading}
          className={`block w-full rounded-lg border ${
            errors.categoryId ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } p-2.5 outline-none sm:text-sm bg-white`}
          {...register('categoryId', { valueAsNumber: true })}
        >
          <option value="" disabled>Select a category</option>
          
          <optgroup label="Expense (Chi tiêu)">
            {expenseCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon || '🔴'} {cat.name}</option>
            ))}
          </optgroup>
          
          <optgroup label="Income (Thu nhập)">
            {incomeCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon || '🟢'} {cat.name}</option>
            ))}
          </optgroup>
        </select>
        {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
      </div>

      {/* Date Field */}
      <div>
        <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700 mb-1">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="transactionDate"
          className={`block w-full rounded-lg border ${
            errors.transactionDate ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } p-2.5 outline-none sm:text-sm`}
          {...register('transactionDate')}
        />
        {errors.transactionDate && <p className="mt-1 text-sm text-red-600">{errors.transactionDate.message}</p>}
      </div>

      {/* Note Field */}
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
          Note (Optional)
        </label>
        <textarea
          id="note"
          rows={3}
          className={`block w-full rounded-lg border ${
            errors.note ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } p-2.5 outline-none sm:text-sm`}
          placeholder="Add details about this transaction..."
          {...register('note')}
        />
        {errors.note && <p className="mt-1 text-sm text-red-600">{errors.note.message}</p>}
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
            initialData ? 'Save Changes' : 'Add Transaction'
          )}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
