import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { FiDownload } from 'react-icons/fi';

export const ExportButton = ({ data, fileName }) => {
  const handleExport = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex bg-orange-600 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-primary hover:bg-orange-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
    >
      <FiDownload className="mr-2" />
      Export as CSV
    </button>
  );
};