// src/app/assets/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Base = {
  id: string;
  name: string;
};

export default function CreateAssetPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [baseId, setBaseId] = useState('');
  const [bases, setBases] = useState<Base[]>([]);

  useEffect(() => {
    const fetchBases = async () => {
      const res = await fetch('/api/bases');
      const data = await res.json();
      setBases(data);
    };
    fetchBases();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, quantity, baseId }),
    });

    router.push('/assets');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Asset</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Asset Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" required />
        <input type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} className="w-full border p-2 rounded" required />
        <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-full border p-2 rounded" required />
        <select value={baseId} onChange={(e) => setBaseId(e.target.value)} className="w-full border p-2 rounded" required>
          <option value="">Select Base</option>
          {bases.map(base => (
            <option key={base.id} value={base.id}>{base.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
      </form>
    </div>
  );
}
