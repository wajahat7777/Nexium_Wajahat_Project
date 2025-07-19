import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TestAuth() {
  const [status, setStatus] = useState("");
  const router = useRouter();

  const testSimpleAuth = () => {
    setStatus("Testing simple authentication...");
    
    // Simulate authentication
    localStorage.setItem("authToken", "demo-token-" + Date.now());
    localStorage.setItem("userEmail", "test@example.com");
    
    setStatus("Authentication successful! Redirecting to profile...");
    
    setTimeout(() => {
      router.push("/profile");
    }, 2000);
  };

  const clearAuth = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setStatus("Authentication cleared!");
  };

  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");
    
    if (token && email) {
      setStatus(`Authenticated as: ${email}`);
    } else {
      setStatus("Not authenticated");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Auth Test</h1>
          <p className="text-gray-600">Test authentication bypass</p>
        </div>

        <div className="space-y-4">
          <Button onClick={testSimpleAuth} className="w-full bg-green-600 hover:bg-green-700">
            Test Simple Auth
          </Button>
          
          <Button onClick={checkAuth} className="w-full bg-blue-600 hover:bg-blue-700">
            Check Auth Status
          </Button>
          
          <Button onClick={clearAuth} className="w-full bg-red-600 hover:bg-red-700">
            Clear Auth
          </Button>
          
          <Button onClick={() => router.push("/auth/simple-login")} className="w-full bg-purple-600 hover:bg-purple-700">
            Go to Simple Login
          </Button>
        </div>

        {status && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">{status}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            This bypasses the complex Supabase authentication
          </p>
        </div>
      </Card>
    </div>
  );
} 