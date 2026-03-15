import { Edit2, Trash2, ShieldCheck, FolderTree } from 'lucide-react';
import EmptyState from '../common/EmptyState';

/**
 * Renders a list of categories separated by system and custom types
 * @param {Object} props
 * @param {Array} props.categories - Array of category objects
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onEdit - Callback to edit
 * @param {Function} props.onDelete - Callback to delete
 */
const CategoryList = ({ categories, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((section) => (
          <div key={section}>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                     <div className="h-4 bg-gray-200 rounded w-20"></div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <EmptyState 
        title="No categories found"
        description="Create your first category to start organizing your transactions."
        icon={<FolderTree className="w-8 h-8" />}
      />
    );
  }

  // Split categories
  const systemCategories = categories.filter(c => c.isDefault);
  const customCategories = categories.filter(c => !c.isDefault);

  const renderCategoryCard = (category) => {
    const isIncome = category.type === 'INCOME';
    
    // Unified colors for Production-ready look
    const typeColor = isIncome ? '#10b981' : '#6366f1'; // Emerald for Income, Indigo for Expense
    const typeBg = isIncome ? '#ecfdf5' : '#eef2ff';
    const typeBorder = isIncome ? '#d1fae5' : '#e0e7ff';
    
    return (
      <div 
        key={category.id} 
        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex items-center justify-between"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 border transition-transform group-hover:scale-105"
            style={{ 
              backgroundColor: typeBg,
              borderColor: typeBorder, 
              color: typeColor
            }}
          >
            {category.icon || (isIncome ? '💰' : '💸')}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-gray-900 truncate flex items-center gap-2">
              {category.name}
              {category.isDefault && (
                <ShieldCheck size={14} className="text-slate-400" />
              )}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isIncome ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {isIncome ? 'Income' : 'Expense'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions - Only for custom categories */}
        {!category.isDefault && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(category)}
              className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this category?')) {
                  onDelete(category.id);
                }
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Custom Categories */}
      {customCategories.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            Your Categories 
            <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full font-medium">
              {customCategories.length}
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customCategories.map(renderCategoryCard)}
          </div>
        </section>
      )}

      {/* System Categories */}
      {systemCategories.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            System Defaults
            <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full font-medium">
              {systemCategories.length}
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemCategories.map(renderCategoryCard)}
          </div>
        </section>
      )}
    </div>
  );
};

export default CategoryList;
