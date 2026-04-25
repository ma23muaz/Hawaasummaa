import {
  databases,
  DATABASE_ID,
  COLLECTIONS,
  ID,
  Query,
} from "@/lib/appwrite";

// CREATE POST
export async function createPost(userid, userEmail, userName, content) {
  try {
    const post = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.POSTS,
      ID.unique(),
      {
        userid: userid, // ✅ FIXED
        userEmail,
        userName,
        content,
        $createdAt: new Date().toISOString(),
      }
    );

    return { success: true, post };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// GET ALL POSTS
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.POSTS,
      [Query.orderDesc("$createdAt")]
    );

    return { success: true, posts: posts.documents };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// DELETE POST
export async function deletePost(postId) {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.POSTS,
      postId
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}