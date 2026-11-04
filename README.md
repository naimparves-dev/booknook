# 📚 BookNook — Community Library & Book Sharing Platform

> **Live Client Application:** [https://booknook-client.vercel.app](https://booknook-client.vercel.app) 
> **Backend API Service:** [https://booknook-server.onrender.com](https://booknook-server.onrender.com) 
---

## 🌟 Key Features

* **Community-Driven Book Discovery & Genre Exploration:** ব্যবহারকারীরা সহজেই বিভিন্ন ক্যাটাগরির (Fiction, Sci-Fi, Biography, Technology ইত্যাদি) বই ব্রাউজ করতে পারবেন এবং বইয়ের বিস্তারিত বিবরণ ও কভার দেখতে পারবেন।
* **Smart Real-Time Borrowing & Inventory Tracking:** লগইন করা ব্যবহারকারী সহজেই ৭ দিনের জন্য বই ধার নিতে পারবেন। বই ধার নিলে ডাটাবেজে স্বয়ংক্রিয়ভাবে কপি সংখ্যা ১ কমে যায় এবং একই বই দ্বিতীয়বার ধার নেওয়া রোধ করা হয়।
* **Book Return & Automated Restocking:** "My Borrows" পেজ থেকে ধার করা বই এক ক্লিকে ফেরত (Return) দেওয়া যায়, যা ব্যাকএন্ড ডাটাবেজে তাৎক্ষণিকভাবে বইয়ের কপি সংখ্যা ১ বাড়িয়ে দেয় (+1)।
* **Contributor Management Dashboard:** ব্যবহারকারীরা তাদের নিজেদের ব্যক্তিগত কালেকশন থেকে নতুন বই যোগ করতে পারেন এবং "My Books" ড্যাশবোর্ড থেকে যে কোনো সময় বইয়ের তথ্য এডিট বা ডিলিট করতে পারেন।
* **Enterprise-Grade Cryptographic Security (Better Auth & JWT):** Better Auth দিয়ে গুগল ও ক্রেডেনশিয়াল লগইন হ্যান্ডেল করা হয়েছে এবং এক্সপ্রেস ব্যাকএন্ডের প্রতিটি প্রাইভেট এন্ডপয়েন্ট `jose` ও `JWKS` ভিত্তিক ডিজিটাল JWT টোকেন দিয়ে সুরক্ষিত।
* **Modern & Responsive UI/UX:** Next.js 16 App Router, React 19 এবং Tailwind CSS v4 দিয়ে তৈরি, যা মোবাইল, ট্যাবলেট এবং ডেস্কটপ সব ডিভাইসেই দ্রুত ও মসৃণভাবে চলে।

---

## 🛠️ Tech Stack

### Frontend (Client)
* **Framework:** Next.js 16 (App Router, Turbopack, React 19)
* **Styling:** Tailwind CSS v4
* **Authentication:** Better Auth (`@better-auth/client`, `jwtClient`)
* **State & Fetching:** Centralized API client with JWT caching & retry (`@/lib/api`)
* **UI Components:** Radix UI / Shadcn UI Dialogs, Swiper.js, React Hot Toast

### Backend (Server)
* **Runtime:** Node.js & Express.js
* **Database:** MongoDB Atlas (Collections: `books`, `borrows`)
* **Security:** `jose` (JWKS remote verification via `/api/auth/jwks`), CORS

---