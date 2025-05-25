'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Base = {
  id: string;
  name: string;
};

type Role = 'ADMIN' | 'COMMANDER' | 'LOGISTICS';

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('LOGISTICS');
  const [baseId, setBaseId] = useState<string>('');
  const [bases, setBases] = useState<Base[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch(`/api/users/${id}`).then(res => res.json()),
      fetch('/api/bases').then(res => res.json()),
    ]).then(([user, baseList]) => {
      setName(user.name ?? '');
      setEmail(user.email ?? '');
      setRole(user.role ?? 'LOGISTICS');
      setBaseId(user.base?.id ?? ''); // Fix: use user.base?.id instead of user.baseId
      setBases(Array.isArray(baseList) ? baseList : []);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch data:', err);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        role,
        baseId: baseId || null,
      }),
    });

    if (res.ok) {
      router.push(`/users/${id}`);
    } else {
      alert('Failed to update user.');
    }
  };

  if (loading) return <p>Loading user data...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Email"
          required
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value as Role)}
          className="w-full border rounded p-2"
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
