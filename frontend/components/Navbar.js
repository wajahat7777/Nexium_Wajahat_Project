import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { ThemeContext } from "../pages/_app";

export default function Navbar() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <nav className={
      `fixed top-0 left-0 w-full z-50 py-4 flex justify-between items-center px-6 transition-colors duration-300 ` +
      (theme === "dark"
        ? "bg-blue-900/95 shadow-lg"
        : "bg-white/90 shadow-md")
    }>
      <div className="flex items-center gap-3">
        <Image src="/mental-health.png" alt="Mental Health Icon" width={36} height={36} />
        <span className={
          `text-xl font-bold tracking-tight select-none ` +
          (theme === "dark" ? "text-white" : "text-blue-700")
        }>
          Mental Health Tracker
        </span>
      </div>
      <div className="flex gap-4">
        <Link href="/" className={
          `rounded-lg px-4 py-2 text-lg font-medium border transition ` +
          (theme === "dark"
            ? "bg-blue-800 text-white border-blue-700 hover:bg-blue-700"
            : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100")
        }>Home</Link>
        <Link href="/daily-log" className={
          `rounded-lg px-4 py-2 text-lg font-medium border transition ` +
          (theme === "dark"
            ? "bg-blue-800 text-white border-blue-700 hover:bg-blue-700"
            : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100")
        }>Daily Log</Link>
        <Link href="/history" className={
          `rounded-lg px-4 py-2 text-lg font-medium border transition ` +
          (theme === "dark"
            ? "bg-blue-800 text-white border-blue-700 hover:bg-blue-700"
            : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100")
        }>History</Link>
        <Link href="/profile" className={
          `rounded-lg px-4 py-2 text-lg font-medium border transition ` +
          (theme === "dark"
            ? "bg-blue-800 text-white border-blue-700 hover:bg-blue-700"
            : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100")
        }>Profile</Link>
        <button
          className={
            `ml-4 px-3 py-1 rounded text-xs font-medium border transition ` +
            (theme === "dark"
              ? "border-blue-700 bg-blue-800 text-white hover:bg-blue-700"
              : "border-blue-200 bg-white text-blue-700 hover:bg-blue-100")
          }
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          type="button"
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
} 