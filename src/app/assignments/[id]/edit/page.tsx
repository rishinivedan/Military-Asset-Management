'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Asset {
  id: string;
  name: string;
}

interface Assignment {
  id: string;
  assetId: string;
  quantity: number;
  assignedTo: string;
  expended: boolean;
}

export default function EditAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [resAssignment, resAssets] = await Promise.all([
          fetch(`/api/assignments/${id}`),
          fetch('/api/assets'),
        ]);

        if (!resAssignment.ok) throw new Error('Failed to fetch assignment');
        if (!resAssets.ok) throw new Error('Failed to fetch assets');

        const assignmentData = await resAssignment.json();
        const assetsData = await resAssets.json();

        setAssignment(assignmentData);
        setAssets(assetsData);
      } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Something went wrong');
  }
}

    }

    if (id) fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setAssignment((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : name === 'quantity'
                ? parseInt(value)
                : value,
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;

    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignment),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update assignment');
      }

      router.push('/assignments');
    } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Error submitting form');
  }
}

  };

  if (!assignment) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Assignment</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="assetId">
            Asset
          </label>
          <select
            id="assetId"
            name="assetId"
            value={assignment.assetId}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="quantity">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={assignment.quantity}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="assignedTo">
            Assigned To
          </label>
          <input
            type="text"
            id="assignedTo"
            name="assignedTo"
            value={assignment.assignedTo}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="expended"
            name="expended"
            checked={assignment.expended}
            onChange={handleChange}
          />
          <label htmlFor="expended" className="font-semibold">
            Expended
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Assignment
        </button>
      </form>
    </div>
  );
}
