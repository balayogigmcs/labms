import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig"; // Ensure Firestore & Functions are imported
import {
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore methods

const EmployeePage: React.FC = () => {
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

{/* 
        {(role === "admin" || role === "administrator") && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            // onClick={() => navigate("/admin-panel")}
            onClick={() => setShowModal(true)}
          >
            {role === "admin" ? "Add administrator" : "Add Client"}
          </button>
        )}

        {role === "administrator" && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => setShowModal(true)}
          >
            Add Employee
          </button>
        )} */}

        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Administrator</h2>
            <p className="text-gray-600 mb-4">
              Enter details to add a new administrator.
            </p>

            <input
              type="email"
              placeholder="Enter Admin Email"
              className="w-full p-2 border rounded mb-4"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />

            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowModal(false);
                  setAdminEmail("");
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={setUserRole}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default EmployeePage;
