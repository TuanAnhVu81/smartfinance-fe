import { FileSearch } from 'lucide-react';

/**
 * Reusable Empty State component for lists and tables
 * @param {Object} props
 * @param {string} props.title - Main heading text
 * @param {string} props.description - Supporting description text
 * @param {React.ReactNode} props.icon - Lucide icon or custom SVG (default FileSearch)
 * @param {React.ReactNode} props.action - Optional call-to-action button or link
 */
const EmptyState = ({ title, description, icon, action }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-5">
        {icon || <FileSearch className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title || 'No data found'}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        {description || 'There is currently no data available to display here.'}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
