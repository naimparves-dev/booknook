import React from "react";
import Link from "next/link";
// import BookCard from "@/components/books/BookCard";
import { Book } from "@/type";
import BookCard from "../shared/BooksCard";

// Server component data fetching for New Arrivals
async function getNewArrivals(): Promise<Book[]> {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) return [];

    // Fetch books from backend API
    const res = await fetch(`${serverUrl}/books?limit=6&sort=desc`, {
      cache: "no-store", // ensure latest data on homepage
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const books: Book[] = Array.isArray(data) ? data : data?.books || [];

    // If backend doesn't sort by descending yet, sort by MongoDB _id (which contains timestamp) descending
    const sorted = [...books].sort((a, b) => {
      const idA = String(a._id || a.id || "");
      const idB = String(b._id || b.id || "");
      return idB.localeCompare(idA);
    });

    // Take latest 6 books
    return sorted.slice(0, 6);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}

export default async function NewArrivals() {
  const books = await getNewArrivals();

  if (!books || books.length === 0) {
    return null; // Don't render empty section if no books exist
  }

  return (
    <section className="w-full bg-[#F1F6F9] py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#FFF4ED] text-[#F97316] border border-[#F97316]/20 shadow-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
              Fresh From Our Shelves
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              New Arrivals
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-xl">
              Explore the latest books added by our community. Borrow these fresh titles before copies run out!
            </p>
          </div>

          {/* View All Books Link Button */}
          <Link
            href="/all-books"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0F4A6B] hover:text-[#F97316] transition-colors group shrink-0"
          >
            <span>View All Books</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* 6 Books Grid (3 cards per row on desktop = 2 rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {books.map((book) => (
            <BookCard key={book._id || book.id} book={book} />
          ))}
        </div>

        {/* Bottom CTA to View More */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/all-books"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-[#0F4A6B] hover:bg-[#0C3B56] shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Explore All Books</span>
            <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}