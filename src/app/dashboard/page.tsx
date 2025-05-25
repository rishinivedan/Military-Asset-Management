'use client';

import React, { useEffect, useState } from 'react';

type DashboardAsset = {
  assetId: string;
  assetName: string;
  baseName: string;
  type: string;
  openingBalance: number;
  closingBalance: number;
  netMovement: number;
  assignedQty: number;
  expendedQty: number;
  movementBreakdown: {
    purchases: number;
    transferIn: number;
    transferOut: number;
  };
};

const DashboardPage = () => {
  const [data, setData] = useState<DashboardAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBase, setSelectedBase] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedBase) params.append('base', selectedBase);
        if (selectedType) params.append('type', selectedType);
        if (fromDate) params.append('from', fromDate);
        if (toDate) params.append('to', toDate);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard?${params.toString()}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [selectedBase, selectedType, fromDate, toDate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Base"
          value={selectedBase}
          onChange={(e) => setSelectedBase(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Filter by Type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Asset</th>
              <th className="border px-4 py-2">Base</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Opening Balance</th>
              <th className="border px-4 py-2">Closing Balance</th>
              <th className="border px-4 py-2">Net Movement</th>
              <th className="border px-4 py-2">Assigned</th>
              <th className="border px-4 py-2">Expended</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.assetId}>
                <td className="border px-4 py-2">{item.assetName}</td>
                <td className="border px-4 py-2">{item.baseName}</td>
                <td className="border px-4 py-2">{item.type}</td>
                <td className="border px-4 py-2">{item.openingBalance}</td>
                <td className="border px-4 py-2">{item.closingBalance}</td>
                <td className="border px-4 py-2">{item.netMovement}</td>
                <td className="border px-4 py-2">{item.assignedQty}</td>
                <td className="border px-4 py-2">{item.expendedQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardPage;
