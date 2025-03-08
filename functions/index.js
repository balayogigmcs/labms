// const functions = require("firebase-functions");
// const admin = require("firebase-admin");

// // Initialize Firebase Admin SDK
// admin.initializeApp();

// exports.createAdminAccount = functions.https.onCall(async (data, context) => {
//   // Ensure only authenticated users can create an admin
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//         "unauthenticated", "User must be logged in");
//   }

//   try {
//     // Create the user in Firebase Authentication
//     const userRecord = await admin.auth().createUser({
//       email: data.email,
//       password: "Admin@1234", // Secure default password (changeable later)
//       disabled: false,
//     });

//     // Add user details to Firestore with "administrator" role
//     await admin.firestore().collection("users").doc(userRecord.uid).set({
//       email: data.email,
//       role: "administrator",
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     return {success: true, message:
//       "Administrator account created successfully!"};
//   } catch (error) {
//     throw new functions.https.HttpsError("internal", error.message);
//   }
// });
