"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
// import BorrowCard from "@/components/books/BorrowCard";
import { BorrowRecord } from "@/type";
import { authClient } from "@/lib/auth-client";
import BorrowCard from "@/components/shared/BorrowCard";

export default function MyBorrowsPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Fetch active borrowings for the authenticated user
  useEffect(() => {
    async function fetchMyBorrows() {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        const res = await fetch(`${serverUrl}/borrows?email=${encodeURIComponent(session.user.email)}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch borrowed books");
        }

        const data = await res.json();
        setBorrows(Array.isArray(data) ? data : data.borrows || []);
      } catch (err) {
        console.error("Error fetching my borrows:", err);
      } finally {
        setLoading(false);
      }
    }

    if (!sessionPending) {
      fetchMyBorrows();
    }
  }, [session, sessionPending]);

  // Handle Returning a book: deletes from borrows, triggers backend stock increment, updates UI
  const handleReturnBook = async (borrowId: string, bookId: string) => {
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      const res = await fetch(`${serverUrl}/borrows/${borrowId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to return book");
      }

      // Immediately remove from local state so the item leaves the page instantly
      setBorrows((prev) => prev.filter((b) => (b._id || b.id) !== borrowId));

      setNotification("Book returned successfully! Stock has been updated.");
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error("Error returning book:", err);
      alert("Failed to return the book. Please try again.");
    }
  };

  // 1. Session Loading State
  if (sessionPending) {
    return (
      <div className="w-full min-h-[65vh] bg-[#F1F6F9] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0F4A6B]/20 border-t-[#0F4A6B] rounded-full animate-spin" />
          <p className="text-sm font-medium text-[#64748B]">Checking your session...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State (Prompt to sign in)
  if (!session?.user) {
    return (
      <div className="w-full min-h-[70vh] bg-[#F1F6F9] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2EEF6] p-8 sm:p-10 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF2F8] text-[#0F4A6B] flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Sign in required</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Please log in with your BookNook account to view and manage your borrowed books.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-[#0F4A6B] hover:bg-[#0C3B56] shadow-sm transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F1F6F9] py-8 sm:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#FFF4ED] text-[#F97316] border border-[#F97316]/20 shadow-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
              Member Activity
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              My Borrows
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] mt-1.5 max-w-xl">
              Track your borrowed books, monitor return deadlines, and return books easily.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-white text-xs sm:text-sm font-semibold text-[#0F4A6B] border border-[#E2EEF6] shadow-xs">
              {borrows.length} {borrows.length === 1 ? "Book Borrowed" : "Books Borrowed"}
            </span>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0F4A6B] hover:bg-[#0C3B56] shadow-xs transition-colors"
            >
              Borrow More
            </Link>
          </div>
        </div>

        {/* Success Alert Notification */}
        {notification && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2.5 animate-in fade-in duration-200 shadow-xs">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{notification}</span>
          </div>
        )}

        {/* Content Body */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-[#E2EEF6] p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-[#0F4A6B]/20 border-t-[#0F4A6B] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading your borrowings...</p>
          </div>
        ) : borrows.length > 0 ? (
          <div className="bg-white rounded-3xl border border-[#E2EEF6] shadow-sm overflow-hidden">
            {/* Desktop Table View (Matching attached image layout) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#111827] text-slate-300 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                    <th scope="col" className="py-4 px-6">Image</th>
                    <th scope="col" className="py-4 px-6">Title</th>
                    <th scope="col" className="py-4 px-6">Borrow Date</th>
                    <th scope="col" className="py-4 px-6">Return Date</th>
                    <th scope="col" className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {borrows.map((borrow) => (
                    <BorrowCard
                      key={borrow._id || borrow.id}
                      borrow={borrow}
                      onReturn={handleReturnBook}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card View */}
            <div className="md:hidden p-4 space-y-3">
              {borrows.map((borrow) => (
                <BorrowCard
                  key={borrow._id || borrow.id}
                  borrow={borrow}
                  onReturn={handleReturnBook}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State when no borrowings */
          <div className="bg-white rounded-3xl border border-[#E2EEF6] p-10 sm:p-16 text-center max-w-lg mx-auto shadow-sm my-6">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF2F8] text-[#0F4A6B] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">No Borrowed Books</h3>
            <p className="text-sm text-[#64748B] mb-6">
              You haven&apos;t borrowed any books from BookNook yet. Browse our collection and pick your favorite title!
            </p>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#0F4A6B] hover:bg-[#0C3B56] shadow-sm transition-all"
            >
              Browse Books
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}