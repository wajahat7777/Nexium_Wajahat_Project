import { useState } from "react";
import { Button, Input, Card, Textarea } from "@/components/ui";
import { getAIResponse } from "../lib/ai";

export default function DailyLog() {
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ai = await getAIResponse(notes || mood);
    setAiSuggestion(ai.suggestion || JSON.stringify(ai));
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white pt-32">
      <Card className="p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Daily Log</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={mood}
            onChange={e => setMood(e.target.value)}
            placeholder="How are you feeling today? (e.g., Happy, Sad, Anxious)"
            required
          />
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add any notes or thoughts..."
            rows={4}
          />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Getting AI Suggestion..." : "Submit & Get AI Suggestion"}</Button>
        </form>
        {aiSuggestion && (
          <div className="mt-6 p-4 bg-blue-50 rounded shadow text-blue-900">
            <strong>AI Suggestion:</strong>
            <div>{aiSuggestion}</div>
          </div>
        )}
      </Card>
    </div>
  );
} 