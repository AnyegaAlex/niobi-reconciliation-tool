export const SummaryCard = ({ stats }) => {
  const cards = [
    {
      title: 'Total Internal',
      value: stats.totalInternal,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Total Provider',
      value: stats.totalProvider,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Matched',
      value: stats.matchedCount,
      color: 'bg-success-100 text-success-800',
    },
    {
      title: 'Only in Internal',
      value: stats.internalOnlyCount,
      color: 'bg-warning-100 text-warning-800',
    },
    {
      title: 'Only in Provider',
      value: stats.providerOnlyCount,
      color: 'bg-danger-100 text-danger-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
          <p className={`mt-1 text-2xl font-semibold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};