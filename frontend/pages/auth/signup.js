import { getCsrfToken } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function SignUp({ csrfToken }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white">
      <Card className="p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">Sign up</h1>
        <p className="mb-6 text-gray-600">Sign up with your email to receive a magic link.</p>
        <form method="post" action="/api/auth/signin/email" className="space-y-4">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            className="mb-2"
            required
          />
          <Button type="submit" className="w-full">Send Magic Link</Button>
        </form>
        <div className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">Sign in</Link>
        </div>
      </Card>
    </div>
  );
}

SignUp.getInitialProps = async (context) => {
  return {
    csrfToken: await getCsrfToken(context),
  }
} 