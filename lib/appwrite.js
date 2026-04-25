import { Client, Account, Databases, ID, Query } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("69a0330100125ae0788f");

// services
export const account = new Account(client);
export const databases = new Databases(client);

export { ID, Query };

// ✅ FIXED NAME (IMPORTANT)
export const DATABASE_ID = "69a0439c002848d65039";

export const COLLECTIONS = {
  USERS: "users",
  POSTS: "posts",
  COMMENTS: "comments",
};