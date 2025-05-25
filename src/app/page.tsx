'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Military Asset Management</h1>
      <p className="mb-4 text-lg"> View or manage your data:</p>

      <div className="space-y-4">
        <Link href="/dashboard" className="block text-blue-600 hover:underline">
          → Go to Dashboard
        </Link>
        <Link href="/assets" className="block text-blue-600 hover:underline">
          → Manage Assets
        </Link>
        <Link href="/bases" className="block text-blue-600 hover:underline">
          → Manage Bases
        </Link>
        <Link href="/users" className="block text-blue-600 hover:underline">
          → Manage Users
        </Link>
        <Link href="/purchases" className="block text-blue-600 hover:underline">
          → Manage Purchases
        </Link>
        <Link href="/transfers" className="block text-blue-600 hover:underline">
          → Manage Transfers
        </Link>
        <Link href="/assignments" className="block text-blue-600 hover:underline">
          → Manage Assignments
        </Link>
      </div>
    </main>
  );
}
