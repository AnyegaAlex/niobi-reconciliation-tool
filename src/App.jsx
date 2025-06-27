import { useReconciliation } from './hooks/useReconciliation';
import { FileUploader } from './components/FileUploader';
import { SummaryCard } from './components/SummaryCard';
import { ResultsTable } from './components/ResultsTable';

function App() {
  const { results, isProcessing, reconcileFiles } = useReconciliation();

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Niobi Reconciliation Tool</h1>
          <p className="mt-2 text-lg text-gray-600">
            Compare internal system exports with provider statements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <FileUploader onFilesSelected={reconcileFiles} isProcessing={isProcessing} />
          </div>
          <div className="lg:col-span-2">
            {results ? (
              <>
                <SummaryCard stats={results.stats} />
                <ResultsTable results={results} />
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Upload files to begin reconciliation
                </h2>
                <p className="text-gray-500">
                  Please upload both the internal system export and provider statement CSV files
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;