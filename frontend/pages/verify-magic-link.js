import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyMagicLink() {
  const [status, setStatus] = useState("verifying"); // "verifying", "success", "error"
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const { token } = router.query;

      if (!token) {
        setStatus("error");
        setMessage("No token provided");
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/auth/verify-magic-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store authentication data
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userData", JSON.stringify(data.user));
          
          setStatus("success");
          setMessage("Login successful! Redirecting to your profile...");
          
          // Redirect to profile after a short delay
          setTimeout(() => {
            router.push("/profile");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    };

    if (router.isReady) {
      verifyToken();
    }
  }, [router.isReady, router.query]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white">
      <Card className="p-8 max-w-md w-full text-center">
        {status === "verifying" && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying your magic link...</h2>
            <p className="text-gray-600">Please wait while we verify your authentication.</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push("/signin")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </Card>
    </div>
  );
} 