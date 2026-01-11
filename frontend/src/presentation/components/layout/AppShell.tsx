'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  const openMobileNav = useCallback(() => setIsMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setIsMobileNavOpen(false), []);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar className="min-h-screen" />
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-gray-900 text-white border-b border-gray-800">
        <div className="h-14 px-4 flex items-center gap-3">
          <button
            type="button"
            onClick={openMobileNav}
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Abrir menú"
          >
            <span className="text-xl">☰</span>
          </button>
          <div className="font-semibold">📦 Inventario</div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-40 ${isMobileNavOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!isMobileNavOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${isMobileNavOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMobileNav}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 left-0 h-full w-72 max-w-[85vw] transform transition-transform ${
            isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-14 px-4 flex items-center justify-between bg-gray-900 text-white border-b border-gray-800">
            <div className="font-semibold">Menú</div>
            <button
              type="button"
              onClick={closeMobileNav}
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Cerrar menú"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
          <Sidebar className="h-[calc(100vh-3.5rem)]" onNavigate={closeMobileNav} />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden md:overflow-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
