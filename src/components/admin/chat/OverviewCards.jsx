import React from 'react';

const OverviewCards = () => {
  const stats = [
    { title: 'Active Users', value: 45 },
    { title: 'Total Messages', value: 1342 },
    { title: 'Resolved Chats', value: 342 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-gray-700 font-bold text-lg">{stat.title}</h2>
          <p className="text-blue-500 text-2xl font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;