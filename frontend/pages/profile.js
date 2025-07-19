import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Card } from "@/components/ui";
import { User, LogOut, Settings } from "lucide-react";
import apiClient from "../lib/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have tokens in URL (from magic link)
        const { token, refresh } = router.query;
        
        if (token) {
          console.log('Token received from URL, storing in localStorage');
          localStorage.setItem('authToken', token);
          if (refresh) {
            localStorage.setItem('refreshToken', refresh);
          }
        }

        const storedToken = localStorage.getItem('authToken');
        if (!storedToken) {
          router.replace("/auth/proper-login");
          return;
        }

        // For demo purposes, create a simple user object
        if (storedToken.startsWith('demo-token-') || storedToken.startsWith('simple-token-')) {
          const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
          setUser({
            id: 'demo-user-id',
            email: userEmail,
            created_at: new Date().toISOString()
          });
          setProfile({
            id: 'demo-user-id',
            first_name: 'Demo',
            last_name: 'User',
            email: userEmail
          });
        } else {
          // For real Supabase tokens, get user from API
          try {
            const response = await apiClient.getCurrentUser();
            setUser(response.user);
            setProfile(response.profile);
          } catch (error) {
            console.error("API auth check error:", error);
            setError("Authentication failed. Please sign in again.");
            localStorage.removeItem('authToken');
            router.replace("/auth/proper-login");
            return;
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setError("Authentication failed. Please sign in again.");
        localStorage.removeItem('authToken');
        router.replace("/auth/simple-login");
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      checkAuth();
    }
  }, [router.isReady, router.query]);

  const handleSignOut = async () => {
    try {
      await apiClient.signout();
      router.push("/auth/proper-login");
    } catch (error) {
      console.error("Signout error:", error);
      // Force redirect even if signout fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      router.push("/auth/proper-login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-50 to-white flex flex-col items-center pt-28 px-2">
        <Card className="p-8 max-w-md w-full text-center shadow-xl rounded-2xl border border-red-100">
          <div className="text-red-600 mb-4">
            <User className="w-12 h-12 mx-auto mb-2" />
            <h1 className="text-xl font-bold">Authentication Error</h1>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button onClick={() => router.push("/auth/signin")} className="w-full">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-50 to-white flex flex-col items-center pt-28 px-2">
      <Card className="p-8 max-w-md w-full text-center shadow-xl rounded-2xl border border-blue-100">
        <div className="flex items-center gap-2 justify-center mb-4">
          <User className="text-blue-500" />
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
        
        <div className="text-left mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded">
              {user.email}
            </p>
          </div>
          
          {profile && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">
                  {profile.first_name} {profile.last_name}
                </p>
              </div>
              
              {profile.bio && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">
                    {profile.bio}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => router.push("/daily-log")} 
            className="w-full"
          >
            Daily Log
          </Button>
          
          <Button 
            onClick={() => router.push("/history")} 
            className="w-full"
            variant="outline"
          >
            View History
          </Button>
          
          <Button 
            onClick={handleSignOut} 
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
} 