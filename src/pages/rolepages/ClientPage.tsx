import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import BioChemForm from "../forms/BioChemForms"; // Sample form component
import MicroForm from "../forms/MicroForms";

const ClientDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("guest");
  const [clientName, setClientName] = useState<string>();
  const [activeForm, setActiveForm] = useState<string>("chemistry");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserRole(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserRole = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setRole(userDoc.data().role);
        setClientName(userDoc.data().clientName);
      } else {
        console.warn("User role not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleSubmitForm = async (
    formName: string,
    data: any,
    clientName: string
  ) => {
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
        client: clientName,
        userId: user.uid,
        status: "submitted",
        timestamp: new Date(),
      });

      alert(`Form ${formName} Submitted Successfully as ${docId}!`);
    } catch (error) {
      console.error(`Error submitting Form ${formName}:`, error);
    }
  };

  const renderForm = () => {
    switch (activeForm) {
      case "chemistry":
        return (
          <BioChemForm
            onSubmit={(data) =>
              handleSubmitForm("chemistry", data, clientName ?? "")
            }
            role={role ?? "guest"}
          />
        );
      case "micro":
        return (
          <MicroForm
            onSubmit={(data) =>
              handleSubmitForm("micro", data, clientName ?? "")
            }
            role={role ?? "guest"}
          />
        );
      default:
        return (
          <BioChemForm
            onSubmit={(data) =>
              handleSubmitForm("chemistry", data, clientName ?? "")
            }
            role={role ?? "guest"}
          />
        );
    }
  };

  return (
    <div className="flex flex-col pt-10 items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Client Dashboard</h1>

      {/* Form Selection Tabs */}
      <div className="flex space-x-4 mb-6">
        {["chemistry", "micro"].map((form) => (
          <button
            key={form}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeForm === form
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-black"
            }`}
            onClick={() => setActiveForm(form)}
          >
            Form {form}
          </button>
        ))}
      </div>

      {/* Form Submission Section */}
      {user && (
        <div className="w-full max-w-4xl overflow-y-auto h-[500px] p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Submit Form {activeForm}
          </h2>
          {renderForm()}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
