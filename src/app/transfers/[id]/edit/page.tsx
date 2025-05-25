'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Base {
  id: string;
  name: string;
}

interface Asset {
  id: string;
  name: string;
}

interface Transfer {
  id: string;
  asset: Asset;
  fromBase: Base;
  toBase: Base;
  quantity: number;
}

export default function EditTransferPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [bases, setBases] = useState<Base[]>([]);
  const [transfer, setTransfer] = useState<Transfer | null>(null);

  const [formData, setFormData] = useState({
    assetId: '',
    fromBaseId: '',
    toBaseId: '',
    quantity: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const [assetRes, baseRes, transferRes] = await Promise.all([
        fetch('/api/assets'),
        fetch('/api/bases'),
        fetch(`/api/transfers/${id}`)
      ]);

      const [assetData, baseData, transferData] = await Promise.all([
        assetRes.json(),
        baseRes.json(),
        transferRes.json()
      ]);

      setAssets(assetData);
      setBases(baseData);
      setTransfer(transferData);

      setFormData({
        assetId: transferData.asset.id,
        fromBaseId: transferData.fromBase.id,
        toBaseId: transferData.toBase.id,
        quantity: transferData.quantity,
      });
    }

    fetchData();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/transfers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      router.push(`/transfers/${id}`);
    } else {
      console.error('Failed to update transfer');
    }
  }

  if (!transfer) return <div>Loading transfer details...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Transfer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="assetId" value={formData.assetId} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">Select Asset</option>
          {assets.map(asset => (
            <option key={asset.id} value={asset.id}>
              {asset.name}
            </option>
          ))}
        </select>

        <select name="fromBaseId" value={formData.fromBaseId} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">Select From Base</option>
          {bases.map(base => (
            <option key={base.id} value={base.id}>
              {base.name}
            </option>
          ))}
        </select>

        <select name="toBaseId" value={formData.toBaseId} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">Select To Base</option>
          {bases.map(base => (
            <option key={base.id} value={base.id}>
              {base.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          placeholder="Quantity"
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Transfer
        </button>
      </form>
    </div>
  );
}
