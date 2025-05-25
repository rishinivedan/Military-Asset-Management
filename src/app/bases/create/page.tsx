'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateBasePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/bases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, location }),
    });

    router.push('/bases');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Base</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Base Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border p-2 rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
      </form>
    </div>
  );
}
