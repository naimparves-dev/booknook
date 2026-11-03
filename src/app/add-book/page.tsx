
"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { authClient } from "@/lib/auth-client";

export default function AddBookPage() {
  const router = useRouter();

  // Identity only — access is enforced by `src/proxy.ts`, which redirects
  // signed-out visitors to /login before this page ever renders.
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const bookData = {
      bookTitle: formData.get("bookTitle"),
      authorName: formData.get("authorName"),
      category: formData.get("category"),
      totalCopies: Number(formData.get("totalCopies")),
      bookImage: formData.get("bookImage"),
      description: formData.get("description"),
      // Always taken from the authenticated session, never from the form,
      // so the fields cannot be tampered with.
      username: user?.name ?? "",
      userEmail: user?.email ?? "",
    };

    try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (result.ok) {
        router.push("/all-books");
      } else {
        console.error("Failed to add book:", await result.text());
      }
    } catch (err) {
      console.error("Failed to add book:", err);
    }
  };

  /* ------------------------------ Signed in ------------------------------ */

  return (
    <div className="w-full min-h-screen bg-[#F1F6F9] py-8 sm:py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#FFF4ED] text-[#F97316] border border-[#F97316]/20 shadow-sm mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
            Library Contribution
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Add a New Book to <span className="text-[#0F4A6B]">Book</span><span className="text-[#F97316]">Nook</span>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-xl mx-auto">
            Fill in the information below to list a new title for our reader community to discover and borrow.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-[#E2EEF6] p-6 sm:p-10 lg:p-12">

          <form className="space-y-8" onSubmit={handleSubmit}>

            {/* Section 1: Book Information */}
            <div>
              <div className="flex items-center gap-2.5 pb-3 mb-6 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-[#EAF2F8] text-[#0F4A6B] flex items-center justify-center font-bold text-sm">
                  1
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                    Book Details
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Primary information about the title
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

                {/* Book Title */}
                <div className="md:col-span-2 space-y-1.5">
                  <label htmlFor="bookTitle" className="block text-sm font-semibold text-[#1E293B]">
                    Book Title <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    id="bookTitle"
                    name="bookTitle"
                    required
                    placeholder="e.g., The Midnight Library"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#0F172A] text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0F4A6B] focus:ring-2 focus:ring-[#0F4A6B]/15 transition-all shadow-xs"
                  />
                </div>

                {/* Author Name */}
                <div className="space-y-1.5">
                  <label htmlFor="authorName" className="block text-sm font-semibold text-[#1E293B]">
                    Author Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    id="authorName"
                    name="authorName"
                    required
                    placeholder="e.g., Matt Haig"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#0F172A] text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0F4A6B] focus:ring-2 focus:ring-[#0F4A6B]/15 transition-all shadow-xs"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="category" className="block text-sm font-semibold text-[#1E293B]">
                    Category <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      defaultValue=""
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#0F172A] text-sm focus:outline-none focus:border-[#0F4A6B] focus:ring-2 focus:ring-[#0F4A6B]/15 transition-all appearance-none cursor-pointer shadow-xs"
                    >
                      <option value="" disabled>Select a category</option>
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

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Copies */}
                <div className="space-y-1.5">
                  <label htmlFor="totalCopies" className="block text-sm font-semibold text-[#1E293B]">
                    Total Copies Available <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    id="totalCopies"
                    name="totalCopies"
                    min="1"
                    required
                    placeholder="e.g., 5"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#0F172A] text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0F4A6B] focus:ring-2 focus:ring-[#0F4A6B]/15 transition-all shadow-xs"
                  />
                </div>

                {/* Book Image URL */}
                <div className="space-y-1.5">
                  <label htmlFor="bookImage" className="block text-sm font-semibold text-[#1E293B]">
                    Book Image URL <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="url"
                    id="bookImage"
                    name="bookImage"
                    required
                    placeholder="https://example.com/book-cover.jpg"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#0F172A] text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0F4A6B] focus:ring-2 focus:ring-[#0F4A6B]/15 transition-all shadow-xs"
                  />
                </div>

                {/* Short Description */}
                <div className="md:col-span-2 space-y-1.5">
                  <label htmlFor="description" className="block text-sm font-semibold text-[#1E293B]">
                    Short Description <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    placeholder="Write a brief overview, synopsis, or storyline of the book..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#0F172A] text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0F4A6B] focus:ring-2 focus:ring-[#0F4A6B]/15 transition-all shadow-xs resize-y"
                  />
                </div>

              </div>
            </div>

            {/* Section 2: User Information */}
            <div className="pt-2">
              <div className="flex items-center gap-2.5 pb-3 mb-6 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-[#EAF2F8] text-[#0F4A6B] flex items-center justify-center font-bold text-sm">
                  2
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                    Contributor Details
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Filled automatically from your signed-in account
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

                {/* Username (auto-filled, read-only) */}
                <div className="space-y-1.5">
                  <label htmlFor="username" className="block text-sm font-semibold text-[#1E293B]">
                    Username / Listed By <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={user?.name ?? ""}
                      readOnly
                      disabled
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-[#F8FAFC] text-[#64748B] text-sm cursor-not-allowed shadow-xs"
                    />

                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* User Email (auto-filled, read-only) */}
                <div className="space-y-1.5">
                  <label htmlFor="userEmail" className="block text-sm font-semibold text-[#1E293B]">
                    User Email <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type="email"
                      id="userEmail"
                      name="userEmail"
                      value={user?.email ?? ""}
                      readOnly
                      disabled
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-[#F8FAFC] text-[#64748B] text-sm cursor-not-allowed shadow-xs"
                    />

                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Submit CTA Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4">

              <button
                type="reset"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-[#0F4A6B] hover:bg-[#F1F6F9] transition-colors cursor-pointer"
              >
                Reset Fields
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-[#0F4A6B] hover:bg-[#0C3B56] shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>

                <span>Add Book</span>
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
