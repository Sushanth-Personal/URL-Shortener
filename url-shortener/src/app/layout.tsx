// src/app/layout.tsx
import './globals.css';
import { UserProvider } from '@/contexts/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'MiniLink Management Platform',
  description: 'A platform to shorten URLs and manage links with analytics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
          <div id="modal-root"></div>
        </UserProvider>
      </body>
    </html>
  );
}