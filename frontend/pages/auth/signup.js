import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/router";
import apiClient from "../../lib/api";
import { Mail, ArrowRight, UserPlus } from "lucide-react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Client-side validation
    if (!formData.email || !formData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.signup(
        formData.email, 
        null, // No password for magic link signup
        formData.first_name, 
        formData.last_name
      );
      
      setSuccess("Account created successfully! Please check your email for verification.");
      
      // Redirect to signin after a delay
      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
      
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error.message.includes("already exists")) {
        setError("An account with this email already exists. Please sign in instead.");
      } else if (error.message.includes("Invalid email")) {
        setError("Please enter a valid email address.");
      } else {
        setError(error.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailBlur = async () => {
    if (!formData.email || !formData.email.includes("@")) return;
    
    try {
      const response = await apiClient.checkUserExists(formData.email);
      if (response.exists) {
        setError("An account with this email already exists. Please sign in instead.");
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
          <UserPlus className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-blue-700">Sign up</h1>
          <p className="text-gray-600">Create your Nexium account with magic link</p>
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
          <div className="grid grid-cols-2 gap-2">
            <Input
              name="first_name"
              type="text"
              placeholder="First name"
              value={formData.first_name}
              onChange={handleChange}
              className="mb-2"
            />
            <Input
              name="last_name"
              type="text"
              placeholder="Last name"
              value={formData.last_name}
              onChange={handleChange}
              className="mb-2"
            />
          </div>
          
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            className="mb-2"
            required
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating account...
              </div>
            ) : (
              <div className="flex items-center">
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            We'll send you a verification email to complete your registration
          </p>
        </div>
      </Card>
    </div>
  );
} 