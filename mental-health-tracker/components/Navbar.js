import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/daily-log', label: 'Daily Log' },
  { href: '/history', label: 'History' },
  { href: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  return (
    <nav className="bg-gradient-to-r from-blue-400 to-blue-600 px-6 py-4 text-white shadow-md flex items-center justify-between">
      <div className="font-bold text-2xl tracking-tight">🧠 MindfulTrack</div>
      <div className="flex gap-6 text-lg">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition-colors px-2 py-1 rounded hover:bg-blue-700/60 hover:underline ${pathname === link.href ? 'bg-white/20 font-semibold underline' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
} 