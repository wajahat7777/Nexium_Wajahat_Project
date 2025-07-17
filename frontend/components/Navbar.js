import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 shadow-md py-4 flex justify-center items-center">
      <div className="flex gap-6">
        <Link href="/" className="bg-white shadow rounded-lg px-6 py-3 text-lg font-medium text-blue-700 hover:bg-blue-100 transition border border-blue-200">Home</Link>
        <Link href="/daily-log" className="bg-white shadow rounded-lg px-6 py-3 text-lg font-medium text-blue-700 hover:bg-blue-100 transition border border-blue-200">Daily Log</Link>
        <Link href="/history" className="bg-white shadow rounded-lg px-6 py-3 text-lg font-medium text-blue-700 hover:bg-blue-100 transition border border-blue-200">History</Link>
        <Link href="/profile" className="bg-white shadow rounded-lg px-6 py-3 text-lg font-medium text-blue-700 hover:bg-blue-100 transition border border-blue-200">Profile</Link>
      </div>
    </nav>
  );
} 