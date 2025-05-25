'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Transfer = {
  id: string;
  quantity: number;
  date: string;
  asset: {
    name: string;
  };
  fromBase: {
    name: string;
  };
  toBase: {
    name: string;
  };
};

const allowedRoles = ['ADMIN', 'COMMANDER']; // roles allowed to access transfers

export default function TransferListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (!allowedRoles.includes(session.user.role)) {
      router.push('/unauthorized');
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    if (!session || !allowedRoles.includes(session.user.role)) return;

    const fetchTransfers = async () => {
      try {
        const res = await fetch('/api/transfers');
        const data = await res.json();
        setTransfers(data);
      } catch (error) {
        console.error('Failed to fetch transfers:', error);
      }
    };

    fetchTransfers();
  }, [session]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transfers</h1>
        <Link
          href="/transfers/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create Transfer
        </Link>
      </div>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Asset</th>
            <th className="border px-4 py-2">From Base</th>
            <th className="border px-4 py-2">To Base</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer) => (
            <tr key={transfer.id}>
              <td className="border px-4 py-2">{transfer.asset.name}</td>
              <td className="border px-4 py-2">{transfer.fromBase.name}</td>
              <td className="border px-4 py-2">{transfer.toBase.name}</td>
              <td className="border px-4 py-2">{transfer.quantity}</td>
              <td className="border px-4 py-2">
                {new Date(transfer.date).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <Link
                  href={`/transfers/${transfer.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/transfers/${transfer.id}/edit`}
                  className="text-green-600 hover:underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
          {transfers.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No transfers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
