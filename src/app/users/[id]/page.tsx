'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Base = {
  id: string;
  name: string;
};

type Role = 'ADMIN' | 'COMMANDER' | 'LOGISTICS';

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  base?: Base | null;
  createdAt: string;
};

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('User not found');
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading user...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Base:</strong> {user.base?.name ?? 'N/A'}</p>
      <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

      <button
        onClick={() => router.push(`/users/${id}/edit`)}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Edit User
      </button>
    </div>
  );
}
