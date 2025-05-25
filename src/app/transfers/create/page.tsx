"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Asset {
  id: string;
  name: string;
}

interface Base {
  id: string;
  name: string;
}

export default function CreateTransferPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [bases, setBases] = useState<Base[]>([]);
  const [form, setForm] = useState({
    assetId: "",
    fromBaseId: "",
    toBaseId: "",
    quantity: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetRes, baseRes] = await Promise.all([
          fetch("/api/assets"),
          fetch("/api/bases"),
        ]);
        const [assetData, baseData] = await Promise.all([
          assetRes.json(),
          baseRes.json(),
        ]);
        setAssets(assetData);
        setBases(baseData);
      } catch (error) {
        console.error("Failed to fetch assets or bases", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: name === "quantity" ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/transfers");
      } else {
        console.error("Failed to create transfer");
      }
    } catch (error) {
      console.error("Error creating transfer", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Transfer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Asset</label>
          <select
            name="assetId"
            value={form.assetId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          >
            <option value="">Select Asset</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">From Base</label>
          <select
            name="fromBaseId"
            value={form.fromBaseId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          >
            <option value="">Select From Base</option>
            {bases.map((base) => (
              <option key={base.id} value={base.id}>
                {base.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">To Base</label>
          <select
            name="toBaseId"
            value={form.toBaseId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          >
            <option value="">Select To Base</option>
            {bases.map((base) => (
              <option key={base.id} value={base.id}>
                {base.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
            min={1}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create Transfer
        </button>
      </form>
    </div>
  );
}
