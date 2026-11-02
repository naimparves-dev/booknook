import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import { isGoogleAuthEnabled } from "@/lib/google-auth";

export const metadata: Metadata = {
  title: "Create Account · BookNook",
  description: "Join BookNook and start borrowing from our community library.",
};

/**
 * Server component: reads the Google OAuth configuration during rendering
 * and hands it to the client form, so the button always reflects what the
 * server actually registered (no `NEXT_PUBLIC_*` flag to keep in sync).
 */
export default function RegisterPage() {
  return <RegisterForm googleEnabled={isGoogleAuthEnabled()} />;
}
