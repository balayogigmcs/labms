import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getRole } from "../global/Roles";
import { doc, getDoc } from "firebase/firestore";

const LoginPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch role & department
        const mainRole = await getRole(currentUser.uid);
        setUserRole(mainRole);
        await fetchUserDepartment(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserDepartment = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setDepartment(userDoc.data().department || null);
      } else {
        console.warn("User department not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching user department:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const loggedInUser = userCredential.user;

      if (loggedInUser) {
        const mainRole = await getRole(loggedInUser.uid);
        setUserRole(mainRole);

        // Fetch department before navigation
        const userDocRef = doc(db, "users", loggedInUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userDepartment = userDoc.exists() ? userDoc.data().department || null : null;
        setDepartment(userDepartment);

        console.log("Before navigation - Role:", mainRole, "Department:", userDepartment);

        // Navigate based on role
        if (mainRole === "admin") {
          navigate("/admin");
        } else if (mainRole === "administrator") {
          navigate("/administrator");
         } else if(mainRole === "frontdesk"){
          navigate("/frontdesk")
        } else if (mainRole === "employee") {
           navigate("/employee");
        } else if (mainRole === "client") {
          navigate("/client");
        } else {
          navigate("/dashboard");
        }

        console.log("After navigation");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-center text-2xl font-bold mb-4">
          Lab Management Login
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block font-medium">Email:</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium">Password:</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
