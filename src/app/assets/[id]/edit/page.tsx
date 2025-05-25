// src/app/assets/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Base = {
  id: string;
  name: string;
};

export default function EditAssetPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [baseId, setBaseId] = useState('');
  const [bases, setBases] = useState<Base[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [assetRes, baseRes] = await Promise.all([
        fetch(`/api/assets/${id}`),
        fetch('/api/bases'),
      ]);
      const asset = await assetRes.json();
      const baseList = await baseRes.json();
      setName(asset.name);
      setType(asset.type);
      setQuantity(asset.quantity);
      setBaseId(asset.baseId);
      setBases(baseList);
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`/api/assets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, quantity, baseId }),
    });

    router.push('/assets');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Asset</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" required />
        <input type="text" value={type} onChange={(e) => setType(e.target.value)} className="w-full border p-2 rounded" required />
        <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-full border p-2 rounded" required />
        <select value={baseId} onChange={(e) => setBaseId(e.target.value)} className="w-full border p-2 rounded" required>
          <option value="">Select Base</option>
          {bases.map(base => (
            <option key={base.id} value={base.id}>{base.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Update</button>
      </form>
    </div>
  );
}
