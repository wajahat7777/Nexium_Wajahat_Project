import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white/80 backdrop-blur shadow-md py-4 px-8 flex justify-between items-center fixed top-0 left-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow">M</div>
        <span className="text-2xl font-bold text-gray-800">MindfulTrack</span>
      </div>
      <div className="flex gap-8 text-lg">
        <Link href="/" className="text-gray-700 hover:text-blue-500 transition font-medium">Home</Link>
        <Link href="/daily-log" className="text-gray-700 hover:text-blue-500 transition font-medium">Daily Log</Link>
        <Link href="/history" className="text-gray-700 hover:text-blue-500 transition font-medium">History</Link>
        <Link href="/profile" className="text-gray-700 hover:text-blue-500 transition font-medium">Profile</Link>
      </div>
    </nav>
  );
} 