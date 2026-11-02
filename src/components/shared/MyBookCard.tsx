"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Book } from "@/type";

interface MyBookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => Promise<void>;
}

export default function MyBookCard({ book, onEdit, onDelete }: MyBookCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const bookId = String(book._id || book.id || "");

  const handleDeleteClick = async () => {
    if (!bookId || isDeleting) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete "${book.bookTitle}"?`);
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(bookId);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Desktop Table Row (Matching attached image layout) */}
      <tr className="hidden md:table-row border-b border-slate-200/80 hover:bg-white/60 transition-colors">
        {/* Book Column: Thumbnail + Title + Author */}
        <td className="py-4 px-6 align-middle">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-xs shrink-0">
              {book.bookImage ? (
                <Image
                  src={book.bookImage}
                  alt={book.bookTitle}
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
            <div className="min-w-0">
              <Link
                href={`/books/${bookId}`}
                className="font-bold text-[#0F172A] hover:text-[#0F4A6B] transition-colors line-clamp-1 block"
                title={book.bookTitle}
              >
                {book.bookTitle}
              </Link>
              <p className="text-xs text-[#64748B] mt-0.5">{book.authorName}</p>
            </div>
          </div>
        </td>

        {/* Category Column: Pill Badge */}
        <td className="py-4 px-6 align-middle whitespace-nowrap">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF4ED] text-[#F97316] border border-[#F97316]/20">
            {book.category}
          </span>
        </td>

        {/* Copies Column */}
        <td className="py-4 px-6 align-middle text-sm font-bold text-[#0F172A] whitespace-nowrap">
          {book.totalCopies}
        </td>

        {/* Action Column: Edit & Delete Buttons */}
        <td className="py-4 px-6 align-middle text-right whitespace-nowrap">
          <div className="inline-flex items-center gap-2">
            {/* Edit Button */}
            <button
              type="button"
              onClick={() => onEdit(book)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1E293B] hover:bg-[#334155] text-white border border-slate-700 shadow-xs transition-colors cursor-pointer"
            >
              Edit
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#450A0A] hover:bg-[#7F1D1D] text-red-200 border border-red-900/60 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? "..." : "Delete"}
            </button>
          </div>
        </td>
      </tr>

      {/* Mobile Card Layout (For small screen responsiveness) */}
      <div className="md:hidden p-4 rounded-2xl bg-white border border-[#E2EEF6] shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="relative w-14 h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
            {book.bookImage ? (
              <Image
                src={book.bookImage}
                alt={book.bookTitle}
                fill
                sizes="56px"
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

          <div className="flex-1 min-w-0">
            <Link
              href={`/books/${bookId}`}
              className="font-bold text-sm text-[#0F172A] hover:text-[#0F4A6B] line-clamp-1 block"
            >
              {book.bookTitle}
            </Link>
            <p className="text-xs text-[#64748B] mt-0.5">{book.authorName}</p>

            <div className="flex items-center gap-2 mt-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF4ED] text-[#F97316] border border-[#F97316]/20">
                {book.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Copies: <strong className="text-[#0F172A]">{book.totalCopies}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onEdit(book)}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-[#1E293B] hover:bg-[#334155] text-white transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-[#450A0A] hover:bg-[#7F1D1D] text-red-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </>
  );
}