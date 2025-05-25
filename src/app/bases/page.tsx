'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Base = {
  id: string;
  name: string;
  location: string;
};

export default function BaseListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bases, setBases] = useState<Base[]>([]);

  useEffect(() => {
    if (status === 'loading') return; // wait till session loads
    if (!session) {
      router.push('/login');
      return;
    }
    // User is logged in, fetch bases
    const fetchBases = async () => {
      const res = await fetch('/api/bases');
      const data = await res.json();
      setBases(data);
    };
    fetchBases();
  }, [session, status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Bases</h1>
        <Link
          href="/bases/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Base
        </Link>
        <button
          onClick={() => signOut()}
          className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bases.map((base) => (
            <tr key={base.id} className="text-center">
              <td className="border p-2">{base.name}</td>
              <td className="border p-2">{base.location}</td>
              <td className="border p-2">
                <Link href={`/bases/${base.id}`} className="text-blue-600 mr-2">
                  View
                </Link>
                <Link href={`/bases/${base.id}/edit`} className="text-green-600">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
