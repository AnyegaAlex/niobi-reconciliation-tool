/**
 * Reconciles two lists of transactions by `transaction_reference`.
 * Flags mismatches in amount or status and categorizes the results.
 *
 * @param {Array<Object>} internal - Internal system transactions
 * @param {Array<Object>} provider - Provider transactions
 * @returns {{
 *   matched: Array<Object>,
 *   onlyInternal: Array<Object>,
 *   onlyProvider: Array<Object>,
 *   stats: Object
 * }}
 */
export function performReconciliation(internal, provider) {
  const internalMap = new Map();
  const providerMap = new Map();

  internal.forEach(tx => {
    internalMap.set(tx.transaction_reference, tx);
  });

  provider.forEach(tx => {
    providerMap.set(tx.transaction_reference, tx);
  });

  const matched = [];
  const onlyInternal = [];
  const onlyProvider = [];

  internalMap.forEach((tx, ref) => {
    if (providerMap.has(ref)) {
      const providerTx = providerMap.get(ref);

      matched.push({
        ...tx,
        providerAmount: providerTx.amount,
        providerStatus: providerTx.status,
        discrepancies: {
          amount: tx.amount !== providerTx.amount,
          status: tx.status !== providerTx.status
        }
      });

      providerMap.delete(ref); // prevent double-counting
    } else {
      onlyInternal.push(tx);
    }
  });

  providerMap.forEach(tx => {
    onlyProvider.push(tx);
  });

  return {
    matched,
    onlyInternal,
    onlyProvider,
    stats: {
      matchedCount: matched.length,
      internalOnlyCount: onlyInternal.length,
      providerOnlyCount: onlyProvider.length,
      totalInternal: internal.length,
      totalProvider: provider.length,
      matchRate: matched.length / Math.max(internal.length, provider.length),
      discrepancyCount: onlyInternal.length + onlyProvider.length
    }
  };
}
