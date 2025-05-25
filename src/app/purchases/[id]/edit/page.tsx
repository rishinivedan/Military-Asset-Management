"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

interface Asset {
  id: string;
  name: string;
}

interface Purchase {
  id: string;
  assetId: string;
  quantity: number;
  date: string;
  asset: Asset;
}

export default function EditPurchasePage() {
  const params = useParams();
  const router = useRouter();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [assetId, setAssetId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch("/api/assets").then((res) => res.json()).then(setAssets);
  }, []);

  useEffect(() => {
    if (!params?.id) return;

    fetch(`/api/purchases/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Purchase not found");
        return res.json();
      })
      .then((data) => {
        setPurchase(data);
        setAssetId(data.assetId);
        setQuantity(data.quantity);
      })
      .catch(() => {
        alert("Purchase not found");
        router.push("/purchases");
      });
  }, [params?.id, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!assetId) {
      alert("Please select an asset");
      return;
    }

    await fetch(`/api/purchases/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId, quantity }),
    });

    router.push(`/purchases/${params.id}`);
  }

  if (!purchase) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Purchase</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Asset</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            required
          >
            <option value="">Select an asset</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Quantity</label>
          <input
            type="number"
            min={1}
            className="w-full border rounded px-3 py-2"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}
