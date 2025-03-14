import React, { useState } from "react";
import MicroFormDesign from "./MicroFormDesign";

interface MicroFormData {
  client: string;
  dateSent: string;
  typeOfTest: string;
  sampleType: string;
  description: string;
  lotNumber: string;
  testSOP: string;
  manufactureDate: string;
  preliminaryResults: string;
  dateTested: string;
  dateCompleted: string;
  preliminaryResultsDate: string;
  testedBy: string;
  reviewedBy: string;
  pathogenResults: {
    [key: string]: { selected: boolean; present: boolean; absent: boolean };
  };
  otherSample: string;
}

interface MicroFormProps {
  onSubmit: (data: MicroFormData) => void;
  role: string;
}

const MicroForm: React.FC<MicroFormProps> = ({ onSubmit, role }) => {
  const [formData, setFormData] = useState<MicroFormData>({
    client: "",
    dateSent: "",
    typeOfTest: "",
    sampleType: "",
    description: "",
    lotNumber: "",
    testSOP: "",
    manufactureDate: "",
    preliminaryResults: "",
    dateTested: "",
    dateCompleted: "",
    preliminaryResultsDate: "",
    testedBy: "",
    reviewedBy: "",
    pathogenResults: {
      "E.coli": { selected: false, present: false, absent: false },
      "P. aeruginosa": { selected: false, present: false, absent: false },
      "P. aureus": { selected: false, present: false, absent: false },
      "Salmonella": { selected: false, present: false, absent: false },
      "Clostridia species": { selected: false, present: false, absent: false },
      "C. albicans": { selected: false, present: false, absent: false },
      "B. cepacia": { selected: false, present: false, absent: false },
      "Other": { selected: false, present: false, absent: false },
    },
    otherSample: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (organism: string) => {
    setFormData((prev) => ({
      ...prev,
      pathogenResults: {
        ...prev.pathogenResults,
        [organism]: {
          ...prev.pathogenResults[organism],
          selected: !prev.pathogenResults[organism].selected,
        },
      },
    }));
  };

  const handleCheckboxChange = (
    organism: string,
    field: "absent" | "present"
  ) => {
    setFormData((prev) => ({
      ...prev,
      pathogenResults: {
        ...prev.pathogenResults,
        [organism]: {
          ...prev.pathogenResults[organism],
          [field]: !prev.pathogenResults[organism][field],
          ...(field === "absent" ? { present: false } : { absent: false }),
        },
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <MicroFormDesign
      formData={formData}
      handleChange={handleChange}
      handleSelectChange={handleSelectChange}
      handleCheckboxChange={handleCheckboxChange}
      handleSubmit={handleSubmit}
      role={role}
    />
  );
};

export default MicroForm;

// import React, { useState } from "react";

// interface MicroFormData {
//   client: string;
//   dateSent: string;
//   typeOfTest: string;
//   sampleType: string;
//   description: string;
//   lotNumber: string;
//   testSOP: string;
//   manufactureDate: string;
//   preliminaryResults: string;
//   dateTested: string;
//   dateCompleted: string;
//   preliminaryResultsDate: string;
//   testedBy: string;
//   reviewedBy: string;
//   pathogenResults: {
//     [key: string]: { selected: boolean; present: boolean; absent: boolean };
//   };
//   otherSample: string;
// }

// interface MicroFormProps {
//   onSubmit: (data: MicroFormData) => void;
//   role: string;
// }

// const MicroForm: React.FC<MicroFormProps> = ({ onSubmit, role }) => {
//   const [formData, setFormData] = useState<MicroFormData>({
//     client: "",
//     dateSent: "",
//     typeOfTest: "",
//     sampleType: "",
//     description: "",
//     lotNumber: "",
//     testSOP: "",
//     manufactureDate: "",
//     preliminaryResults: "",
//     dateTested: "",
//     dateCompleted: "",
//     preliminaryResultsDate: "",
//     testedBy: "",
//     reviewedBy: "",
//     pathogenResults: {
//       "E.coli": { selected: false, present: false, absent: false },
//       "P. aeruginosa": { selected: false, present: false, absent: false },
//       "P. aureus": { selected: false, present: false, absent: false },
//       Salmonella: { selected: false, present: false, absent: false },
//       "Clostridia species": { selected: false, present: false, absent: false },
//       "C. albicans": { selected: false, present: false, absent: false },
//       "B. cepacia": { selected: false, present: false, absent: false },
//       Other: { selected: false, present: false, absent: false },
//     },
//     otherSample: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSelectChange = (organism: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       pathogenResults: {
//         ...prev.pathogenResults,
//         [organism]: {
//           ...prev.pathogenResults[organism],
//           selected: !prev.pathogenResults[organism].selected,
//         },
//       },
//     }));
//   };

//   const handleCheckboxChange = (organism: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       pathogenResults: {
//         ...prev.pathogenResults,
//         [organism]: {
//           ...prev.pathogenResults[organism],
//           present: !prev.pathogenResults[organism].present,
//           absent: !prev.pathogenResults[organism].absent,
//         },
//       },
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);

//     // ✅ Reset form to original state
//     setFormData({
//       client: "",
//       dateSent: "",
//       typeOfTest: "",
//       sampleType: "",
//       description: "",
//       lotNumber: "",
//       testSOP: "",
//       manufactureDate: "",
//       preliminaryResults: "",
//       dateTested: "",
//       dateCompleted: "",
//       preliminaryResultsDate: "",
//       testedBy: "",
//       reviewedBy: "",
//       pathogenResults: {
//         "E.coli": { selected: false, present: false, absent: false },
//         "P. aeruginosa": { selected: false, present: false, absent: false },
//         "P. aureus": { selected: false, present: false, absent: false },
//         Salmonella: { selected: false, present: false, absent: false },
//         "Clostridia species": {
//           selected: false,
//           present: false,
//           absent: false,
//         },
//         "C. albicans": { selected: false, present: false, absent: false },
//         "B. cepacia": { selected: false, present: false, absent: false },
//         Other: { selected: false, present: false, absent: false },
//       },
//       otherSample: "",
//     });

//     // ✅ Show a success message
//     alert("Report submitted successfully!");

//     // ✅ Optionally, log the reset state for debugging
//     console.log("Form reset to initial state:", formData);
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg border border-gray-300">
//       {/* Header Section */}
//       <div className="text-center">
//         <h1 className="text-xl font-bold">OMEGA BIOLOGICAL LABORATORY, INC.</h1>
//         <p className="text-sm">(FDA REG.)</p>
//         <p className="text-sm">56 PARK AVENUE, LYNDHURST, NJ 07071</p>
//         <p className="text-sm">Tel: (201) 883 1222 • Fax: (201) 883 0449</p>
//         <p className="text-sm">Email: lab@omegabiochem.com</p>
//       </div>

//       <hr className="my-4" />

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Report Section */}
//         {/* Report Section */}
//         <h2 className="text-lg font-bold text-center mt-4">REPORT</h2>
//         <div className="grid grid-cols-2 gap-4 text-sm border border-gray-500 p-4">
//           {[
//             ["Client", "client"],
//             ["Date Sent", "dateSent"],
//             ["Type of Test", "typeOfTest"],
//             ["Sample Type", "sampleType"],
//             ["Description", "description"],
//             ["Lot #", "lotNumber"],
//             ["Test SOP #", "testSOP"],
//             ["Manufacture Date", "manufactureDate"],
//             ["Preliminary Results", "preliminaryResults"],
//             ["Date Tested", "dateTested"],
//             ["Date Completed", "dateCompleted"],
//             ["Preliminary Results Date", "preliminaryResultsDate"],
//           ].map(([label, name], index) => (
//             <div key={index} className="flex items-center">
//               <label className="w-48 font-semibold">{label}:</label>
//               <input
//                 type={name.includes("date") ? "date" : "text"}
//                 name={name}
//                 value={(formData as any)[name]}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//           ))}
//         </div>

//         {/* TBC / TFC RESULTS Section */}
//         <h2 className="text-lg font-bold text-center">TBC / TFC RESULTS</h2>
//         <table className="w-full border border-gray-500 text-sm">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-500 p-1">Type of Test</th>
//               <th className="border border-gray-500 p-1">Dilution</th>
//               <th className="border border-gray-500 p-1">Gram Stain</th>
//               <th className="border border-gray-500 p-1">Result</th>
//               <th className="border border-gray-500 p-1">Specification</th>
//             </tr>
//           </thead>
//           <tbody>
//             {["Total Bacterial Count", "Total Mold & Yeast Count"].map(
//               (test, index) => (
//                 <tr key={index}>
//                   <td className="border border-gray-500 p-1">{test}</td>
//                   <td className="border border-gray-500 p-1">x 10^1</td>
//                   <td className="border border-gray-500 p-1"></td>
//                   <td className="border border-gray-500 p-1">CFU/mlg</td>
//                   <td className="border border-gray-500 p-1">Absent</td>
//                 </tr>
//               )
//             )}
//           </tbody>
//         </table>

//         {/* Pathogen Screening Section */}
//         <div className="border-t border-gray-500 mt-4">
//           <h2 className="text-lg font-bold text-center py-2">
//             PATHOGEN SCREENING
//           </h2>
//           <table className="w-full border border-gray-500 text-sm">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-500 p-1">Organism</th>
//                 <th className="border border-gray-500 p-1">Result</th>
//                 <th className="border border-gray-500 p-1">Specification</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.keys(formData.pathogenResults).map((organism, index) => (
//                 <tr key={index}>
//                   <td className="border border-gray-500 p-1">
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="mr-3"
//                         checked={formData.pathogenResults[organism].selected}
//                         onChange={() => handleSelectChange(organism)}
//                         disabled={role !== "client"}
//                       />{" "}
//                       {organism}
//                     </label>
//                   </td>
//                   <td className="border border-gray-500 p-1">
//                     <input
//                       type="checkbox"
//                       className="mr-2"
//                       checked={formData.pathogenResults[organism].absent}
//                       onChange={() => handleCheckboxChange(organism)}
//                     />{" "}
//                     Absent
//                     <span className="mx-3">/</span>
//                     <input
//                       type="checkbox"
//                       className="ml-3 mr-2"
//                       checked={formData.pathogenResults[organism].present}
//                       onChange={() => handleCheckboxChange(organism)}
//                     />{" "}
//                     Present in{" "}
//                     {organism === "Other" ? (
//                       <>
//                         <input
//                           type="text"
//                           className="w-12 border border-gray-500 ml-2 px-1"
//                           placeholder="g"
//                           value={formData.otherSample}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               otherSample: e.target.value,
//                             })
//                           }
//                         />{" "}
//                         g of sample
//                       </>
//                     ) : (
//                       <span>11 g of sample</span>
//                     )}
//                   </td>
//                   <td className="border border-gray-500 p-1">Absent</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Comments & Signatures */}
//         <div>
//           <label className="block text-sm font-semibold">Comments:</label>
//           <textarea
//             name="comments"
//             onChange={handleChange}
//             className="w-full border rounded p-2"
//             rows={2}
//           ></textarea>
//         </div>

//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div>
//             <label className="font-semibold">Tested By:</label>
//             <input
//               type="text"
//               name="testedBy"
//               value={formData.testedBy}
//               onChange={handleChange}
//               className="border p-2 rounded w-full"
//             />
//           </div>
//           <div>
//             <label className="font-semibold">Reviewed By:</label>
//             <input
//               type="text"
//               name="reviewedBy"
//               value={formData.reviewedBy}
//               onChange={handleChange}
//               className="border p-2 rounded w-full"
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
//         >
//           Submit Report
//         </button>
//       </form>
//     </div>
//   );
// };

// export default MicroForm;
