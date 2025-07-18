import { useSession, signOut } from "next-auth/react";
import { Button, Card } from "@/components/ui";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { User } from "lucide-react";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-50 to-white flex flex-col items-center pt-28 px-2">
      <Card className="p-8 max-w-md w-full text-center shadow-xl rounded-2xl border border-blue-100">
        <div className="flex items-center gap-2 justify-center mb-4">
          <User className="text-blue-500" />
          <h1 className="text-2xl font-bold">Welcome, <span className="text-blue-700">{session.user.email}</span></h1>
        </div>
        <Button onClick={() => signOut()} className="w-full mt-4">Sign out</Button>
      </Card>
    </div>
  );
} 