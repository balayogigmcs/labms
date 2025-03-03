import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

type RoleType = "main-admin" | "micro-biology" | "titration" | "front-desk";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<RoleType>("main-admin");
  const [error, setError] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/main"); // Redirect on success
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-center text-2xl font-bold mb-4">
          {isSignUp ? "Create an Account" : "Lab Management Login"}
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
          <div className="mb-3">
            <label className="block font-medium">Select Role:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={role}
              onChange={(e) => setRole(e.target.value as RoleType)}
            >
              <option value="main-admin">Main Administrative</option>
              <option value="micro-biology">Micro Biology Department</option>
              <option value="titration">Titration Department</option>
              <option value="front-desk">Front Desk</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="text-center mt-4">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button className="text-blue-500 hover:underline" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Login" : "Create Account"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
