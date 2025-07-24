import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Head from 'next/head'
import { createContext, useState, useMemo } from 'react';

export const ThemeContext = createContext();

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <Head>
        <link rel="icon" href="/mental-health.png" />
        <meta name="theme-color" content={theme === 'dark' ? '#0a2342' : '#e0f2fe'} />
      </Head>
      <div className={
        (theme === 'dark'
          ? 'min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900'
          : 'min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200')
      }>
        <Navbar />
        <div style={{ marginTop: '80px' }}>
          <Component {...pageProps} />
        </div>
      </div>
    </ThemeContext.Provider>
  )
} 