import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db();

/**
 * Google OAuth is optional: the provider is only registered when both
 * credentials are present, so the app boots fine without them.
 * The login page reads `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` to decide whether
 * to render the "Continue with Google" button.
 */
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleEnabled = Boolean(googleClientId && googleClientSecret);

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    ...(googleEnabled
        ? {
              socialProviders: {
                  google: {
                      clientId: googleClientId as string,
                      clientSecret: googleClientSecret as string,
                  },
              },
          }
        : {}),
});

/** Whether the server has Google sign-in configured. */
export const isGoogleAuthEnabled = googleEnabled;
