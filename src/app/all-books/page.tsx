import React, { Suspense } from "react";
import Link from "next/link";
import { Book } from "@/type";
import { serverApiFetch } from "@/lib/server-api";
import BookCard from "@/components/shared/BooksCard";

export const metadata = {
    title: "All Books | BookNook",
    description: "Browse all available books in the BookNook community library.",
};

export default function AllBooksPage() {
    return (
        <Suspense fallback={<p className="text-center py-20">Loading books...</p>}>
            <AllBooks />
        </Suspense>
    );
}

const AllBooks = async () => {
    // Public endpoint, but sent through serverApiFetch so the request
    // carries the same `Authorization: Bearer <jwt>` the rest of the app
    // uses — the backend can tighten this route later without a code change.
    const res = await serverApiFetch("/books");
    const books: Book[] = await res.json();

    return (
        <div className="w-full min-h-screen bg-[#F1F6F9] py-8 sm:py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 pb-6 border-b border-slate-200/80">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#FFF4ED] text-[#F97316] border border-[#F97316]/20 shadow-xs mb-3">
                            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                            Community Library Catalog
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
                            All Books
                        </h1>
                        <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-xl">
                            Explore our curated library collection across various genres. Borrow and read anytime.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="px-4 py-2 rounded-xl bg-white text-xs sm:text-sm font-semibold text-[#0F4A6B] border border-[#E2EEF6] shadow-xs">
                            {books.length} {books.length === 1 ? "Book" : "Books"} Available
                        </span>
                        <Link
                            href="/add-book"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0F4A6B] hover:bg-[#0C3B56] shadow-xs transition-colors"
                        >
                            <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Book</span>
                        </Link>
                    </div>
                </div>

                {books.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {books.map((book, index) => (
                            <BookCard key={book._id || book.id || index} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl bg-white border border-[#E2EEF6] p-10 sm:p-16 text-center max-w-xl mx-auto shadow-sm my-8">
                        <div className="w-16 h-16 rounded-2xl bg-[#EAF2F8] text-[#0F4A6B] flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#0F172A] mb-2">No Books Found Yet</h3>
                        <p className="text-sm text-[#64748B] mb-6">
                            Be the first member to list a book in our library so fellow readers can borrow and enjoy it!
                        </p>
                        <Link
                            href="/add-book"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#0F4A6B] hover:bg-[#0C3B56] shadow-sm transition-all"
                        >
                            <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Your First Book</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};