import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Dashboard</h1>
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/dashboard")}
        >
          Go to MainPage
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebaseConfig";
// import { signOut } from "firebase/auth";

// const DashboardPage: React.FC = () => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/login"); // Redirect to login page after logout
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       {/* Navbar */}
//       <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
//         <h1 className="text-xl font-bold">Lab Management Dashboard</h1>
//         <button className="bg-red-500 px-4 py-2 rounded hover:bg-red-600" onClick={handleLogout}>
//           Logout
//         </button>
//       </nav>

//       {/* Main Content */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <aside className="bg-gray-800 text-white w-64 p-4 min-h-screen">
//           <ul className="space-y-4">
//             <li className="hover:bg-gray-700 p-2 rounded">
//               <button onClick={() => navigate("/main")} className="w-full text-left">Main Page</button>
//             </li>
//             <li className="hover:bg-gray-700 p-2 rounded">
//               <button onClick={() => navigate("/profile")} className="w-full text-left">Profile</button>
//             </li>
//             <li className="hover:bg-gray-700 p-2 rounded">
//               <button onClick={() => navigate("/settings")} className="w-full text-left">Settings</button>
//             </li>
//           </ul>
//         </aside>

//         {/* Content Section */}
//         <main className="flex-1 p-6">
//           <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
//           <p className="text-gray-700">Welcome to your lab management dashboard. Navigate using the sidebar.</p>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
