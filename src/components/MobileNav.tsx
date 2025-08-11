'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface MobileNavProps {
  active?: 'home' | 'browse' | 'playlists' | 'search';
}

export default function MobileNav({ active }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
    } else {
      buttonRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
  const [closeReason, setCloseReason] = useState<null | 'escape' | 'overlay' | 'link'>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
    } else if (closeReason === 'escape' || closeReason === 'overlay') {
      buttonRef.current?.focus();
    }
    if (!open) {
      setCloseReason(null);
    }
  }, [open, closeReason]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCloseReason('escape');
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };
  const linkClasses = (name: string) =>
    name === active
      ? 'text-white font-semibold'
      : 'text-purple-200 hover:text-white transition-colors';

  return (
    <div className="flex items-center">
      {/* Desktop navigation */}
      <nav className="hidden md:flex space-x-8">
        <Link href="/" className={linkClasses('home')}>
          Home
        </Link>
        <a href="#" className={linkClasses('browse')}>
          Browse
        {/* Browse link removed until route is implemented */}
        <a href="#" className={linkClasses('playlists')}>
          Playlists
        </a>
        <Link href="/search" className={linkClasses('search')}>
          Search
        </Link>
      </nav>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          ref={buttonRef}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="p-2 text-purple-200 hover:text-white focus:outline-none"
        >
          <Bars3Icon className="h-6 w-6" />
          <span className="sr-only">Open navigation</span>
        </button>
      </div>

      {/* Mobile navigation panel */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleOverlayClick}
      >
        <div
          className={`absolute top-0 right-0 w-64 h-full bg-slate-900 shadow-lg transform transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-purple-200 hover:text-white focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
              <span className="sr-only">Close navigation</span>
            </button>
          </div>
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="/"
              className={linkClasses('home')}
              onClick={() => setOpen(false)}
              ref={firstLinkRef}
            >
              Home
            </Link>
            <a
              href="#"
              className={linkClasses('browse')}
              onClick={() => setOpen(false)}
            >
              Browse
            </a>
            <a
              href="#"
              className={linkClasses('playlists')}
              onClick={() => setOpen(false)}
            >
              Playlists
            </a>
            <Link
              href="/search"
              className={linkClasses('search')}
              onClick={() => setOpen(false)}
            >
              Search
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

