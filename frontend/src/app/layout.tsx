import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: { default: 'Vishesham – Kerala News', template: '%s | Vishesham' },
  description:
    'AI-powered Kerala news aggregation. Latest news from Manorama, Mathrubhumi, Asianet and more.',
  openGraph: {
    siteName: 'Vishesham',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  metadataBase: new URL('https://vishesham.online'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent FOUC for dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="bg-white dark:bg-[#111110] text-gray-900 dark:text-gray-100 antialiased">
        <Navbar />
        <main className="pt-[96px] min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}