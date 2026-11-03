"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BorrowRecord } from "@/type";

interface BorrowCardProps {
  borrow: BorrowRecord;
  onReturn: (id: string, bookId: string) => Promise<void>;
}

export default function BorrowCard({ borrow, onReturn }: BorrowCardProps) {
  const [isReturning, setIsReturning] = useState(false);
  const borrowId = String(borrow._id || borrow.id || "");
  const bookId = String(borrow.bookId || "");

  const handleReturnClick = async () => {
    if (isReturning || !borrowId) return;
    setIsReturning(true);
    try {
      await onReturn(borrowId, bookId);
    } finally {
      setIsReturning(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return String(dateString);
    }
  };

  return (
    <tr className="border-b border-slate-200/80 hover:bg-white/60 transition-colors">
      <td className="py-4 px-6 align-middle">
        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-xs shrink-0">
          {borrow.bookImage ? (
            <Image
              src={borrow.bookImage}
              alt={borrow.bookTitle}
              fill
              sizes="48px"
              className="object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-[#EAF2F8]">
              <svg className="w-6 h-6 text-[#0F4A6B]/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
        </div>
      </td>

      <td className="py-4 px-6 align-middle">
        <Link
          href={`/books/${bookId}`}
          className="font-bold text-[#0F172A] hover:text-[#0F4A6B] transition-colors line-clamp-2 max-w-sm"
        >
          {borrow.bookTitle}
        </Link>
        {borrow.authorName && (
          <p className="text-xs text-[#64748B] mt-0.5">by {borrow.authorName}</p>
        )}
      </td>

      <td className="py-4 px-6 align-middle text-sm text-[#475569] font-medium whitespace-nowrap">
        {formatDate(borrow.borrowDate)}
      </td>

      <td className="py-4 px-6 align-middle text-sm text-[#475569] font-medium whitespace-nowrap">
        {formatDate(borrow.returnDate)}
      </td>

      <td className="py-4 px-6 align-middle text-right whitespace-nowrap">
        <button
          type="button"
          onClick={handleReturnClick}
          disabled={isReturning}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#111827] hover:bg-[#0F4A6B] text-white border border-slate-700 shadow-xs transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isReturning ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Returning...
            </span>
          ) : (
            "Return Book"
          )}
        </button>
      </td>
    </tr>
  );
}