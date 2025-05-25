'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Base = {
  id: string;
  name: string;
};

type Role = 'ADMIN' | 'COMMANDER' | 'LOGISTICS';

export default function CreateUserPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('LOGISTICS');
  const [baseId, setBaseId] = useState<string>('');
  const [bases, setBases] = useState<Base[]>([]);

  useEffect(() => {
    fetch('/api/bases')
      .then(res => res.json())
      .then(setBases);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        role,
        baseId: baseId || null,
      }),
    });

    if (res.ok) {
      router.push('/users');
    } else {
      alert('Failed to create user.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value as Role)}
          className="w-full border rounded p-2"
          required
        >
          <option value="ADMIN">Admin</option>
          <option value="COMMANDER">Commander</option>
          <option value="LOGISTICS">Logistics</option>
        </select>
        <select
          value={baseId}
          onChange={e => setBaseId(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Select Base (optional)</option>
          {bases.map(base => (
            <option key={base.id} value={base.id}>
              {base.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create User
        </button>
      </form>
    </div>
  );
}
