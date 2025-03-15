import React, { useEffect, useState, Suspense } from "react";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const EmployeePage: React.FC = () => {
  const [forms, setForms] = useState<any[]>([]);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [department, setDepartment] = useState<string>();
  const [formComponent, setFormComponent] = useState<React.FC<any> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // setUser(currentUser);
      if (currentUser) {
        await fetchUserDepartment(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchForms();
  }, [department]);

  const fetchUserDepartment = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setDepartment(userDoc.data().department);
      } else {
        console.warn("User role not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  // 🔥 Fetch all submitted forms from Firestore
  const fetchForms = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "laboratory_reports"));
      const fetchedForms = querySnapshot.docs
        .filter(
          (doc) =>
            doc.data().status === "approved" &&
            department === doc.data().formType
        )
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      setForms(fetchedForms);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  // 🔥 Open the Review Modal and Fetch Form Details
  const openReviewModal = async (formId: string, formType: string) => {
    try {
      setIsLoading(true);
      const formDocRef = doc(db, "laboratory_reports", formId);
      const formDoc = await getDoc(formDocRef);

      if (formDoc.exists()) {
        const formData = formDoc.data();
        setSelectedForm({ ...formData, id: formId });

        console.log("🔹 Form Data Loaded:", formData); // Debugging
        console.log("🔹 Current Role:", "employee"); // Change this to match your role

        // Dynamically import the correct form component
        const dynamicComponent = await importFormComponent(formType);
        if (dynamicComponent) {
          setFormComponent(() => dynamicComponent);
          setIsModalOpen(true);
        } else {
          console.error("No matching form component found for", formType);
        }
      } else {
        console.error("Form not found.");
      }
    } catch (error) {
      console.error("Error fetching form details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 Dynamically import the correct form component
  const importFormComponent = async (
    formType: string
  ): Promise<React.FC<any> | null> => {
    try {
      switch (formType) {
        case "micro":
          return (await import("../forms/MicroFormDesign")).default;
        case "chemistry":
          return (await import("../forms/BioChemFormDesign")).default;
        default:
          console.warn("Unknown form type:", formType);
          return null;
      }
    } catch (error) {
      console.error("Error loading form component:", error);
      return null;
    }
  };

  // 🔥 Approve or Reject Form
  const handleAction = async (action: "approved" | "rejected") => {
    if (!selectedForm) return;

    try {
      const formRef = doc(db, "laboratory_reports", selectedForm.id);
      await updateDoc(formRef, {
        status: action,
        reviewComment,
        reviewedBy: "Frontdesk",
        reviewedAt: new Date(),
      });

      setForms((prevForms) =>
        prevForms.map((form) =>
          form.id === selectedForm.id
            ? { ...form, status: action, reviewComment }
            : form
        )
      );

      alert(`Form ${action} successfully!`);
      closeModal();
    } catch (error) {
      console.error(`Error updating form status:`, error);
    }
  };

  // 🔥 Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
    setFormComponent(null);
    setReviewComment("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Employee Dashboard
      </h1>

      {/* Forms Table */}
      <div className="overflow-x-auto bg-white p-4 shadow-md rounded-lg">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2">Id</th>
              <th className="border border-gray-300 p-2">Client</th>
              <th className="border border-gray-300 p-2">Form Type</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.length > 0 ? (
              forms.map((form) => (
                <tr key={form.id} className="text-center">
                  <td className="border border-gray-300 p-2">
                    {form.formType === "micro" ? "om-" : "bc-"}
                    {form.formType === "micro" ? form.om : form.bc}
                  </td>
                  <td className="border border-gray-300 p-2">{form.client}</td>
                  <td className="border border-gray-300 p-2">
                    {form.formType}
                  </td>
                  <td className="border border-gray-300 p-2 font-semibold">
                    {form.status}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => openReviewModal(form.id, form.formType)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Start
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No forms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 Modal for Reviewing Forms */}
      {isModalOpen && selectedForm && formComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full overflow-auto max-h-[90vh] relative">
            <h2 className="text-xl font-semibold mb-4">Review Form</h2>

            {/* Dynamically Load the Form */}
            <Suspense fallback={<p className="text-center">Loading form...</p>}>
              {React.createElement(formComponent, {
                formData: selectedForm,
                handleChange: (
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  setSelectedForm((prev: any) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }));
                },
                handleCheckboxChange: (
                  organism: string,
                  field: "absent" | "present"
                ) => {
                  setSelectedForm(
                    (prev: {
                      pathogenResults: { [x: string]: { [x: string]: any } };
                    }) => ({
                      ...prev,
                      pathogenResults: {
                        ...prev.pathogenResults,
                        [organism]: {
                          ...prev.pathogenResults[organism],
                          [field]: !prev.pathogenResults[organism][field],
                          ...(field === "absent"
                            ? { present: false }
                            : { absent: false }),
                        },
                      },
                    })
                  );
                },
                handleSubmit: (e: React.FormEvent) => {
                  e.preventDefault();
                  handleAction("approved");
                },
                role: "employee",
              })}
            </Suspense>

            {/* Approve & Reject Buttons */}
            <div className="flex justify-end mt-4">
              {/* <button
                onClick={() => handleAction("rejected")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
              </button> */}
              <button
                onClick={() => handleAction("approved")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Send For Review
              </button>
            </div>

            {/* Close Modal */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              onClick={closeModal}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;

// import React, { use, useEffect, useState } from "react";
// import { auth, db } from "../../firebaseConfig"; // Ensure Firestore & Functions are imported
// import { onAuthStateChanged, User } from "firebase/auth";
// import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"; // Firestore methods
// import MicroForm from "../forms/MicroForms";
// import BioChemForm from "../forms/BioChemForms";

// const EmployeePage: React.FC = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [role, setRole] = useState<string | null>(null);
//   const [department, setDepartment] = useState<string>();
//   const [completedForms, setCompletedForms] = useState<string>("Pending");

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
//       if (currentUser) {
//         await fetchUserRoleAndDepartment(currentUser.uid);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const fetchUserRoleAndDepartment = async (uid: string) => {
//     try {
//       const userDocRef = doc(db, "users", uid);
//       const userDoc = await getDoc(userDocRef);
//       if (userDoc.exists()) {
//         setRole(userDoc.data().role);
//         setDepartment(userDoc.data().department);
//       } else {
//         console.warn("User role not found in Firestore");
//       }
//     } catch (error) {
//       console.error("Error fetching user role:", error);
//     }
//   };

//   const handleSubmitForm = async (formName: string, data: any) => {
//     try {
//       if (!user) {
//         console.error("User not authenticated");
//         return;
//       }

//       // ✅ Fetch the total count of documents to determine the next form number
//       const reportsCollection = collection(db, "laboratory_reports");
//       const snapshot = await getDocs(reportsCollection);
//       const nextFormNumber = snapshot.size + 1; // Increment count to get next number

//       const docId = `form_${nextFormNumber}`; // Example: form_1, form_2, etc.

//       await setDoc(doc(db, "laboratory_reports", docId), {
//         ...data,
//         formType: formName,
//         userId: user.uid,
//         timestamp: new Date(),
//       });

//       alert(`Form ${formName} Submitted Successfully as ${docId}!`);
//     } catch (error) {
//       console.error(`Error submitting Form ${formName}:`, error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold mb-4">
//         Welcome to Lab Management System
//       </h1>

//       <div className="">
//         {["Pending", "Completed"].map((form) => (
//           <button
//             className={`px-6 py-3 font-semibold transistion-all ${
//               completedForms === form
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-300 text-black"
//             }`}
//             key={form}
//             onClick={() => setCompletedForms(form)}
//           >
//             {form} Form
//           </button>
//         ))}
//       </div>

//       {user && (
//         <div className="mt-10 w-full max-w-4xl overflow-y-auto h-96 p-4 bg-white shadow-lg rounded-lg">
//           <h2 className="text-2xl font-semibold text-center mb-4">
//             Submit Laboratory Report
//           </h2>
//           {department === "micro" ? (
//             <MicroForm
//               onSubmit={(data) => handleSubmitForm("micro", data)}
//               role={role ?? "guest"}
//             />
//           ) : (
//             <BioChemForm
//                 onSubmit={(data) => handleSubmitForm("chemistry", data)}
//                 role={role ?? "guest"}             />
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeePage;
