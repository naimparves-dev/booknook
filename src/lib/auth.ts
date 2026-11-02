import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { getGoogleAuthConfig } from "@/lib/google-auth";

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db("book-nook");

/**
 * Google OAuth is optional: the provider is only registered when both
 * credentials are present, so the app boots fine without them.
 * The auth pages read the same helper, so the "Continue with Google"
 * button always matches what is actually registered here.
 */
const google = getGoogleAuthConfig();

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    ...(google
        ? {
              socialProviders: {
                  google: {
                      clientId: google.clientId,
                      clientSecret: google.clientSecret,
                  },
              },
          }
        : {}),
});
