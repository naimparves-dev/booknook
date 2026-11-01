import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Book } from "@/type";


interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const bookId = book._id || book.id || "";

  return (
    <div className="group relative flex flex-col h-full rounded-2xl bg-white border border-[#E2EEF6] shadow-sm hover:shadow-md hover:border-[#0F4A6B]/30 transition-all duration-200 overflow-hidden">
      {/* Book Cover Image Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-[#F1F6F9] overflow-hidden flex items-center justify-center">
        {book.bookImage ? (
          <Image
            src={book.bookImage}
            alt={book.bookTitle}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          /* Fallback when no image is provided */
          <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <svg className="w-12 h-12 text-[#0F4A6B]/40 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs font-medium">No cover available</span>
          </div>
        )}

        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#F97316] border border-[#F97316]/20 shadow-xs backdrop-blur-xs">
            {book.category}
          </span>
        </div>

        {/* Copies Availability Pill */}
        {typeof book.totalCopies === "number" && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0C3B56]/90 text-white backdrop-blur-xs shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {book.totalCopies} {book.totalCopies === 1 ? "Copy" : "Copies"}
            </span>
          </div>
        )}
      </div>

      {/* Book Information Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div className="space-y-2">
          {/* Author Name */}
          <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            By <span className="text-[#1E293B]">{book.authorName}</span>
          </p>

          {/* Book Title */}
          <h3
            className="text-lg font-bold text-[#0F172A] group-hover:text-[#0F4A6B] transition-colors line-clamp-1"
            title={book.bookTitle}
          >
            {book.bookTitle}
          </h3>

          {/* Short Description snippet */}
          {book.description && (
            <p className="text-xs sm:text-sm text-[#64748B] line-clamp-2 leading-relaxed">
              {book.description}
            </p>
          )}
        </div>

        {/* Action Button: View Details */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <Link
            href={`/books/${bookId}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#0F4A6B] hover:bg-[#0C3B56] shadow-sm hover:shadow transition-all duration-200"
          >
            <span>View Details</span>
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}