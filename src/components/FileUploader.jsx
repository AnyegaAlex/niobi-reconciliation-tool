import { useState } from 'react';
import { FiUpload, FiAlertCircle, FiDownload, FiFilePlus, FiFileText } from 'react-icons/fi';

/**
 * FileUploader Component
 * Allows uploading two CSV files or loading sample data.
 * Includes ARIA labels, error handling, and enhanced Tailwind styling.
 */
export const FileUploader = ({ onFilesSelected, isProcessing }) => {
  const [internalFile, setInternalFile] = useState(null);
  const [providerFile, setProviderFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // File validation & state setter
  const handleFileChange = (setter) => (e) => {
    setErrorMsg('');
    const file = e.target.files[0];
    if (file && file.type !== 'text/csv') {
      setErrorMsg('Only CSV files are allowed.');
      return;
    }
    setter(file);
  };

  // Simulate file upload by fetching public CSVs as blobs
  const loadSampleFiles = async () => {
    try {
      setErrorMsg('');
      const [internalRes, providerRes] = await Promise.all([
        fetch('/sample-internal.csv'),
        fetch('/sample-provider.csv'),
      ]);

      if (!internalRes.ok || !providerRes.ok) {
      throw new Error('Sample files not found in /public.');
      }

      const internalBlob = await internalRes.blob();
      const providerBlob = await providerRes.blob();

      const internalSample = new File([internalBlob], 'sample-internal.csv', {
        type: 'text/csv',
      });
      const providerSample = new File([providerBlob], 'sample-provider.csv', {
        type: 'text/csv',
      });

      setInternalFile(internalSample);
      setProviderFile(providerSample);
      onFilesSelected(internalSample, providerSample);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load sample files. Check the filenames or try again.');
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!internalFile || !providerFile) {
      setErrorMsg('Please upload both files before proceeding.');
      return;
    }
    onFilesSelected(internalFile, providerFile);
  };

  return (
    <section
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto"
      aria-labelledby="upload-section"
    >
      <h2 id="upload-section" className="text-xl font-semibold mb-4 text-primary">
        Upload or Use Sample CSV Files
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Internal File Input */}
        <div>
          {/* Load sample files directly */}
          <div className="text-right">
            <button
              type="button"
              onClick={loadSampleFiles}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border-amber-800 bg-orange-200 font-medium text-black bg-secondary hover:bg-orange-500 hover:text-white rounded-md shadow-sm transition focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-1"
              aria-label="Use demo sample CSV files"
            >
              <FiFilePlus className="text-black" />
              Use Sample Files
            </button>
          </div>
          <label htmlFor="internal-file" className="block text-sm font-medium text-gray-700 mb-1">
            Internal System Export
          </label>
          <div className="flex items-center gap-2">
            <input
              id="internal-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange(setInternalFile)}
              className="sr-only"
              aria-label="Upload internal system CSV file"
            />
            <label
              htmlFor="internal-file"
              className="flex-1 bg-gray-100 border border-gray-300 rounded-md py-2 px-4 cursor-pointer hover:bg-gray-200 focus:outline-none"
              tabIndex={0}
            >
              {internalFile ? (
                <span className="text-gray-800">{internalFile.name}</span>
              ) : (
                <span className="text-gray-500">Select CSV file</span>
              )}
            </label>
          </div>
        </div>

        {/* Provider File Input */}
        <div>
          <label htmlFor="provider-file" className="block text-sm font-medium text-gray-700 mb-1">
            Provider Statement
          </label>
          <div className="flex items-center gap-2">
            <input
              id="provider-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange(setProviderFile)}
              className="sr-only"
              aria-label="Upload provider statement CSV file"
            />
            <label
              htmlFor="provider-file"
              className="flex-1 bg-gray-100 border border-gray-300 rounded-md py-2 px-4 cursor-pointer hover:bg-gray-200 focus:outline-none"
              tabIndex={0}
            >
              {providerFile ? (
                <span className="text-gray-800">{providerFile.name}</span>
              ) : (
                <span className="text-gray-500">Select CSV file</span>
              )}
            </label>
          </div>
        </div>
        {/* Error Message */}
        {errorMsg && (
          <div className="flex items-center text-sm text-danger bg-red-50 border border-red-300 px-3 py-2 rounded-md">
            <FiAlertCircle className="mr-2 text-danger" />
            {errorMsg}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!internalFile || !providerFile || isProcessing}
          className={`w-full bg-orange-600 py-2 px-4 rounded-md text-black hover:text-white font-medium flex items-center justify-center transition ${
            !internalFile || !providerFile || isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-orange-900'
          }`}
          aria-disabled={!internalFile || !providerFile || isProcessing}
          aria-label="Start reconciliation"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                  5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 
                  3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <FiUpload className="mr-2" />
              Reconcile Files
            </>
          )}
        </button>

          {/* Sample CSV Links */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="mb-2 flex items-center">
              <FiFileText className="mr-2 text-primary" />
              Test with sample files:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                <a href="/sample-internal.csv" download className="text-secondary hover:underline">
                  Download Internal Export
                </a>
              </li>
              <li>
                <a href="/sample-provider.csv" download className="text-secondary hover:underline">
                  Download Provider Statement
                </a>
              </li>
            </ul>
          </div>
      </form>
    </section>
  );
};
