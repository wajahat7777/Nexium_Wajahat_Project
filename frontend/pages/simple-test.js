import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function SimpleTest() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendMagicLink = async () => {
    if (!email) {
      setMessage("Please enter an email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch('http://localhost:3001/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Magic link sent! Check your email.");
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white">
      <Card className="p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Simple Auth Test
        </h1>
        
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your real email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Button 
            onClick={sendMagicLink} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </Button>
          
          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 