import React, { useState } from "react";
import { db } from "../firebaseConfig"; // Ensure Firebase is configured
import { collection, addDoc } from "firebase/firestore";

const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        message,
        timestamp: new Date(),
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-center text-2xl font-bold mb-4">Contact Us</h2>
        {success && <p className="text-green-500 text-center">Message sent successfully!</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block font-medium">Name:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium">Email:</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium">Message:</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;


// import React from "react";

// const ContactPage: React.FC = () => {
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white shadow-lg rounded-lg p-6 w-96">
//         <h2 className="text-center text-2xl font-bold mb-4">Contact Us</h2>
//         <form>
//           <div className="mb-3">
//             <label className="block font-medium">Name:</label>
//             <input
//               type="text"
//               className="w-full p-2 border border-gray-300 rounded"
//               placeholder="Enter your name"
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="block font-medium">Email:</label>
//             <input
//               type="email"
//               className="w-full p-2 border border-gray-300 rounded"
//               placeholder="Enter your email"
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="block font-medium">Message:</label>
//             <textarea
//               className="w-full p-2 border border-gray-300 rounded"
//               placeholder="Enter your message"
//               rows={4}
//               required
//             ></textarea>
//           </div>
//           <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
//             Send Message
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ContactPage;