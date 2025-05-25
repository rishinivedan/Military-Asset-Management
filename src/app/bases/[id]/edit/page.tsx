'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditBasePage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchBase = async () => {
      const res = await fetch(`/api/bases/${id}`);
      const base = await res.json();
      setName(base.name);
      setLocation(base.location);
    };
    fetchBase();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`/api/bases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, location }),
    });

    router.push('/bases');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Base</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" required />
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border p-2 rounded" required />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Update</button>
      </form>
    </div>
  );
}
