import { useState } from "react";
import { Button, Input, Card, Textarea } from "@/components/ui";
import { Sparkles, Brain, Zap } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Image from "next/image";

export default function DailyLog() {
  const [mood, setMood] = useState("");
  const [customMood, setCustomMood] = useState("");
  const [notes, setNotes] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [useExternalAI, setUseExternalAI] = useState(false);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState("light");

  const BACKEND_URL = 'https://nexium-wajahat-project.vercel.app/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const moodToSend = customMood.trim() ? customMood : mood;
    if (!moodToSend) return;
    
    setLoading(true);
    setSaved(false);
    
    try {
      // Save log to database
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BACKEND_URL}/daily-logs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: moodToSend,
          notes: notes || ''
        }),
      });

      if (response.ok) {
        setSaved(true);
        
        if (useExternalAI) {
          // Get suggestion from n8n
          const aiRes = await fetch(`${BACKEND_URL}/analyze-mood`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: notes || mood })
          });
          if (aiRes.ok) {
            const aiData = await aiRes.json();
            setAiSuggestion(aiData.suggestions[0]);
          } else {
            setAiSuggestion('Could not get AI suggestion.');
          }
        } else {
          // Local suggestions
          const suggestions = {
            "Happy": [
              "Based on your happy mood, try taking a short walk outside to maintain this positive energy.",
              "Share your joy with someone you care about - it can multiply your happiness.",
              "Try a new hobby or activity you've been curious about.",
              "Practice gratitude by writing down 3 things you're thankful for today."
            ],
            "Good": [
              "Build on this positive momentum with some light exercise.",
              "Connect with a friend or family member to strengthen your relationships.",
              "Try something creative like drawing or writing.",
              "Plan something enjoyable for later today."
            ],
            "Okay": [
              "Take a few deep breaths to center yourself and find inner peace.",
              "Try a short meditation or mindfulness exercise.",
              "Do something small that brings you comfort and joy.",
              "Consider talking to someone about how you're feeling."
            ],
            "Sad": [
              "Be gentle with yourself - it's okay to feel this way.",
              "Try some gentle self-care activities like a warm bath or reading.",
              "Consider reaching out to a trusted friend or family member.",
              "Remember that feelings are temporary and will pass."
            ],
            "Terrible": [
              "Please know you're not alone in this difficult time.",
              "Consider talking to a mental health professional for support.",
              "Try some grounding exercises to help you feel more present.",
              "Focus on small, manageable tasks to help you feel more in control."
            ]
          };
          const moodSuggestions = suggestions[moodToSend] || suggestions["Okay"];
          const randomSuggestion = moodSuggestions[Math.floor(Math.random() * moodSuggestions.length)];
          setAiSuggestion(randomSuggestion);
        }
        
        // Clear form
        setMood("");
        setCustomMood("");
        setNotes("");
      } else {
        console.error('Failed to save log');
      }
    } catch (error) {
      console.error('Error saving log:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className={
        `min-h-screen flex flex-col items-center pt-28 px-2 transition-colors duration-300 ` +
        (theme === "dark" ? "dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-100 via-teal-50 to-white")
      }>
        <Card className="p-8 max-w-lg w-full shadow-xl rounded-2xl border border-blue-100 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/mental-health.png" alt="Mental Health Icon" width={36} height={36} />
            <h1 className="text-2xl font-bold text-blue-700 dark:text-white">Daily Log</h1>
            <button
              className="ml-auto px-3 py-1 rounded text-xs font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="button"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
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
            <label className="block text-sm font-medium text-gray-700">Mood</label>
            <select
              className="w-full p-2 border rounded mb-2"
              value={mood}
              onChange={e => setMood(e.target.value)}
            >
              <option value="">Select your mood</option>
              <option value="Happy">Happy</option>
              <option value="Good">Good</option>
              <option value="Okay">Okay</option>
              <option value="Sad">Sad</option>
              <option value="Terrible">Terrible</option>
            </select>
            <Input
              value={customMood}
              onChange={e => setCustomMood(e.target.value)}
              placeholder="Or write your own mood..."
            />
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add any notes or thoughts..."
              rows={4}
            />
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Saving..." : "Submit & Get AI Suggestion"}
              </Button>
            </div>
          </form>
          
          {saved && (
            <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
              <p className="text-green-700 text-sm">✅ Log saved successfully!</p>
            </div>
          )}
          
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
              {useExternalAI && (
                <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-green-500" />
                  Powered by AI (n8n + Hugging Face)
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </AuthGuard>
  );
} 