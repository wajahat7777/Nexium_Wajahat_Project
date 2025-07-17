import { getCsrfToken } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function SignIn({ csrfToken }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white">
      <Card className="p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Sign in with Magic Link</h1>
        <form method="post" action="/api/auth/signin/email">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            className="mb-4"
            required
          />
          <Button type="submit" className="w-full">Send Magic Link</Button>
        </form>
      </Card>
    </div>
  );
}

SignIn.getInitialProps = async (context) => {
  return {
    csrfToken: await getCsrfToken(context),
  }
} 