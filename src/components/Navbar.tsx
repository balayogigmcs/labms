import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Lab Management</h1>
      <div>
        <Link to="/" className="px-4 text-white hover:underline">Home</Link>
        <Link to="/login" className="px-4 text-white hover:underline">Login</Link>
        <Link to="/contact" className="px-4 text-white hover:underline">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
