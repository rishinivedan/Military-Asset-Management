"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Unauthorized() {
  const router = useRouter();

  useEffect(() => {
    // Optionally redirect after a few seconds or add a button
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="mb-6 text-center max-w-md">
        Sorry, you do not have permission to view this page.
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
