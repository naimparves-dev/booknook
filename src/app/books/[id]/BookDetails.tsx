
"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Book } from "@/type";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface BookDetailsProps {
  params: Promise<{ id: string }>;
}

export default function BookDetails({ params }: BookDetailsProps) {
  const { id } = use(params);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // Real Better Auth session — the borrower's identity comes from here.
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const user = session?.user ?? null;

  useEffect(() => {
    async function loadBook() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books/${id}`);
        const data = await res.json();
        setBook(data.book || data);
      } catch (err) {
        console.error("Failed to load book:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [id]);

  // Handle Confirm Borrow
  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || book.totalCopies <= 0 || isSubmitting) return;

    // Guard against submitting without a session (e.g. cookie expired).
    if (!user) {
      setIsOpen(false);
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    const borrowData = {
      bookId: book._id || id,
      bookTitle: book.bookTitle,
      bookImage: book.bookImage,
      authorName: book.authorName,
      category: book.category,
      userName: user.name,
      userEmail: user.email,
      borrowDate: new Date().toISOString().split("T")[0],
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Borrowed",
    };

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/borrows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(borrowData),
      });

      // Update state locally
      setBook((prev) => (prev ? { ...prev, totalCopies: prev.totalCopies - 1 } : null));
      setIsOpen(false);
    } catch (err) {
      console.error("Borrow error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only signed-in users may open the borrow dialog; everyone else is
  // redirected to the login screen.
  const handleBorrowClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsOpen(true);
  };

  if (loading || !book) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-[#F1F6F9] text-slate-500">
        Loading...
      </div>
    );
  }

  const isOutOfStock = book.totalCopies <= 0;

  return (
    <div className="w-full min-h-screen bg-[#F1F6F9] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F4A6B]"
          >
            ← Back to all books
          </Link>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-3xl border border-[#E2EEF6] p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden bg-[#EAF2F8] border border-slate-200">
                {book.bookImage && (
                  <Image
                    src={book.bookImage}
                    alt={book.bookTitle}
                    fill
                    priority
                    unoptimized
                    className="object-cover object-center"
                  />
                )}
              </div>
            </div>

            {/* Right Information */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF4ED] text-[#F97316] mb-3">
                  {book.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                  {book.bookTitle}
                </h1>
                <p className="text-base text-[#64748B] mt-2">
                  by <span className="text-[#1E293B] font-semibold">{book.authorName}</span>
                </p>
                <p className="text-sm text-[#475569] mt-4 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Added By & Copies Box */}
              <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2EEF6] p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-[#64748B] font-semibold">Added by</p>
                  <p className="font-bold text-[#0F172A]">{book.username}</p>
                  <p className="text-xs text-[#64748B]">{book.userEmail}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-[#64748B] font-semibold">Copies left</p>
                  <p className={`text-3xl font-extrabold ${isOutOfStock ? "text-red-500" : "text-[#0F4A6B]"}`}>
                    {book.totalCopies}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  disabled={isOutOfStock || isSessionPending}
                  onClick={handleBorrowClick}
                  className="px-7 py-3.5 rounded-xl font-semibold text-white bg-[#0F4A6B] hover:bg-[#0C3B56] disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isOutOfStock ? "Out of Stock" : "Borrow This Book"}
                </button>

                <Link
                  href="/books"
                  className="px-5 py-3.5 rounded-xl text-sm font-medium text-[#0F4A6B] border border-[#D5E4EF] hover:bg-[#EAF2F8]"
                >
                  Back to all books
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shadcn Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-md bg-[#111827] text-white border border-slate-800 rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Borrow &ldquo;{book.bookTitle}&rdquo;
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              You can keep this book for 7 days.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBorrow} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300">User Name</label>
              <input
                type="text"
                value={user?.name ?? ""}
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-[#1E293B] border border-slate-700 text-sm text-slate-200 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300">User Email</label>
              <input
                type="email"
                value={user?.email ?? ""}
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-[#1E293B] border border-slate-700 text-sm text-slate-200 cursor-not-allowed"
              />
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#A7F3D0] text-[#064E3B] hover:bg-[#6EE7B7] cursor-pointer"
              >
                {isSubmitting ? "Borrowing..." : "Confirm Borrow"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
