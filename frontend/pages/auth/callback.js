import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function AuthCallback() {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { token, refresh, error: urlError } = router.query;

      console.log('Callback received:', { 
        token: !!token, 
        refresh: !!refresh, 
        error: urlError 
      });

      if (urlError) {
        setStatus("error");
        setError("Authentication failed. Please try again.");
        return;
      }

      if (!token) {
        setStatus("error");
        setError("Invalid authentication token.");
        return;
      }

      try {
        // Store the tokens
        localStorage.setItem("authToken", token);
        if (refresh) {
          localStorage.setItem("refreshToken", refresh);
        }

        setStatus("success");
        
        // Redirect to profile after a short delay
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      } catch (error) {
        console.error("Callback error:", error);
        setStatus("error");
        setError("Failed to complete authentication. Please try again.");
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white">
        <Card className="p-8 max-w-md w-full text-center">
          <Loader className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold text-blue-700 mb-2">Completing Sign In</h1>
          <p className="text-gray-600">Please wait while we complete your authentication...</p>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white">
        <Card className="p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-700 mb-2">Authentication Failed</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/signin")} className="w-full">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white">
      <Card className="p-8 max-w-md w-full text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-green-700 mb-2">Successfully Signed In!</h1>
        <p className="text-gray-600 mb-4">Redirecting you to your profile...</p>
        <div className="animate-pulse">
          <div className="h-2 bg-blue-200 rounded w-3/4 mx-auto"></div>
        </div>
      </Card>
    </div>
  );
} 