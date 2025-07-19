import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/router";
import apiClient from "../../lib/api";
import { Mail, ArrowRight } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Client-side validation
    if (!email || !email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      await apiClient.sendMagicLink(email);
      setSuccess("Magic link sent! Check your email and click the link to sign in.");
    } catch (error) {
      console.error("Magic link error:", error);
      
      if (error.message.includes("No account found")) {
        setError("No account found with this email. Please sign up first.");
      } else if (error.message.includes("Invalid email")) {
        setError("Please enter a valid email address.");
      } else {
        setError(error.message || "Failed to send magic link. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailBlur = async () => {
    if (!email || !email.includes("@")) return;
    
    try {
      const response = await apiClient.checkUserExists(email);
      if (!response.exists) {
        setError("No account found with this email. Please sign up first.");
      } else {
        setError("");
      }
    } catch (error) {
      // Don't show error for network issues during email check
      console.log("Email check failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-blue-700">Sign in</h1>
          <p className="text-gray-600">Enter your email to receive a magic link</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              className="mb-2"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending magic link...
              </div>
            ) : (
              <div className="flex items-center">
                Send Magic Link
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            We'll send you a secure link to sign in without a password
          </p>
        </div>
      </Card>
    </div>
  );
} 