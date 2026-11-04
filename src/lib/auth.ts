import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { getGoogleAuthConfig } from "@/lib/google-auth";

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db("book-nook");

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
  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});