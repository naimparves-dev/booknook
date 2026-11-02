"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const publicLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/all-books" },
];

const privateLinks = [
  { name: "Add Book", href: "/add-book" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    setIsMobileOpen(false);
    await authClient.signOut();
    router.refresh();
  };

  const navLinks = user ? [...publicLinks, ...privateLinks] : publicLinks;

  // Reusable Avatar Renderer
  const renderAvatar = (size = 36) => (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-[#0C3B56] border-2 border-[#F97316] flex items-center justify-center font-bold text-sm text-white overflow-hidden shadow-xs shrink-0"
    >
      {user?.image ? (
        <Image
          src={user.image}
          alt={user.name || "Avatar"}
          width={size}
          height={size}
          unoptimized
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{(user?.name?.[0] || "U").toUpperCase()}</span>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0F4A6B] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white transition-all shadow-xs">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Book<span className="text-[#F97316]">Nook</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Auth States */}
            {isPending ? (
              <div className="h-9 w-32 rounded-lg bg-white/10 animate-pulse" />
            ) : !user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] rounded-lg shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : (
              /* User Profile Dropdown */
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#F97316]/50 cursor-pointer transition-all"
                >
                  {renderAvatar(36)}
                  <svg
                    className={`w-4 h-4 text-slate-200 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-[#0F172A] shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-[#64748B]">Signed in as</p>
                      <p className="text-sm font-bold truncate">{user.name || "Reader"}</p>
                      <p className="text-xs text-[#64748B] truncate">{user.email}</p>
                    </div>

                    <div className="py-1 text-sm text-[#1E293B]">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 hover:bg-[#F1F6F9] hover:text-[#0F4A6B] transition-colors"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/my-borrows"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 hover:bg-[#F1F6F9] hover:text-[#0F4A6B] transition-colors"
                      >
                        My Borrows
                      </Link>
                      <Link
                        href="/my-books"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 hover:bg-[#F1F6F9] hover:text-[#0F4A6B] transition-colors"
                      >
                        My Books
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
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

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden bg-[#0C3B56] border-t border-[#135A82] px-4 py-4 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-100 hover:bg-white/10"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#135A82]">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium border border-white/20 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold bg-[#F97316] rounded-lg"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl">
                  {renderAvatar(40)}
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-xs text-slate-300 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    My Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-lg text-red-300 hover:bg-red-500/20 cursor-pointer"
                  >
                    Logout
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