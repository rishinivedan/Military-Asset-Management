'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Asset = {
  id: string;
  name: string;
  type: string;
  quantity: number;
  base: {
    name: string;
  };
};

export default function AssetListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    // Redirect unauthorized users immediately
    if (status === 'loading') return; // wait for session to load
    if (!session || !session.user?.role) {
      router.push('/login');
      return;
    }
    const allowedRoles = ['ADMIN', 'COMMANDER', 'LOGISTICS'];
    if (!allowedRoles.includes(session.user.role)) {
      router.push('/unauthorized');
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchAssets = async () => {
      const res = await fetch('/api/assets');
      const data = await res.json();
      setAssets(data);
    };
    fetchAssets();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Assets</h1>
        <Link
          href="/assets/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Asset
        </Link>
      </div>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Base</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="text-center">
              <td className="border p-2">{asset.name}</td>
              <td className="border p-2">{asset.type}</td>
              <td className="border p-2">{asset.quantity}</td>
              <td className="border p-2">{asset.base?.name ?? 'N/A'}</td>
              <td className="border p-2">
                <Link href={`/assets/${asset.id}`} className="text-blue-600 mr-2">
                  View
                </Link>
                <Link href={`/assets/${asset.id}/edit`} className="text-green-600">
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
