'use client';

import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-6">
      <h2 className="text-xl font-bold mb-6">MSM</h2>
      <nav className="space-y-4">
        <Link href="/dashboard" className="block hover:text-gray-300">
          Dashboard
        </Link>
        <Link href="/assets" className="block hover:text-gray-300">
          Assets
        </Link>
        <Link href="/bases" className="block hover:text-gray-300">
          Bases
        </Link>
        <Link href="/users" className="block hover:text-gray-300">
          Users
        </Link>
        <Link href="/purchases" className="block hover:text-gray-300">
          Purchases
        </Link>
        <Link href="/transfers" className="block hover:text-gray-300">
          Transfers
        </Link>
        <Link href="/assignments" className="block hover:text-gray-300">
          Assignments
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
