import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-white/80 rounded-2xl shadow-lg p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to MindfulTrack</h1>
        <p className="text-lg text-gray-700 mb-8">Your personal space to track your mood, reflect, and grow. Start your journey to better mental health today.</p>
        <a href="/daily-log" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition font-semibold text-lg">Start Logging</a>
      </div>
    </div>
  );
}
