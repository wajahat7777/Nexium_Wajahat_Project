import { Card } from "@/components/ui";

export default function History() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white pt-32">
      <Card className="p-8 max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">History</h1>
        <p className="text-gray-700">Your past logs and AI insights will appear here soon.</p>
      </Card>
    </div>
  );
} 