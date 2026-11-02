import type { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";
import { isGoogleAuthEnabled } from "@/lib/google-auth";

export const metadata: Metadata = {
  title: "Sign In · BookNook",
  description: "Sign in to BookNook to borrow and share books.",
};

/**
 * Server component: reads the Google OAuth configuration at request time and
 * hands it to the client form, so the button always reflects what the server
 * actually registered (no `NEXT_PUBLIC_*` flag to keep in sync).
 */
export default function LoginPage() {
  return <SignInForm googleEnabled={isGoogleAuthEnabled()} />;
}
