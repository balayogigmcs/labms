import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import Footer from "./components/Footer";
import HomePage from "./pages/Homepage";
import ContactPage from "./pages/ContactPage";
import MainPage from "./pages/MainPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/rolepages/AdminPage";
import AdministratorPage from "./pages/rolepages/AdministratorPage";
import ClientPage from "./pages/rolepages/ClientPage";
import EmployeePage from "./pages/rolepages/EmployeePage";
import FrontDeskPage from "./pages/rolepages/FrontDeskPage";


const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/administrator" element={<AdministratorPage />} />
            <Route path="/client" element={<ClientPage />} />
            <Route path="/employee" element={<EmployeePage />} />
            <Route path="/frontdesk" element={<FrontDeskPage />} />
            <Route
              path="*"
              element={
                <h1 className="text-center text-xl">404 Page Not Found</h1>
              }
            />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
