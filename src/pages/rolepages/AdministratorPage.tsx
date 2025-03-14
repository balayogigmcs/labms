import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const AdministratorPage: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [addOn, setAddon] = useState<string>();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showForms, setShowForms] = useState(false);
  const [userEmail, setuserEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [selectedRole, setSelectedRole] = useState("employee");
  const [department, setDepartment] = useState("micro");
  const [showEmployees, setShowEmployees] = useState(true);
  const [showClients, setShowClients] = useState(false);
  const [userList, setuserList] = useState<
    {
      uid: string;
      email: string;
      role: string;
      department: string;
      clientName: string;
    }[]
  >([]);
  const [formsList, setFormsList] = useState<
    {
      id: string;
      userId: string;
      status: string;
      client: string;
      formType: string;
    }[]
  >([]);

  const [editUserModal, setEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    uid: string;
    role: string;
    department: string;
  } | null>(null);
  const [newRole, setNewRole] = useState("employee");
  const [newDepartment, setNewDepartment] = useState("micro");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchUserRole(currentUser.uid);
        await fetchuserList();
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
        setDepartment(userDoc.data().department);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchuserList = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const users = usersSnapshot.docs
        .filter((doc) => {
          const role = doc.data().role;
          return (
            role === "employee" || role === "client" || role === "frontdesk"
          );
        })
        .map((doc) => ({
          uid: doc.id,
          email: doc.data().email,
          role: doc.data().role,
          department: doc.data().department,
          clientName: doc.data().clientName,
        }));
      setuserList(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchFormsList = async () => {
    try {
      const formsCollection = collection(db, "laboratory_reports");
      const formsSnapshot = await getDocs(formsCollection);

      const forms = formsSnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId || "Unknown",
        status: doc.data().status || "Pending",
        formType: doc.data().formType,
        client: doc.data().client,
      }));

      setFormsList(forms);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  const openEditUserModal = (user: {
    uid: string;
    role: string;
    department: string;
  }) => {
    setEditingUser(user);
    setNewRole(user.role);
    setNewDepartment(user.department);
    setEditUserModal(true);
  };

  const updateUserRole = async () => {
    if (!editingUser) return;

    try {
      const confirmEdit = window.confirm(
        "Are you sure you want to update this user?"
      );
      if (!confirmEdit) return;

      const docRef = doc(db, "users", editingUser.uid);
      await updateDoc(docRef, {
        role: newRole,
        department: newDepartment,
      });

      alert("User role updated successfully!");
      setEditUserModal(false);
      fetchuserList(); // Refresh user list
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user role. Please try again.");
    }
  };

  const removeUser = async (uid: string) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to remove this user?"
      );
      if (!confirmDelete) return;

      await deleteDoc(doc(db, "users", uid));

      alert("User removed successfully!");
      console.log(`User with UID: ${uid} removed.`);

      fetchuserList();
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user. Please try again.");
    }
  };

  // Function to add an user user without logging out the current user
  const setUserRole = async () => {
    if (!userEmail) {
      alert("Please enter an User email.");
      return;
    }

    try {
      // ✅ Store the currently logged-in user
      const currentUser = auth.currentUser;

      // ✅ Create the administrator account
      const password = userEmail.replace("@gmail.com", "");
      const userRef = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        password
      );
      const newUser = userRef.user;

      // ✅ Store user details in Firestore
      const userDocRef = doc(db, "users", newUser.uid);
      if (department === "micro" || department === "chemistry") {
        await setDoc(userDocRef, {
          email: userEmail,
          role: addOn === "employee" ? "employee" : "client",
          department: department,
          createdAt: Timestamp.fromDate(new Date()),
        });
      } else {
        await setDoc(userDocRef, {
          email: userEmail,
          role: "frontdesk",
          department: department,
          createdAt: Timestamp.fromDate(new Date()),
        });
      }

      alert(
        `${addOn === "employee" ? "Employee" : "Client"} added successfully!`
      );

      // ✅ Re-authenticate back to the original user
      if (currentUser) {
        await auth.updateCurrentUser(currentUser);
      }

      // ✅ Reset modal and input field
      setShowModal(false);
      setuserEmail("");
    } catch (error) {
      console.error("Error in adding user to Firestore:", error);
    }
  };

  return (
    <div className="flex flex-col pt-10 items-center min-h-screen bg-gray-200">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-700">
        Administrator Dashboard
      </h1>

      {/* Buttons for Managing Employees, Clients, and Forms */}
      <div className="flex space-x-6 mb-6">
        <button
          className={`px-6 py-3 rounded-lg text-white font-semibold transition-all ${
            showEmployees ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500"
          }`}
          onClick={() => {
            setShowEmployees(true);
            setShowClients(false);
            setShowForms(false);
          }}
        >
          Manage Employees
        </button>

        <button
          className={`px-6 py-3 rounded-lg text-white font-semibold transition-all ${
            showClients ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500"
          }`}
          onClick={() => {
            setShowEmployees(false);
            setShowClients(true);
            setShowForms(false);
          }}
        >
          Manage Clients
        </button>

        <button
          className={`px-6 py-3 rounded-lg text-white font-semibold transition-all ${
            showForms ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500"
          }`}
          onClick={() => {
            setShowEmployees(false);
            setShowClients(false);
            setShowForms(true);
          }}
        >
          Manage Forms
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 overflow-y-auto h-[500px]">
        {/* Manage Employees */}
        {showEmployees && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">
                Employee List
              </h2>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={() => {
                  setShowUserModal(true);
                  setShowModal(true);
                  setAddon("employee");
                }}
              >
                Add Employee
              </button>
            </div>

            {userList
              .filter(
                (user) => user.role === "employee" || user.role === "frontdesk"
              )
              .map((user) => (
                <div
                  key={user.uid}
                  className="border-b p-4 flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {user.role}
                    </p>
                    <p>
                      <strong>Department:</strong> {user.department}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => openEditUserModal(user)}
                    >
                      Edit Role
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => removeUser(user.uid)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </>
        )}

        {/* Manage Clients */}
        {showClients && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">Client List</h2>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={() => {
                  setShowUserModal(true);
                  setShowModal(true);
                  setAddon("client");
                }}
              >
                Add Client
              </button>
            </div>

            {userList
              .filter((user) => user.role === "client")
              .map((user) => (
                <div
                  key={user.uid}
                  className="border-b p-4 flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {user.role}
                    </p>
                    <p>
                      <strong>ClientName:</strong> {user.clientName}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => removeUser(user.uid)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </>
        )}

        {/* Manage Forms */}
        {showForms && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">Forms List</h2>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={() => {}}
              >
                Add Forms
              </button>
            </div>

            {formsList.map((form) => (
              <div
                key={form.id}
                className="border-b p-4 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Form ID:</strong> {form.id}
                  </p>
                  <p>
                    <strong>Status:</strong> {form.status}
                  </p>
                  <p>
                    <strong>Form Type:</strong> {form.formType}
                  </p>
                  <p>
                    <strong>Client:</strong> {form.client}
                  </p>
                </div>
                <div className="flex gap-4">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded">
                    View
                  </button>
                  <button className="bg-green-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {editUserModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit User Role</h2>

            <label className="block text-gray-700">Role:</label>
            <select
              className="w-full p-2 border rounded mb-4"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="employee">Employee</option>
              <option value="client">Client</option>
              <option value="frontdesk">FrontDesk</option>
            </select>

            <label className="block text-gray-700">Department:</label>
            <select
              className="w-full p-2 border rounded mb-4"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
            >
              <option value="micro">Micro</option>
              <option value="chemistry">Chemistry</option>
              <option value="frontdesk">FrontDesk</option>
            </select>

            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setEditUserModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={updateUserRole}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              Add {addOn === "employee" ? "Employee" : "Client"}
            </h2>

            {addOn === "employee" ? (
              <select
                className="w-full p-2 border rounded mb-4"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="micro">Micro</option>
                <option value="chemistry">Chemistry</option>
                <option value="frontdesk">FrontDesk</option>
              </select>
            ) : null}

            <input
              type="email"
              placeholder="Enter Email"
              className="w-full p-2 border rounded mb-4"
              value={userEmail}
              onChange={(e) => setuserEmail(e.target.value)}
            />

            {addOn === "client" ? (
              <input
                type="text"
                placeholder="Enter ClientName"
                className="w-full p-2 border rounded mb-4"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            ) : null}
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
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

