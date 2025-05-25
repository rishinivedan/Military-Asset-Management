'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Purchase {
  id: string;
  assetId: string;
  quantity: number;
  date: string;
  asset: {
    id: string;
    name: string;
  };
}

const allowedRoles = ['admin', 'officer']; // example allowed roles

export default function PurchaseListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    if (status === 'loading') return; // wait for session to load

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

    fetch('/api/purchases')
      .then((res) => res.json())
      .then(setPurchases);
  }, [session]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Purchases</h1>
        <Link
          href="/purchases/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + New Purchase
        </Link>
      </div>
      <ul className="space-y-2">
        {purchases.map((purchase) => (
          <li
            key={purchase.id}
            className="p-4 border rounded-md flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Asset:</strong> {purchase.asset?.name ?? purchase.assetId}
              </p>
              <p>
                <strong>Quantity:</strong> {purchase.quantity}
              </p>
              <p>
                <strong>Date:</strong> {new Date(purchase.date).toLocaleString()}
              </p>
            </div>
            <Link
              href={`/purchases/${purchase.id}`}
              className="text-blue-500 hover:underline"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
