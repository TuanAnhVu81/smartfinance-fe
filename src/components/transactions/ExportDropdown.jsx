import { useState } from 'react';
import { toast } from 'react-hot-toast';
import exportApi from '../../api/exportApi';

/**
 * Handle exporting file directly from an Axios response
 * @param {Object} response - Axios response object containing blob data
 * @param {string} defaultFilename - Fallback filename if none provided in headers
 */
const downloadFileFromResponse = (response, defaultFilename) => {
  try {
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Attempt to extract filename from content-disposition header if available
    let filename = defaultFilename;
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) { 
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success(`Successfully exported ${filename}`);
  } catch (error) {
    console.error('Error downloading file:', error);
    toast.error('Failed to download file');
  }
};

/**
 * Reusable dropdown component for exporting options
 * @param {Object} props
 * @param {number} props.month 
 * @param {number} props.year 
 */
const ExportDropdown = ({ month, year }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      setIsOpen(false);
      
      const params = { month, year };
      
      if (format === 'csv') {
        const response = await exportApi.exportToCsv(params);
        downloadFileFromResponse(response, `transactions-${month}-${year}.csv`);
      } else if (format === 'pdf') {
        const response = await exportApi.exportToPdf(params);
        downloadFileFromResponse(response, `transactions-${month}-${year}.pdf`);
      }
    } catch (error) {
      console.error(`Export ${format} failed:`, error);
      toast.error(`Failed to export to ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="inline-flex justify-center items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
      >
        {isExporting ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
        )}
        Export
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 focus:outline-none">
          <div className="py-1">
            <button
              onClick={() => handleExport('csv')}
              className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              CSV File
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
