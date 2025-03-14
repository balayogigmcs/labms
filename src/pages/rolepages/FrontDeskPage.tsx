import React, { useEffect, useState, Suspense } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

const FrontdeskDashboard: React.FC = () => {
  const [forms, setForms] = useState<any[]>([]);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [formComponent, setFormComponent] = useState<React.FC<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  // 🔥 Fetch all submitted forms from Firestore
  const fetchForms = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "laboratory_reports"));
      const fetchedForms = querySnapshot.docs.map((doc) => ({
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
  const importFormComponent = async (formType: string): Promise<React.FC<any> | null> => {
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
          form.id === selectedForm.id ? { ...form, status: action, reviewComment } : form
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
      <h1 className="text-3xl font-bold text-center mb-6">Frontdesk Dashboard</h1>

      {/* Forms Table */}
      <div className="overflow-x-auto bg-white p-4 shadow-md rounded-lg">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2">Form ID</th>
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
                  <td className="border border-gray-300 p-2">{form.id}</td>
                  <td className="border border-gray-300 p-2">{form.client}</td>
                  <td className="border border-gray-300 p-2">{form.formType}</td>
                  <td className="border border-gray-300 p-2 font-semibold">{form.status}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => openReviewModal(form.id, form.formType)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Review
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
                handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setSelectedForm((prev: any) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }));
                },
                handleSubmit: (e: React.FormEvent) => {
                  e.preventDefault();
                  handleAction("approved");
                },
                role: "frontdesk",
              })}
            </Suspense>

            {/* Approve & Reject Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleAction("approved")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction("rejected")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
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

export default FrontdeskDashboard;


