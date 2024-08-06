// simulateAuthEvent.js

const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const { initializeApp } = require("firebase-admin/app");

initializeApp({
  projectId: 'tagrosClips'
});

const simulateUserCreation = async () => {
  try {
    const user = await getAuth().createUser({
      email: "testuser@example.com",
      emailVerified: false,
      password: "password",
      displayName: "Test User",
      disabled: false,
    });

    console.log("User created:", user.uid);
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

simulateUserCreation();
