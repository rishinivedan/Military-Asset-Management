"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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

export default function PurchaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [purchase, setPurchase] = useState<Purchase | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    fetch(`/api/purchases/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Purchase not found");
        return res.json();
      })
      .then(setPurchase)
      .catch(() => {
        alert("Purchase not found");
        router.push("/purchases");
      });
  }, [params?.id, router]);

  if (!purchase) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Purchase Details</h1>
      <p>
        <strong>Asset:</strong> {purchase.asset?.name ?? purchase.assetId}
      </p>
      <p>
        <strong>Quantity:</strong> {purchase.quantity}
      </p>
      <p>
        <strong>Date:</strong> {new Date(purchase.date).toLocaleString()}
      </p>
      <div className="mt-4 flex space-x-4">
        <Link
          href={`/purchases/${purchase.id}/edit`}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Edit
        </Link>
        <button
          onClick={async () => {
            if (
              confirm("Are you sure you want to delete this purchase?")
            ) {
              await fetch(`/api/purchases/${purchase.id}`, {
                method: "DELETE",
              });
              router.push("/purchases");
            }
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
      <Link href="/purchases" className="inline-block mt-6 text-blue-500 hover:underline">
        ← Back to purchases
      </Link>
    </div>
  );
}
