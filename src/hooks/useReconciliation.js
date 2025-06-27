import { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { performReconciliation } from '../utils/reconcile';

const STATUS_ENUM = ['SUCCESS', 'FAILED', 'PENDING'];

/**
 * Hook to manage reconciliation state, file parsing, and reporting.
 */
export const useReconciliation = () => {
  const [rawResults, setRawResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const normalizeTransaction = (tx) => ({
    ...tx,
    amount: parseFloat(tx.amount || 0).toFixed(2),
    status: String(tx.status || '').trim().toUpperCase(),
    transaction_reference: String(tx.transaction_reference || '').trim()
  });

  const validateTransaction = (tx) =>
    tx.transaction_reference &&
    !isNaN(parseFloat(tx.amount)) &&
    STATUS_ENUM.includes(tx.status);

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const fields = results.meta.fields.map(f => f.toLowerCase());
            if (!fields.includes('transaction_reference')) {
              throw new Error('Missing required column: transaction_reference');
            }

            const validTransactions = results.data
              .map(normalizeTransaction)
              .filter(validateTransaction);

            if (validTransactions.length === 0) {
              throw new Error('No valid transactions in file.');
            }

            resolve(validTransactions);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => reject(error)
      });
    });
  };

  const reconcileFiles = async (internalFile, providerFile) => {
    setIsProcessing(true);
    setError(null);
    setRawResults(null);

    try {
      if (!internalFile || !providerFile) {
        throw new Error('Both files are required.');
      }

      const [internalData, providerData] = await Promise.all([
        parseCSV(internalFile),
        parseCSV(providerFile)
      ]);

      const results = performReconciliation(internalData, providerData);
      setRawResults(results);
    } catch (err) {
      console.error('Reconciliation error:', err);
      setError(err.message || 'Failed to reconcile files');
    } finally {
      setIsProcessing(false);
    }
  };

  const results = useMemo(() => {
    if (!rawResults) return null;

    return {
      ...rawResults,
      hasDiscrepancies: rawResults.stats.discrepancyCount > 0,
      matched: rawResults.matched.map(tx => ({
        ...tx,
        amount: `$${tx.amount}`,
        providerAmount: `$${tx.providerAmount}`
      }))
    };
  }, [rawResults]);

  return {
    results,
    isProcessing,
    error,
    reconcileFiles
  };
};
