'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
  date: string;
}

export default function ViewTransferPage() {
  const { id } = useParams<{ id: string }>();
  const [transfer, setTransfer] = useState<Transfer | null>(null);

  useEffect(() => {
    async function fetchTransfer() {
      const res = await fetch(`/api/transfers/${id}`);
      const data: Transfer = await res.json();
      setTransfer(data);
    }

    fetchTransfer();
  }, [id]);

  if (!transfer) return <div>Loading transfer...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Transfer Details</h1>
      <p><strong>Asset:</strong> {transfer.asset.name}</p>
      <p><strong>From Base:</strong> {transfer.fromBase.name}</p>
      <p><strong>To Base:</strong> {transfer.toBase.name}</p>
      <p><strong>Quantity:</strong> {transfer.quantity}</p>
      <p><strong>Date:</strong> {new Date(transfer.date).toLocaleString()}</p>
      <Link href={`/transfers/${id}/edit`} className="text-blue-500 mt-4 block">Edit Transfer</Link>
    </div>
  );
}
