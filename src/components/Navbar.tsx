import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig"; // Import Firebase Auth
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserRole(currentUser.uid);
      }
    });
    return () => unsubscribe(); // Cleanup subscription
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

  const getRoleBasedLink = () => {
    switch (role) {
      case "administrator":
        return "/administrator";
      case "employee":
        return "/employee";
      case "client":
        return "/client";
      case "admin":
        return "/admin";
      case "frontdesk":
        return "/frontdesk";
      default:
        return "/main";
    }
  };

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Lab Management</h1>
      <div>
        {user ? (
          // ✅ Show these when user is logged in
          <>
            <Link
              to={getRoleBasedLink()}
              className="px-4 text-white hover:underline"
            >
              Home
            </Link>
            <Link to="/dashboard" className="px-4 text-white hover:underline">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 text-white hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          // ❌ Show these when user is logged out
          <>
            <Link to="/" className="px-4 text-white hover:underline">
              Home
            </Link>
            <Link to="/login" className="px-4 text-white hover:underline">
              Login
            </Link>
            <Link to="/contact" className="px-4 text-white hover:underline">
              Contact
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
