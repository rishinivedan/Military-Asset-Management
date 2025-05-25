"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Asset = {
  id: string;
  name: string;
};

type Assignment = {
  id: string;
  asset: Asset;
  quantity: number;
  assignedTo: string;
  expended: boolean;
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/assignments");
        if (!res.ok) throw new Error("Failed to fetch assignments");
        const data = await res.json();
        setAssignments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) return <div className="p-6">Loading assignments...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Assignments</h1>
        <Link
          href="/assignments/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Assignment
        </Link>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="border p-2">Asset</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Assigned To</th>
            <th className="border p-2">Expended</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No assignments found.
              </td>
            </tr>
          ) : (
            assignments.map((a) => (
              <tr key={a.id} className="text-center">
                <td className="border p-2">{a.asset?.name ?? "N/A"}</td>
                <td className="border p-2">{a.quantity}</td>
                <td className="border p-2">{a.assignedTo}</td>
                <td className="border p-2">{a.expended ? "Yes" : "No"}</td>
                <td className="border p-2">
                  <Link href={`/assignments/${a.id}`} className="text-blue-600 mr-2">
                    View
                  </Link>
                  <Link href={`/assignments/${a.id}/edit`} className="text-green-600">
                    Edit
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
