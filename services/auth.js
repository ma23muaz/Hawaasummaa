import { account, ID } from "@/lib/appwrite";

// ✅ Register User
export async function registerUser(email, password, name) {
  try {
    console.log("Registering user:", email);

    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    console.log("User created successfully");

    // login after register
    await loginUser(email, password);

    return { success: true, userid: user.$id };

  } catch (error) {
    console.log("Registration Error:", error.message);
    return { success: false, error: error.message };
  }
}

// ✅ Login User
export async function loginUser(email, password) {
  try {
    console.log("Logging in:", email);

    const session = await account.createEmailPasswordSession(
      email,
      password
    );

    console.log("Session created:", session.$id);

    const user = await account.get();

    console.log("Logged in as:", user.name, user.email);

    return {
      success: true,
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
      },
    };

  } catch (error) {
    console.log("Login Error:", error.message);
    return { success: false, error: error.message };
  }
}

// ✅ Logout User
// ✅ new (clean & standard)
export async function logoutUser() {
  try {
    await account.deleteSession("current");

    console.log("Logged out successfully");

    return { success: true };

  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ✅ Get Current User
export async function getCurrentUser() {
  try {
    const user = await account.get();

    console.log("Current user:", user.email);

    return {
      success: true,
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
      },
    };

  } catch (error) {
    console.log("No user logged in");

    return {
      success: false,
      error: "No user",
    };
  }
}

// ✅ Check Auth Status
export async function checkAuthStatus() {
  try {
    await account.get();
    return true;
  } catch (error) {
    return false;
  }
}