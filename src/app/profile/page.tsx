"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  // Identity for the stats fetch and the profile cards — access is enforced
  // by `src/proxy.ts`, which redirects signed-out visitors to /login.
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [borrowedCount, setBorrowedCount] = useState<number>(0);
  const [contributedCount, setContributedCount] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch user activity statistics
  useEffect(() => {
    async function fetchUserStats() {
      if (!session?.user?.email) {
        setStatsLoading(false);
        return;
      }

      try {
        setStatsLoading(true);
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        if (!serverUrl) return;

        const email = encodeURIComponent(session.user.email);

        // Fetch borrowed count and contributed books count in parallel
        const [borrowsRes, booksRes] = await Promise.all([
          fetch(`${serverUrl}/borrows?email=${email}`, { cache: "no-store" }).catch(() => null),
          fetch(`${serverUrl}/my-books?email=${email}`, { cache: "no-store" }).catch(() => null),
        ]);

        if (borrowsRes && borrowsRes.ok) {
          const borrowsData = await borrowsRes.json();
          setBorrowedCount(Array.isArray(borrowsData) ? borrowsData.length : 0);
        }

        if (booksRes && booksRes.ok) {
          const booksData = await booksRes.json();
          setContributedCount(Array.isArray(booksData) ? booksData.length : 0);
        }
      } catch (error) {
        console.error("Error loading user stats:", error);
      } finally {
        setStatsLoading(false);
      }
    }

    if (!sessionPending) {
      fetchUserStats();
    }
  }, [session, sessionPending]);

  // Handle Logout
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Helper for Initials
  const getInitials = (name?: string) => {
    if (!name) return "BN";
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Helper for Member Since Date
  const formatDate = (dateValue?: Date | string | number) => {
    if (!dateValue) return "Member";
    try {
      const date = new Date(dateValue);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return String(dateValue);
    }
  };

  // The proxy already guarantees a session on every request to this route,
  // so this is purely the brief window while `useSession()` resolves — it is
  // a loading state, not an access check.
  if (sessionPending || !session?.user) {
    return (
      <div className="w-full min-h-[70vh] bg-[#F1F6F9] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0F4A6B]/20 border-t-[#0F4A6B] rounded-full animate-spin" />
          <p className="text-sm font-medium text-[#64748B]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="w-full min-h-screen bg-[#F1F6F9] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* User Hero Banner Card */}
        <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E2EEF6] shadow-sm">
          {/* Top Decorative Gradient Banner */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-[#0F4A6B] via-[#0C3B56] to-[#0A2F45] relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute right-1/3 -bottom-10 w-36 h-36 rounded-full bg-[#F97316]/10 pointer-events-none" />
          </div>

          {/* Profile Header Details */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
              {/* User Avatar */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#0C3B56] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center shrink-0">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    fill
                    sizes="128px"
                    className="object-cover object-center"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-extrabold text-white select-none">
                    {getInitials(user.name)}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 self-center sm:self-end">
                <Link
                  href="/my-borrows"
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#0F4A6B] bg-[#EAF2F8] hover:bg-[#D5E4EF] transition-colors"
                >
                  My Borrows
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </div>

            {/* User Name & Badges */}
            <div className="mt-4 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Reader
                </span>
              </div>
              <p className="text-sm text-[#64748B] mt-1">{user.email}</p>
            </div>
          </div>
        </div>

        {/* 3 Activity Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Books Borrowed */}
          <Link
            href="/my-borrows"
            className="group p-6 rounded-2xl bg-white border border-[#E2EEF6] shadow-sm hover:shadow-md hover:border-[#0F4A6B]/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Books Borrowed
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#EAF2F8] text-[#0F4A6B] flex items-center justify-center group-hover:bg-[#0F4A6B] group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-black text-[#0F172A]">
              {statsLoading ? "..." : borrowedCount}
            </p>
            <p className="text-xs text-[#0F4A6B] font-semibold mt-2 group-hover:underline">
              View active borrows →
            </p>
          </Link>

          {/* Card 2: Books Contributed */}
          <Link
            href="/my-books"
            className="group p-6 rounded-2xl bg-white border border-[#E2EEF6] shadow-sm hover:shadow-md hover:border-[#F97316]/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Books Listed
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] text-[#F97316] flex items-center justify-center group-hover:bg-[#F97316] group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-black text-[#0F172A]">
              {statsLoading ? "..." : contributedCount}
            </p>
            <p className="text-xs text-[#F97316] font-semibold mt-2 group-hover:underline">
              Manage your shelf →
            </p>
          </Link>

          {/* Card 3: Membership Status */}
          <div className="p-6 rounded-2xl bg-white border border-[#E2EEF6] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Membership Tier
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-black text-[#0F172A]">Community Pass</p>
            <p className="text-xs text-slate-500 mt-2">Unlimited free reader access</p>
          </div>
        </div>

        {/* Account Details Form Card */}
        <div className="rounded-3xl bg-white border border-[#E2EEF6] shadow-sm p-6 sm:p-10 space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                Personal Information
              </h2>
              <p className="text-xs text-[#64748B]">
                Your registered BookNook account details
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F6F9] text-[#0F4A6B]">
              Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E293B]">Full Name</label>
              <input
                type="text"
                value={user.name || ""}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-[#0F172A] cursor-not-allowed select-none focus:outline-none"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E293B]">Email Address</label>
              <input
                type="email"
                value={user.email || ""}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-[#0F172A] cursor-not-allowed select-none focus:outline-none"
              />
            </div>

            {/* Member Since */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E293B]">Member Since</label>
              <input
                type="text"
                value={formatDate(user.createdAt)}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-[#0F172A] cursor-not-allowed select-none focus:outline-none"
              />
            </div>

            {/* Account Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E293B]">Account Role</label>
              <input
                type="text"
                value="Community Contributor & Reader"
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-[#0F172A] cursor-not-allowed select-none focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Quick Links Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0F4A6B] to-[#0C3B56] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Have a book to share?</h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              List books from your home shelf and let fellow avid readers borrow them.
            </p>
          </div>
          <Link
            href="/add-book"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#F97316] hover:bg-[#EA580C] shadow-md transition-colors shrink-0"
          >
            <span>Add a Book Now</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}