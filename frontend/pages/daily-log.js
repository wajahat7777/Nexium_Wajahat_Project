import { useState } from "react";
import { Button, Input, Card, Textarea } from "@/components/ui";
import { Sparkles, Brain, Zap } from "lucide-react";

export default function DailyLog() {
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [useExternalAI, setUseExternalAI] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const suggestions = [
        "Based on your mood, try taking a short walk outside to clear your mind.",
        "Consider practicing some deep breathing exercises to help you relax.",
        "Your mood suggests you might benefit from connecting with a friend or family member.",
        "Try doing something creative today - it can be very therapeutic.",
        "Remember to be kind to yourself. Every day is a new opportunity."
      ];
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setAiSuggestion(randomSuggestion);
      setLoading(false);
    }, 2000);
  };

  const handleDirectN8nSubmit = async () => {
    if (!mood) {
      alert('Please enter your mood first');
      return;
    }

    setLoading(true);
    
    // Simulate n8n webhook response
    setTimeout(() => {
      setAiSuggestion('AI suggestion received from n8n! (Simulated)');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-50 to-white flex flex-col items-center pt-28 px-2">
      <Card className="p-8 max-w-lg w-full shadow-xl rounded-2xl border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-blue-500" />
          <h1 className="text-2xl font-bold text-blue-700">Daily Log</h1>
        </div>
        
        {/* AI Service Toggle */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">AI Service:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUseExternalAI(false)}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  !useExternalAI 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Brain className="w-3 h-3 inline mr-1" />
                Local
              </button>
              <button
                onClick={() => setUseExternalAI(true)}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  useExternalAI 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Zap className="w-3 h-3 inline mr-1" />
                External
              </button>
            </div>
          </div>
          {useExternalAI && (
            <p className="text-xs text-gray-500 mt-1">
              Using Hugging Face AI through n8n workflow (Simulated)
            </p>
          )}
        </div>

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
          
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Getting AI Suggestion..." : "Submit & Get AI Suggestion"}
            </Button>
            
            <Button 
              type="button" 
              onClick={handleDirectN8nSubmit}
              disabled={loading || !mood}
              className="bg-green-600 hover:bg-green-700"
            >
              <Zap className="w-4 h-4 mr-1" />
              Direct n8n
            </Button>
          </div>
        </form>
        
        {aiSuggestion && (
          <div className="mt-6 p-4 bg-blue-50 rounded shadow text-blue-900">
            <div className="flex items-center gap-2 mb-2">
              {useExternalAI ? (
                <Zap className="text-green-600" />
              ) : (
                <Brain className="text-blue-600" />
              )}
              <strong>
                AI Suggestion {useExternalAI ? '(External)' : '(Local)'}:
              </strong>
            </div>
            <div>{aiSuggestion}</div>
          </div>
        )}
      </Card>
    </div>
  );
} 