import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import MicroFormDesign from "../pages/forms/MicroFormDesign"; // Ensure correct import

interface ViewFormsProps {
  selectedForm: any;
  isModalOpen: boolean;
  closeModal: () => void;
}

const ViewForms: React.FC<ViewFormsProps> = ({ selectedForm, isModalOpen, closeModal }) => {
  return (
    <>
      {/* 🔥 Modal for Viewing Forms */}
      {isModalOpen && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
            <MicroFormDesign
              formData={selectedForm}
              handleChange={() => {}} // Read-only mode, no need to modify data
              handleSelectChange={() => {}}
              handleCheckboxChange={() => {}}
              handleSubmit={(e) => e.preventDefault()} // Disable form submission
              role={"employee"} // Modify role if needed
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewForms;
