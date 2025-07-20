import { useState, useEffect } from "react";
import { Card } from "@/components/ui";
import { Clock, Filter, Calendar, TrendingUp } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function History() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMood, setSelectedMood] = useState("");
  const [stats, setStats] = useState(null);

  const loadLogs = async (page = 1, mood = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      
      let url = `http://localhost:3001/api/daily-logs?page=${page}&limit=10`;
      if (mood) {
        url += `&mood=${mood}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(page);
      } else {
        console.error('Failed to load logs');
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch('http://localhost:3001/api/daily-logs/stats/mood', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || []);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    loadLogs();
    loadStats();
  }, []);

  const handleMoodFilter = (mood) => {
    setSelectedMood(mood);
    loadLogs(1, mood);
  };

  const handlePageChange = (page) => {
    loadLogs(page, selectedMood);
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      "Happy": "😊",
      "Good": "🙂", 
      "Okay": "😐",
      "Sad": "😔",
      "Terrible": "😖"
    };
    return emojis[mood] || "😐";
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-50 to-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <Clock className="text-blue-500" />
            <h1 className="text-3xl font-bold text-blue-700">Your History</h1>
          </div>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <Card className="p-6 mb-8">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Mood Statistics</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.map((stat) => (
                  <div key={stat._id} className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">{getMoodEmoji(stat._id)}</div>
                    <div className="text-lg font-bold text-blue-600">{stat.count}</div>
                    <div className="text-sm text-gray-600">{stat._id}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Filter by Mood</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleMoodFilter("")}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedMood === "" 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {["Happy", "Good", "Okay", "Sad", "Terrible"].map((mood) => (
                <button
                  key={mood}
                  onClick={() => handleMoodFilter(mood)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedMood === mood 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {getMoodEmoji(mood)} {mood}
                </button>
              ))}
            </div>
          </Card>

          {/* Logs */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Your Daily Logs</h2>
              </div>
              {selectedMood && (
                <span className="text-sm text-gray-600">
                  Filtered by: {getMoodEmoji(selectedMood)} {selectedMood}
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No logs found</h3>
                <p className="text-gray-500">
                  {selectedMood 
                    ? `No logs found for ${selectedMood} mood.` 
                    : "Start tracking your daily mood to see your history here."
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getMoodEmoji(log.mood)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-800">{log.mood}</h3>
                          {log.notes && (
                            <p className="text-gray-600 mt-1">{log.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded border ${
                        currentPage === page 
                          ? 'bg-blue-500 text-white' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
} 