import { useState } from 'react';
import { toast } from 'react-hot-toast';
import exportApi from '../api/exportApi';

export const useExport = () => {
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const downloadFileFromResponse = (response, defaultFilename) => {
    try {
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
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
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Successfully exported ${filename}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const exportCsv = async (params) => {
    try {
      setIsExportingCsv(true);
      const response = await exportApi.exportToCsv(params);
      downloadFileFromResponse(response, `transactions-${params.month}-${params.year}.csv`);
    } catch (error) {
      console.error('Export CSV failed:', error);
      toast.error('Failed to export to CSV');
    } finally {
      setIsExportingCsv(false);
    }
  };

  const exportPdf = async (params) => {
    try {
      setIsExportingPdf(true);
      const response = await exportApi.exportToPdf(params);
      downloadFileFromResponse(response, `transactions-${params.month}-${params.year}.pdf`);
    } catch (error) {
      console.error('Export PDF failed:', error);
      toast.error('Failed to export to PDF');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return {
    exportCsv,
    exportPdf,
    isExportingCsv,
    isExportingPdf,
    isExporting: isExportingCsv || isExportingPdf
  };
};
