"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/** Derive a short display initial (e.g. "Ada Lovelace" → "AL"). */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "BN";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Navbar() {
  const router = useRouter();

  // Real Better Auth session state.
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;
  const isLoggedIn = Boolean(user);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Real sign-out: clears the session cookie server-side, then refreshes
  // any cached server components so the UI reflects the logged-out state.
  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  // Public navigation links
  const publicLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/all-books" },
  ];

  // Private navigation links (only shown to signed-in users)
  const privateLinks = [
    { name: "Add Book", href: "/add-book" },
    { name: "My Books", href: "/my-books" },
    { name: "My Borrows", href: "/my-borrows" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0F4A6B] text-white shadow-md transition-colors duration-200">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white transition-all duration-200 shadow-sm">
                {/* BookNook Open Book Icon */}
                <svg
                  className="w-6 h-6 transition-transform duration-200 group-hover:scale-105"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-slate-100">
                Book<span className="text-[#F97316]">Nook</span>
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {publicLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* Private Navigation Links (signed-in users only) */}
            {isLoggedIn &&
              privateLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
          </nav>

          {/* Right: Actions, Theme Toggle & Auth State */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle (Dark / Light Mode Icon Button) */}
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isDarkMode ? (
                // Sun Icon (Light Mode)
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                // Moon Icon (Dark Mode)
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Auth Buttons: Logged Out vs Logged In */}
            {isPending ? (
              // Session is still resolving — show a neutral placeholder so the
              // Login/Register buttons don't flash for signed-in users.
              <div className="h-9 w-40 rounded-lg bg-white/10 animate-pulse" aria-hidden="true" />
            ) : !isLoggedIn ? (
              // Logged Out State: Login & Register Buttons
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] rounded-lg shadow-sm transition-all duration-150 hover:shadow"
                >
                  Register
                </Link>
              </div>
            ) : (
              // Logged In State: User Avatar & Dropdown Menu
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-[#F97316]/50 transition-all cursor-pointer"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                >
                  {/* User Avatar (image when available, otherwise initials) */}
                  <div className="w-9 h-9 rounded-full bg-[#0C3B56] border-2 border-[#F97316] flex items-center justify-center font-bold text-sm text-white shadow-sm overflow-hidden">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User avatar"}
                        width={36}
                        height={36}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="select-none">{getInitials(user?.name ?? "")}</span>
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 text-slate-200 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white text-[#0F172A] shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-medium text-[#64748B]">Signed in as</p>
                      <p className="text-sm font-semibold text-[#0F172A] truncate">
                        {user?.name || "BookNook Reader"}
                      </p>
                      <p className="text-xs text-[#64748B] truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1E293B] hover:bg-[#F1F6F9] hover:text-[#0F4A6B] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        href="/my-borrows"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1E293B] hover:bg-[#F1F6F9] hover:text-[#0F4A6B] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        My Borrows
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1E293B] hover:bg-[#F1F6F9] hover:text-[#0F4A6B] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {isSigningOut ? "Logging out…" : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Mobile: Hamburger Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0C3B56] border-t border-[#135A82] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold tracking-wider uppercase text-slate-400">Navigation</p>
            {publicLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {isLoggedIn && (
              <>
                <p className="px-3 pt-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">Library Actions</p>
                {privateLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-100 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Mobile Auth / Profile Section */}
          <div className="pt-3 border-t border-[#135A82]">
            {isPending ? (
              <div className="space-y-2" aria-hidden="true">
                <div className="h-12 rounded-lg bg-white/10 animate-pulse" />
                <div className="h-9 rounded-lg bg-white/10 animate-pulse" />
              </div>
            ) : !isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-white/10 rounded-lg transition-colors border border-white/20"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] rounded-lg shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-[#0F4A6B] border-2 border-[#F97316] flex items-center justify-center font-bold text-sm text-white overflow-hidden">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User avatar"}
                        width={40}
                        height={40}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="select-none">{getInitials(user?.name ?? "")}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.name || "BookNook Reader"}
                    </p>
                    <p className="text-xs text-slate-300 truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/10 transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/10 transition-colors"
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                  >
                    {isSigningOut ? "Logging out…" : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
