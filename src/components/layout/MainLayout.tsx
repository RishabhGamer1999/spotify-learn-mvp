import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      <Sidebar />
      <main className="md:ml-64 min-h-screen pb-24 md:pb-36 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
