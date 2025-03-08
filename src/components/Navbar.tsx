import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; // Import Firebase Auth
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

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
            <Link to="/dashboard" className="px-4 text-white hover:underline">Dashboard</Link>
            <button onClick={handleLogout} className="px-4 text-white hover:underline">Logout</button>
          </>
        ) : (
          // ❌ Show these when user is logged out
          <>
            <Link to="/" className="px-4 text-white hover:underline">Home</Link>
            <Link to="/login" className="px-4 text-white hover:underline">Login</Link>
            <Link to="/contact" className="px-4 text-white hover:underline">Contact</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
