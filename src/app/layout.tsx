import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sales Forecasting Engine',
  description: 'Upload data, configure forecasting methods, visualize trends, and export results',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-14 items-center">
              <div className="flex items-center space-x-8">
                <a href="/" className="text-lg font-semibold text-gray-900">
                  Sales Forecast
                </a>
                <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                  Dashboard
                </a>
                <a href="/upload" className="text-sm text-gray-600 hover:text-gray-900">
                  Upload
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
