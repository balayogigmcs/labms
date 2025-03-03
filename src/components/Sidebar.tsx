import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4 fixed lg:relative">
      <ul>
        <li className="p-2 hover:bg-gray-700"><a href="#">Dashboard</a></li>
        <li className="p-2 hover:bg-gray-700"><a href="#">Profile</a></li>
        <li className="p-2 hover:bg-gray-700"><a href="#">Settings</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
