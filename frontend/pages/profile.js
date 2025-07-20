import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { User, LogOut, Plus, Calendar, Lightbulb, TrendingUp } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const router = useRouter();

  const moodSuggestions = {
    "Happy": [
      "Take a walk in nature to maintain this positive energy",
      "Share your joy with someone you care about",
      "Try a new hobby or activity you've been curious about",
      "Practice gratitude by writing down 3 things you're thankful for"
    ],
    "Good": [
      "Build on this positive momentum with some light exercise",
      "Connect with a friend or family member",
      "Try something creative like drawing or writing",
      "Plan something enjoyable for later today"
    ],
    "Okay": [
      "Take a few deep breaths to center yourself",
      "Try a short meditation or mindfulness exercise",
      "Do something small that brings you comfort",
      "Consider talking to someone about how you're feeling"
    ],
    "Sad": [
      "Be gentle with yourself - it's okay to feel this way",
      "Try some gentle self-care activities",
      "Consider reaching out to a trusted friend or family member",
      "Remember that feelings are temporary and will pass"
    ],
    "Terrible": [
      "Please know you're not alone in this",
      "Consider talking to a mental health professional",
      "Try some grounding exercises to help you feel more present",
      "Focus on small, manageable tasks to help you feel more in control"
    ]
  };

  // Load user logs from API
  const loadLogs = async () => {
    try {
      setLoadingLogs(true);
      const token = localStorage.getItem("authToken");
      
      const response = await fetch('http://localhost:3001/api/daily-logs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      } else {
        console.error('Failed to load logs');
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (!token) {
      router.push("/signin");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load user logs from API
    loadLogs();
    setLoading(false);
  }, [router]);

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    if (!mood) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      
      const response = await fetch('http://localhost:3001/api/daily-logs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood,
          notes: notes || ''
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLogs([data.log, ...logs]);
        setMood("");
        setNotes("");
        setShowSuggestions(true);
      } else {
        console.error('Failed to save log');
      }
    } catch (error) {
      console.error('Error saving log:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");
    router.push("/signin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-blue-700">Your Profile</h1>
              {user && (
                <p className="text-gray-600">Welcome back, {user.firstName || user.email}</p>
              )}
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="flex items-center">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Log Form */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Plus className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Add Daily Log</h2>
            </div>
            
            <form onSubmit={handleSubmitLog} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling today?
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select your mood</option>
                  <option value="Happy">😊 Happy</option>
                  <option value="Good">🙂 Good</option>
                  <option value="Okay">😐 Okay</option>
                  <option value="Sad">😔 Sad</option>
                  <option value="Terrible">😖 Terrible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How was your day? Any thoughts or feelings?"
                  className="w-full"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={submitting || !mood}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? "Saving..." : "Save Daily Log"}
              </Button>
            </form>
          </Card>

          {/* Mood Suggestions */}
          {showSuggestions && mood && (
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Mood Suggestions</h2>
              </div>
              
              <div className="space-y-3">
                {moodSuggestions[mood]?.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-400">
                    <p className="text-sm text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => setShowSuggestions(false)}
                variant="outline"
                className="w-full mt-4"
              >
                Hide Suggestions
              </Button>
            </Card>
          )}

          {/* Recent Logs */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Recent Logs</h2>
            </div>
            
            {loadingLogs ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : logs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No logs yet. Add your first daily log!</p>
            ) : (
              <div className="space-y-3">
                {logs.slice(0, 5).map((log) => (
                  <div key={log._id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{log.mood}</span>
                        {log.notes && (
                          <p className="text-sm text-gray-600 mt-1">{log.notes}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Mood Insights */}
        {logs.length > 0 && (
          <Card className="p-6 mt-8">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Mood Insights</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{logs.length}</div>
                <div className="text-sm text-gray-600">Total Logs</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((logs.filter(log => ['Happy', 'Good'].includes(log.mood)).length / logs.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Positive Days</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {logs.filter(log => log.mood === 'Okay').length}
                </div>
                <div className="text-sm text-gray-600">Neutral Days</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {logs.filter(log => ['Sad', 'Terrible'].includes(log.mood)).length}
                </div>
                <div className="text-sm text-gray-600">Challenging Days</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 