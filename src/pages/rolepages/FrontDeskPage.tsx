import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig"; // Ensure Firestore & Functions are imported
import {
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { addDoc, collection, doc, getDoc } from "firebase/firestore"; // Firestore methods

const FrontDeskPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserRole(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserRole = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setRole(userDoc.data().role);
        if (role === "frontdesk") {
            navigate("/frontdesk");
          } 
      } else {
        console.warn("User role not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSubmitForm = async (data: any) => {
    try {
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      await addDoc(collection(db, "laboratory_reports"), {
        ...data,
        userId: user.uid,
        timestamp: new Date(),
      });
      alert("Laboratory Report Submitted Successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Lab Management System
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        You have successfully logged in.
      </p>

      {user && (
        <div className="text-md text-gray-600 mb-4">
          <p>
            <strong>Logged in as:</strong> {user.email}
          </p>
          <p>
            <strong>User UID:</strong> {user.uid}
          </p>
          <p>
            <strong>Role:</strong> {role ? role : "Loading..."}
          </p>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {user && (
        <div className="mt-10 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Submit Laboratory Report
          </h2>
          {/* <LaboratoryReport onSubmit={handleSubmitForm} /> */}
        </div>
      )}
    </div>
  );
};

export default FrontDeskPage;
