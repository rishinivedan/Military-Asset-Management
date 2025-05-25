'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Asset {
  id: string;
  name: string;
}

export default function CreateAssignmentPage() {
  const router = useRouter();

  const [assetId, setAssetId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [assignedTo, setAssignedTo] = useState('');
  const [expended, setExpended] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    fetch('/api/assets')
      .then(res => res.json())
      .then(data => setAssets(data))
      .catch(err => console.error('Failed to fetch assets:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch('/api/assignments', {
      method: 'POST',
      body: JSON.stringify({ assetId, quantity, assignedTo, expended }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/assignments');
    } else {
      const error = await res.json();
      alert(error.error || 'Failed to create assignment');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Assignment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Asset</label>
          <select
            value={assetId}
            onChange={e => setAssetId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select an asset</option>
            {assets.map(asset => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(parseInt(e.target.value))}
            className="w-full border p-2 rounded"
            min={1}
            required
          />
        </div>

        <div>
          <label className="block">Assigned To</label>
          <input
            type="text"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={expended}
            onChange={e => setExpended(e.target.checked)}
            className="mr-2"
          />
          <label>Expended</label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </div>
  );
}
