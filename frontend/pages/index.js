import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signin");
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white pt-32">
      <Navbar />
      <section className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div className="w-full flex flex-col items-center">
          <div className="bg-white/80 rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
            <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to Your Mental Health Tracker</h1>
            <p className="text-lg text-gray-700 mb-6">
              Track your daily mood, reflect on your progress, and take steps towards a healthier mind.
            </p>
            <div className="space-y-3">
              <a href="/profile" className="px-6 py-3 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition font-semibold inline-block">
                View Profile & Mood Tracker
              </a>
              <br />
              <a href="/daily-log" className="px-6 py-3 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition font-semibold inline-block">
                Add Daily Log
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 