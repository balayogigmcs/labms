import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState, lazy, Suspense } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";

const DashboardPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [role, setRole] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [formComponent, setFormComponent] = useState<React.FC<{
    formData: any;
    isEditing: boolean;
    onSave: (updatedData: any) => void;
  }> | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formsList, setFormsList] = useState<
    {
      id: string;
      formId: string;
      formType: string;
      status: string;
      client: string;
    }[]
  >([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchUserRole(currentUser.uid);
        await fetchFormsList();
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
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchFormsList = async () => {
    try {
      const formsCollection = collection(db, "laboratory_reports");
      const formSnapshot = await getDocs(formsCollection);
      const forms = formSnapshot.docs.map((doc) => ({
        id: doc.id,
        formId: doc.data().formId,
        formType: doc.data().formType,
        status: doc.data().status.toLowerCase(),
        client: doc.data().client,
      }));
      setFormsList(forms);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  // 🔥 Fetch form data and dynamically import the form design
  const openViewModal = async (formId: string, formType: string) => {
    try {
      const formDocRef = doc(db, "laboratory_reports", formId);
      const formDoc = await getDoc(formDocRef);
      if (formDoc.exists()) {
        const formData = formDoc.data();

        if (!formData) {
          console.error("Error: Form data is null.");
          return;
        }

        setSelectedForm({ ...formData, id: formId });
        setIsEditing(true);

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
    }
  };

  const importFormComponent = async (
    formType: string
  ): Promise<React.FC<any> | null> => {
    try {
      switch (formType) {
        case "micro":
          return (await import("../pages/forms/MicroFormDesign")).default;
        case "chemistry":
          return (await import("../pages/forms/BioChemFormDesign")).default;
        // case "Toxicology":
        //   return (await import("../pages/forms/ToxicologyFormDesign")).default;
        default:
          console.warn("Unknown form type:", formType);
          return null;
      }
    } catch (error) {
      console.error("Error loading form component:", error);
      return null;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
    setFormComponent(null);
  };

  // ✅ Save Updated Form Data to Firebase
  const handleSave = async (updatedData: any) => {
    try {
      if (!selectedForm || !selectedForm.id) return;
      const formDocRef = doc(db, "laboratory_reports", selectedForm.id);
      await updateDoc(formDocRef, updatedData);
      setIsEditing(false);
      setSelectedForm(updatedData);
      alert("Form updated successfully!");
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };

  // 🔥 Define role-based allowed statuses
  const getAllowedStatuses = () => {
    switch (role) {
      case "administrator":
        return [
          "submitted",
          "submission_rejected",
          "verified",
          "verification_failed",
          "testing",
          "test_failed",
          "review_pending",
          "rejected",
          "approved",
          "modification_required",
          "approval_revoked",
          "completed",
          "results_disputed",
        ];
      case "frontdesk":
        return ["submitted", "submission_rejected"];
      case "employee":
        return [
          "verified",
          "testing",
          "test_failed",
          "review_pending",
          "rejected",
        ];
      case "head":
        return [
          "review_pending",
          "approved",
          "rejected",
          "modification_required",
          "approval_revoked",
        ];
      case "client":
        return ["submitted", "approved", "completed", "results_disputed"];
      default:
        return [];
    }
  };

  const filteredForms = formsList.filter((sample) =>
    selectedStatus === "All" || selectedStatus === sample.status
      ? getAllowedStatuses().includes(sample.status)
      : false
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Lab Dashboard</h1>

      {role && (
        <div className="flex justify-center mb-6">
          <select
            className="border p-2 rounded-lg"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All</option>
            {getAllowedStatuses().map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() +
                  status.slice(1).replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredForms.length > 0 ? (
          filteredForms.map((sample) => (
            <div
              key={sample.id}
              className="bg-white shadow-lg rounded-lg p-4 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-600">
                  {sample.formType}
                </h2>

                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => openViewModal(sample.id, sample.formType)}
                >
                  View
                </button>
              </div>
              <p className="text-lg font-medium">Client: {sample.client}</p>
              <p className="text-gray-600">Date Sent: {sample.formId}</p>
              <p className="text-gray-600">Sample Type: {sample.status}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full">
            No samples found for the selected status.
          </p>
        )}
      </div>

      {/* 🔥 Modal for Viewing Forms */}
      {isModalOpen && selectedForm && formComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full overflow-auto max-h-[90vh] relative">
            <Suspense fallback={<p className="text-center">Loading form...</p>}>
              {formComponent &&
                React.createElement(formComponent, {
                  formData: selectedForm,
                  isEditing,
                  onSave: handleSave,
                  ...(typeof formComponent === "function"
                    ? {
                        handleChange: (
                          e: React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          setSelectedForm((prev: any) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                          }));
                        },
                        handleSelectChange: (organism: string) => {
                          setSelectedForm((prev: any) => ({
                            ...prev,
                            pathogenResults: {
                              ...prev.pathogenResults,
                              [organism]: {
                                ...prev.pathogenResults[organism],
                                selected:
                                  !prev.pathogenResults[organism].selected,
                              },
                            },
                          }));
                        },
                        handleCheckboxChange: (
                          organism: string,
                          field: "absent" | "present"
                        ) => {
                          setSelectedForm((prev: any) => ({
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
                          }));
                        },
                        handleSubmit: (e: React.FormEvent) => {
                          e.preventDefault();
                          handleSave(selectedForm);
                        },
                        role,
                      }
                    : {}),
                })}
            </Suspense>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded absolute top-4 right-4"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

// import { collection, doc, getDoc, getDocs } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { auth, db } from "../firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";

// const DashboardPage = () => {
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [role, setRole] = useState<string | null>(null);
//   const [selectedForm, setSelectedForm] = useState<any>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formsList, setFormsList] = useState<
//     {
//       id: string;
//       formId: string;
//       formType: string;
//       status: string;
//       client: string;
//     }[]
//   >([]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         await fetchUserRole(currentUser.uid);
//         await fetchFormsList();
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const fetchUserRole = async (uid: string) => {
//     try {
//       const userDocRef = doc(db, "users", uid);
//       const userDoc = await getDoc(userDocRef);
//       if (userDoc.exists()) {
//         setRole(userDoc.data().role);
//       }
//     } catch (error) {
//       console.error("Error fetching user role:", error);
//     }
//   };

//   const fetchFormsList = async () => {
//     try {
//       const formsCollection = collection(db, "laboratory_reports");
//       const formSnapshot = await getDocs(formsCollection);

//       const forms = formSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         formId: doc.data().formId,
//         formType: doc.data().formType,
//         status: doc.data().status.toLowerCase(),
//         client: doc.data().client,
//       }));
//       setFormsList(forms);
//     } catch (error) {
//       console.error("Error fetching forms:", error);
//     }
//   };

//   // 🔥 Define role-based allowed statuses
//   const getAllowedStatuses = () => {
//     switch (role) {
//       case "administrator":
//         return [
//           "submitted",
//           "submission_rejected",
//           "verified",
//           "verification_failed",
//           "testing",
//           "test_failed",
//           "review_pending",
//           "rejected",
//           "approved",
//           "modification_required",
//           "approval_revoked",
//           "completed",
//           "results_disputed",
//         ];
//       case "frontdesk":
//         return ["submitted", "submission_rejected"];
//       case "employee":
//         return [
//           "verified",
//           "testing",
//           "test_failed",
//           "review_pending",
//           "rejected",
//         ];
//       case "head":
//         return [
//           "review_pending",
//           "approved",
//           "rejected",
//           "modification_required",
//           "approval_revoked",
//         ];
//       case "client":
//         return ["submitted", "approved", "completed", "results_disputed"];
//       default:
//         return [];
//     }
//   };

//   // 🔥 Filter forms based on selected status & role
//   const filteredForms = formsList.filter((sample) => {
//     if (selectedStatus === "All" || selectedStatus === sample.status) {
//       return getAllowedStatuses().includes(sample.status);
//     }
//     return false;
//   });

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-center mb-6">Lab Dashboard</h1>

//       {/* 🔥 Show Role-Based Status Filter Dropdown */}
//       {role && (
//         <div className="flex justify-center mb-6">
//           <select
//             className="border p-2 rounded-lg"
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//           >
//             <option value="All">All</option>
//             {getAllowedStatuses().map((status) => (
//               <option key={status} value={status}>
//                 {status.charAt(0).toUpperCase() +
//                   status.slice(1).replace("_", " ")}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* 🔥 Display Filtered Forms */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {filteredForms.length > 0 ? (
//           filteredForms.map((sample) => (
//             <div
//               key={sample.id}
//               className={`bg-white shadow-lg rounded-lg p-4 border-l-4 ${
//                 {
//                   submitted: "border-yellow-500",
//                   submission_rejected: "border-red-500",
//                   verified: "border-blue-500",
//                   verification_failed: "border-red-500",
//                   testing: "border-purple-500",
//                   test_failed: "border-red-500",
//                   review_pending: "border-orange-500",
//                   rejected: "border-red-500",
//                   approved: "border-green-500",
//                   modification_required: "border-red-500",
//                   approval_revoked: "border-red-500",
//                   completed: "border-green-500",
//                   results_disputed: "border-red-500",
//                 }[sample.status] || "border-gray-500"
//               }`}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h2
//                   className={`text-xl font-semibold mb-3 ${
//                     {
//                       submitted: "text-yellow-500",
//                       submission_rejected: "text-red-500",
//                       verified: "text-blue-500",
//                       verification_failed: "text-red-500",
//                       testing: "text-purple-500",
//                       test_failed: "text-red-500",
//                       review_pending: "text-orange-500",
//                       rejected: "text-red-500",
//                       approved: "text-green-600",
//                       modification_required: "text-red-500",
//                       approval_revoked: "text-red-500",
//                       completed: "text-green-600",
//                       results_disputed: "text-red-500",
//                     }[sample.status] || "text-gray-500"
//                   }`}
//                 >
//                   {sample.status.charAt(0).toUpperCase() +
//                     sample.status.slice(1).replace("_", " ")}
//                 </h2>

//                 <button
//                   className="bg-yellow-500 text-white px-3 py-1 rounded"
//                   onClick={() => {}}
//                 >
//                   View
//                 </button>
//               </div>
//               <p className="text-lg font-medium">Sample Number: {sample.id}</p>
//               <p className="text-gray-600">Department: {sample.formType}</p>
//               <p className="text-gray-600">Client: {sample.client}</p>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500 w-full">
//             No samples found for the selected status.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
