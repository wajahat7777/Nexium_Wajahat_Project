import { useState, useEffect } from "react";
import { Button, Input, Card, Textarea } from "@/components/ui";
import { getAIResponse } from "../lib/ai";
import apiClient from "../lib/api";
import { Sparkles, Brain, Zap } from "lucide-react";

export default function DailyLog() {
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [useExternalAI, setUseExternalAI] = useState(false);
  const [externalAIAvailable, setExternalAIAvailable] = useState(false);

  // Check if external AI service is available on component mount
  useEffect(() => {
    const checkExternalAI = async () => {
      try {
        const isAvailable = await apiClient.checkExternalAIService();
        setExternalAIAvailable(isAvailable);
      } catch (error) {
        console.log('External AI service not available:', error);
        setExternalAIAvailable(false);
      }
    };

    checkExternalAI();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let suggestion;
      
      if (useExternalAI && externalAIAvailable) {
        // Use external AI service (n8n + Hugging Face)
        const response = await apiClient.getExternalAISuggestion(mood, notes);
        suggestion = response.suggestion;
      } else {
        // Use local AI service
        const ai = await getAIResponse(notes || mood);
        suggestion = ai.suggestion || JSON.stringify(ai);
      }
      
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error('AI suggestion error:', error);
      setAiSuggestion('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectN8nSubmit = async () => {
    if (!mood) {
      alert('Please enter your mood first');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiClient.sendToN8nWebhook({
        mood,
        notes,
        timestamp: new Date().toISOString()
      });
      
      setAiSuggestion(response.suggestion || 'AI suggestion received from n8n!');
    } catch (error) {
      console.error('N8n webhook error:', error);
      setAiSuggestion('Failed to get AI suggestion from n8n. Please try again.');
    } finally {
      setLoading(false);
    }
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
                disabled={!externalAIAvailable}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  useExternalAI 
                    ? 'bg-green-500 text-white' 
                    : externalAIAvailable 
                      ? 'bg-gray-200 text-gray-600' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Zap className="w-3 h-3 inline mr-1" />
                External
                {!externalAIAvailable && <span className="ml-1">(Offline)</span>}
              </button>
            </div>
          </div>
          {useExternalAI && (
            <p className="text-xs text-gray-500 mt-1">
              Using Hugging Face AI through n8n workflow
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
            
            {externalAIAvailable && (
              <Button 
                type="button" 
                onClick={handleDirectN8nSubmit}
                disabled={loading || !mood}
                className="bg-green-600 hover:bg-green-700"
              >
                <Zap className="w-4 h-4 mr-1" />
                Direct n8n
              </Button>
            )}
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