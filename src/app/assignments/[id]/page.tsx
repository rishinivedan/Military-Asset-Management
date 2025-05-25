import { notFound } from "next/navigation";

export default async function AssignmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Build full URL for fetch
  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/assignments/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const assignment = await res.json();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Assignment Details</h1>
      <p>
        <strong>Asset ID:</strong> {assignment.assetId}
      </p>
      <p>
        <strong>Assigned To:</strong> {assignment.assignedTo}
      </p>
      <p>
        <strong>Date:</strong> {new Date(assignment.date).toLocaleString()}
      </p>
      <p>
        <strong>Quantity:</strong> {assignment.quantity}
      </p>
      <p>
        <strong>Expended:</strong> {assignment.expended ? "Yes" : "No"}
      </p>
    </div>
  );
}
