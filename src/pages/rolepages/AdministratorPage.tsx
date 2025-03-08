import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig"; // Ensure Firestore & Functions are imported
import {
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore"; // Firestore methods

const AdministratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [addOn, setAddon] = useState<string>();
  const [role, setRole] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminList, setAdminList] = useState<
    { uid: string; email: string; role: string }[]
  >([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserRole(currentUser.uid);
        await fetchAdminList();
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
      } else {
        console.warn("User role not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchAdminList = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);

      const employeeAndClients = usersSnapshot.docs
        .filter((doc) => {
          const role = doc.data().role;
          return role === "employee" || role === "client";
        })
        .map((doc) => ({
          uid: doc.id,
          email: doc.data().email,
          role: doc.data().role,
        }));
      setAdminList(employeeAndClients);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to add an admin user without logging out the current user
  const setUserRole = async () => {
    if (!adminEmail) {
      alert("Please enter an administrator email.");
      return;
    }

    try {
      // ✅ Store the currently logged-in user
      const currentUser = auth.currentUser;

      // ✅ Create the administrator account
      const password = adminEmail.replace("@gmail.com", "");
      const userRef = await createUserWithEmailAndPassword(
        auth,
        adminEmail,
        password
      );
      const user = userRef.user;

      // ✅ Store admin details in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        email: adminEmail,
        role: addOn === "employee" ? "employee" : "client",
        createdAt: Timestamp.fromDate(new Date()),
      });

      alert(
        `${addOn === "employee" ? "Employee" : "Client"} added successfully!`
      );

      // ✅ Re-authenticate back to the original user
      if (currentUser) {
        await auth.updateCurrentUser(currentUser);
      }

      // ✅ Reset modal and input field
      setShowModal(false);
      setAdminEmail("");
    } catch (error) {
      console.error("Error in adding user to Firestore:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Lab Management System
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        You have successfully logged in Administrator.
      </p>

      {user && (
        <div className="text-md text-gray-600 mb-4">
          <p>
            <strong>Logged in as:</strong> {user.email}
          </p>
          <p>
            <strong>User UID:</strong> {user.uid}
          </p>
          <p>
            <strong>Role:</strong> {role ? role : "Loading..."}
          </p>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>

        {role === "administrator" && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            // onClick={() => navigate("/admin-panel")}
            onClick={() => {
              setShowModal(true);
              setAddon("employee");
            }}
          >
            Add Employee
          </button>
        )}

        {role === "administrator" && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => {
              setShowModal(true);
              setAddon("client");
            }}
          >
            Add Client
          </button>
        )}

        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>


      {/* 🔹 Display Admin List */}
      <div className="mt-6 w-full max-w-md bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Users List</h2>
        {adminList.length > 0 ? (
          <ul>
            {adminList.map((admin) => (
              <li key={admin.uid} className="border-b p-2">
                <strong>Email:</strong> {admin.email} <br />
                <strong>Role:</strong> {admin.role}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No administrators found.</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              Add {addOn === "employee" ? "Employee" : "Client"}
            </h2>
            <p className="text-gray-600 mb-4">
              Enter details to add a new{" "}
              {addOn === "employee" ? "Employee" : "Client"}.
            </p>

            <input
              type="email"
              placeholder={`Enter ${
                addOn === "employee" ? "Employee" : "Client"
              } Email`}
              className="w-full p-2 border rounded mb-4"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />

            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowModal(false);
                  setAdminEmail("");
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={setUserRole}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministratorPage;
