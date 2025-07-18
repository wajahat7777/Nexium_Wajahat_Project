import { Card } from "@/components/ui";
import { Clock } from "lucide-react";

export default function History() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-50 to-white flex flex-col items-center pt-28 px-2">
      <Card className="p-8 max-w-lg w-full shadow-xl rounded-2xl border border-blue-100 text-center">
        <div className="flex items-center gap-2 justify-center mb-4">
          <Clock className="text-blue-500" />
          <h1 className="text-2xl font-bold text-blue-700">History</h1>
        </div>
        <p className="text-gray-700">Your past logs and AI insights will appear here soon.</p>
      </Card>
    </div>
  );
} 