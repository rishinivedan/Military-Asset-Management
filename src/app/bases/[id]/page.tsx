'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Base = {
  id: string;
  name: string;
  location: string;
};

export default function BaseDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [base, setBase] = useState<Base | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBase = async () => {
      try {
        const res = await fetch(`/api/bases/${id}`);
        if (!res.ok) throw new Error('Failed to fetch base');
        const data = await res.json();
        setBase(data);
      } catch (err) {
        console.error('Error fetching base:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBase();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!base) return <div className="p-6">Base not found</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{base.name}</h1>
      <div className="space-y-2">
        <p><strong>Location:</strong> {base.location}</p>
      </div>
    </div>
  );
}
