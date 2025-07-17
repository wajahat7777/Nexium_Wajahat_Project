import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Card } from "@/components/ui";

export default function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md w-full text-center">
          <p className="mb-4">You must be signed in to view this page.</p>
          <Button onClick={() => signIn()} className="w-full">Sign in</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.email}</h1>
        <Button onClick={() => signOut()} className="w-full">Sign out</Button>
      </Card>
    </div>
  );
} 