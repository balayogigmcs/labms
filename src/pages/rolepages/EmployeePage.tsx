import React, { use, useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig"; // Ensure Firestore & Functions are imported
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"; // Firestore methods
import MicroForm from "../forms/MicroForms";
import BioChemForm from "../forms/BioChemForms";

const EmployeePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [department, setDepartment] = useState<string>();
  const [completedForms, setCompletedForms] = useState<string>("Pending");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserRoleAndDepartment(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserRoleAndDepartment = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setRole(userDoc.data().role);
        setDepartment(userDoc.data().department);
      } else {
        console.warn("User role not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleSubmitForm = async (formName: string, data: any) => {
    try {
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      // ✅ Fetch the total count of documents to determine the next form number
      const reportsCollection = collection(db, "laboratory_reports");
      const snapshot = await getDocs(reportsCollection);
      const nextFormNumber = snapshot.size + 1; // Increment count to get next number

      const docId = `form_${nextFormNumber}`; // Example: form_1, form_2, etc.

      await setDoc(doc(db, "laboratory_reports", docId), {
        ...data,
        formType: formName,
        userId: user.uid,
        timestamp: new Date(),
      });

      alert(`Form ${formName} Submitted Successfully as ${docId}!`);
    } catch (error) {
      console.error(`Error submitting Form ${formName}:`, error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Lab Management System
      </h1>

      <div className="">
        {["Pending", "Completed"].map((form) => (
          <button
            className={`px-6 py-3 font-semibold transistion-all ${
              completedForms === form
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-black"
            }`}
            key={form}
            onClick={() => setCompletedForms(form)}
          >
            {form} Form
          </button>
        ))}
      </div>

      {user && (
        <div className="mt-10 w-full max-w-4xl overflow-y-auto h-96 p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Submit Laboratory Report
          </h2>
          {department === "micro" ? (
            <MicroForm
              onSubmit={(data) => handleSubmitForm("micro", data)}
              role={role ?? "guest"}
            />
          ) : (
            <BioChemForm
              onSubmit={(data) => handleSubmitForm("micro", data)}
              role={role ?? "guest"}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeePage;
