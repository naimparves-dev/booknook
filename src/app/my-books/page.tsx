"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
// import MyBookCard from "@/components/books/MyBookCard";
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
import MyBookCard from "@/components/shared/MyBookCard";

export default function MyBooksPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Edit Modal State
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch books added by this authenticated user
  useEffect(() => {
    async function fetchMyBooks() {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        // Fetches by userEmail query parameter
        const res = await fetch(`${serverUrl}/my-books?email=${encodeURIComponent(session.user.email)}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch your books");
        }

        const data = await res.json();
        setBooks(Array.isArray(data) ? data : data.books || []);
      } catch (err) {
        console.error("Error fetching my books:", err);
      } finally {
        setLoading(false);
      }
    }

    if (!sessionPending) {
      fetchMyBooks();
    }
  }, [session, sessionPending]);

  // Handle Delete Book
  const handleDeleteBook = async (bookId: string) => {
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      const res = await fetch(`${serverUrl}/books/${bookId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete book");
      }

      // Immediately filter out from UI
      setBooks((prev) => prev.filter((b) => (b._id || b.id) !== bookId));
      setNotification("Book deleted successfully!");
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete the book. Please try again.");
    }
  };

  // Handle Edit Submit
  const handleUpdateBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBook) return;

    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      bookTitle: String(formData.get("bookTitle") || ""),
      authorName: String(formData.get("authorName") || ""),
      category: String(formData.get("category") || ""),
      totalCopies: Number(formData.get("totalCopies") || 1),
      bookImage: String(formData.get("bookImage") || ""),
      description: String(formData.get("description") || ""),
    };

    const bookId = editingBook._id || editingBook.id;

    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      const res = await fetch(`${serverUrl}/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error("Failed to update book");
      }

      // Update local state
      setBooks((prev) =>
        prev.map((b) =>
          (b._id || b.id) === bookId ? { ...b, ...updatedData } : b
        )
      );

      setEditingBook(null);
      setNotification("Book details updated successfully!");
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update book. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 1. Session Loading
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

  // 2. Unauthenticated State
  if (!session?.user) {
    return (
      <div className="w-full min-h-[70vh] bg-[#F1F6F9] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2EEF6] p-8 sm:p-10 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF2F8] text-[#0F4A6B] flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Sign in required</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Please log in to manage your contributed books in the BookNook community library.
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
              Contributor Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              My Books
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] mt-1.5 max-w-xl">
              Books you have added to the community library. You can update their details or remove them.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-white text-xs sm:text-sm font-semibold text-[#0F4A6B] border border-[#E2EEF6] shadow-xs">
              {books.length} {books.length === 1 ? "Book Listed" : "Books Listed"}
            </span>
            <Link
              href="/add-book"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0F4A6B] hover:bg-[#0C3B56] shadow-xs transition-colors"
            >
              <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Book</span>
            </Link>
          </div>
        </div>

        {/* Notification Alert */}
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
            <p className="text-sm font-medium text-slate-500">Loading your books...</p>
          </div>
        ) : books.length > 0 ? (
          <div className="bg-white rounded-3xl border border-[#E2EEF6] shadow-sm overflow-hidden">
            {/* Desktop Table View (Matching attached image layout) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#111827] text-slate-300 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                    <th scope="col" className="py-4 px-6">Book</th>
                    <th scope="col" className="py-4 px-6">Category</th>
                    <th scope="col" className="py-4 px-6">Copies</th>
                    <th scope="col" className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {books.map((book) => (
                    <MyBookCard
                      key={book._id || book.id}
                      book={book}
                      onEdit={(b) => setEditingBook(b)}
                      onDelete={handleDeleteBook}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card View */}
            <div className="md:hidden p-4 space-y-3">
              {books.map((book) => (
                <MyBookCard
                  key={book._id || book.id}
                  book={book}
                  onEdit={(b) => setEditingBook(b)}
                  onDelete={handleDeleteBook}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State when user hasn't added books */
          <div className="bg-white rounded-3xl border border-[#E2EEF6] p-10 sm:p-16 text-center max-w-lg mx-auto shadow-sm my-6">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF2F8] text-[#0F4A6B] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">No Books Added Yet</h3>
            <p className="text-sm text-[#64748B] mb-6">
              You haven&apos;t added any books to BookNook yet. Share a book from your shelf with fellow community readers!
            </p>
            <Link
              href="/add-book"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#0F4A6B] hover:bg-[#0C3B56] shadow-sm transition-all"
            >
              Add Your First Book
            </Link>
          </div>
        )}
      </div>

      {/* Edit Book Dialog Modal */}
      {editingBook && (
        <Dialog open={!!editingBook} onOpenChange={(open) => !open && setEditingBook(null)}>
          <DialogContent className="bg-white text-[#0F172A] border-[#E2EEF6] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl font-bold text-[#0F172A]">
                Edit Book
              </DialogTitle>
              <DialogDescription className="text-xs text-[#64748B]">
                Update book details below. Changes will be saved directly to the database.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateBook} className="space-y-4 pt-2">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1E293B]">Book Title *</label>
                <input
                  type="text"
                  name="bookTitle"
                  required
                  defaultValue={editingBook.bookTitle}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#0F4A6B] focus:ring-1 focus:ring-[#0F4A6B]"
                />
              </div>

              {/* Author */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1E293B]">Author Name *</label>
                <input
                  type="text"
                  name="authorName"
                  required
                  defaultValue={editingBook.authorName}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#0F4A6B] focus:ring-1 focus:ring-[#0F4A6B]"
                />
              </div>

              {/* Category & Copies Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1E293B]">Category *</label>
                  <select
                    name="category"
                    required
                    defaultValue={editingBook.category}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#0F4A6B]"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Sci-Fi & Fantasy">Sci-Fi & Fantasy</option>
                    <option value="Mystery & Thriller">Mystery & Thriller</option>
                    <option value="Biography & Memoir">Biography & Memoir</option>
                    <option value="History">History</option>
                    <option value="Science & Nature">Science & Nature</option>
                    <option value="Technology & Computers">Technology & Computers</option>
                    <option value="Self-Help & Psychology">Self-Help & Psychology</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1E293B]">Copies *</label>
                  <input
                    type="number"
                    name="totalCopies"
                    min="1"
                    required
                    defaultValue={editingBook.totalCopies}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#0F4A6B]"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1E293B]">Book Image URL *</label>
                <input
                  type="url"
                  name="bookImage"
                  required
                  defaultValue={editingBook.bookImage}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#0F4A6B]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1E293B]">Description *</label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  defaultValue={editingBook.description}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#0F4A6B] resize-y"
                />
              </div>

              <DialogFooter className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2 text-sm text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0F4A6B] hover:bg-[#0C3B56] cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}