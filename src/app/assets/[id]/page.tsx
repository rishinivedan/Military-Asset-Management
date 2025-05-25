'use client';
//src\app\assets\[id]\page.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Base {
  id: string;
  name: string;
  // Add other base properties if needed
}

interface Asset {
  id: string;
  name: string;
  type: string;
  quantity: number;
  base?: Base;
  // Add other asset properties from your Prisma model
}

export default function AssetDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await fetch(`/api/assets/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch asset');
        }
        const data: Asset = await res.json();
        setAsset(data);
      } catch (error) {
        console.error('Error fetching asset:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchAsset();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!asset) return <div className="p-6">Asset not found</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{asset.name}</h1>
      <div className="space-y-2">
        <p><strong>Type:</strong> {asset.type}</p>
        <p><strong>Quantity:</strong> {asset.quantity}</p>
        <p><strong>Base:</strong> {asset.base?.name ?? 'N/A'}</p>
      </div>
    </div>
  );
}