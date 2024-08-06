const { getAuth } = require("firebase-admin/auth");
const { initializeApp } = require("firebase-admin/app");

initializeApp({
  projectId: 'your-project-id',
});

async function simulateUserCreation() {
  try {
    const user = await getAuth().createUser({
      email: "testuser@example.com",
      password: "password123",
      displayName: "Test User",
      photoURL: "http://www.example.com/testuser/photo.png",
    });

    console.log("User created with UID:", user.uid);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

simulateUserCreation();
