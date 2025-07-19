import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { User, LogOut, Plus, Calendar } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState({ email: "user@example.com" });
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [logs, setLogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    if (!mood) return;

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newLog = {
        id: Date.now(),
        mood,
        notes,
        created_at: new Date().toISOString()
      };
      
      setLogs([newLog, ...logs]);
      setMood("");
      setNotes("");
      setSubmitting(false);
    }, 1000);
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-blue-700">Your Profile</h1>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="flex items-center">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {/* Recent Logs */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Recent Logs</h2>
            </div>
            
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No logs yet. Add your first daily log!</p>
            ) : (
              <div className="space-y-3">
                {logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{log.mood}</span>
                        {log.notes && (
                          <p className="text-sm text-gray-600 mt-1">{log.notes}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(log.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
} 