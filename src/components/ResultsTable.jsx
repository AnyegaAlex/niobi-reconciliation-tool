import { useState } from 'react';
import { ExportButton } from './ExportButton';

export const ResultsTable = ({ results }) => {
  const [activeTab, setActiveTab] = useState('matched');

  const renderTable = () => {
    const data = results[activeTab];
    const columns = getColumnsForTab(activeTab);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index} className={getRowClass(row, activeTab)}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  No transactions found in this category
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const getColumnsForTab = (tab) => {
    switch (tab) {
      case 'matched':
        return [
          { key: 'transaction_reference', header: 'Reference' },
          { key: 'amount', header: 'Amount (Internal)' },
          { key: 'providerAmount', header: 'Amount (Provider)' },
          { key: 'status', header: 'Status (Internal)' },
          { key: 'providerStatus', header: 'Status (Provider)' },
        ];
      case 'onlyInternal':
        return [
          { key: 'transaction_reference', header: 'Reference' },
          { key: 'amount', header: 'Amount' },
          { key: 'status', header: 'Status' },
        ];
      case 'onlyProvider':
        return [
          { key: 'transaction_reference', header: 'Reference' },
          { key: 'amount', header: 'Amount' },
          { key: 'status', header: 'Status' },
        ];
      default:
        return [];
    }
  };

  const renderCell = (row, column) => {
    const value = row[column.key];
    
    if (column.key === 'status' || column.key === 'providerStatus') {
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'Success' ? 'bg-success-100 text-success-800' :
          value === 'Failed' ? 'bg-danger-100 text-danger-800' :
          'bg-warning-100 text-warning-800'
        }`}>
          {value}
        </span>
      );
    }

    if (column.key.includes('amount')) {
      return typeof value === 'string' && value.startsWith('$')
    ? value
    : `$${parseFloat(value).toFixed(2)}`;
    }

    if (column.key === 'reference') {
      return <span className="font-mono">{value}</span>;
    }

    return value;
  };

  const getRowClass = (row, tab) => {
    if (tab === 'matched' && (row.discrepancies.amount || row.discrepancies.status)) {
      return 'bg-warning-50';
    }
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('matched')}
            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'matched'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            ✅ Matched ({results.matched.length})
          </button>
          <button
            onClick={() => setActiveTab('onlyInternal')}
            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'onlyInternal'
                ? 'border-warning text-warning'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            ⚠️ Only Internal ({results.onlyInternal.length})
          </button>
          <button
            onClick={() => setActiveTab('onlyProvider')}
            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'onlyProvider'
                ? 'border-danger text-danger'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            ❌ Only Provider ({results.onlyProvider.length})
          </button>
        </nav>
      </div>
      <div className="p-4">
        {renderTable()}
        <div className="mt-4 flex justify-end">
          <ExportButton data={results[activeTab]} fileName={`${activeTab}_transactions.csv`} />
        </div>
      </div>
    </div>
  );
};