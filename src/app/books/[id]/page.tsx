import { Suspense } from "react";
import BookDetails from "./BookDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Server wrapper for the book details screen.
 *
 * `BookDetails` is a Client Component that unwraps `params` with React's
 * `use()`. With Cache Components enabled, reading `params` outside a
 * `<Suspense>` boundary blocks prerendering, so the request-specific read
 * streams in behind this boundary while the rest of the shell stays static.
 */
export default function BookDetailsPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] w-full items-center justify-center bg-[#F1F6F9] text-sm text-slate-500">
          Loading book…
        </div>
      }
    >
      <BookDetails params={params} />
    </Suspense>
  );
}
