import React, { useState } from "react";
import BioChemFormDesign from "./BioChemFormDesign";

interface FormData {
  client: string;
  poNumber: string;
  dateSent: string;
  sampleDescription: string;
  lotBatch: string;
  typeOfTest: string;
  numberOfActives: string;
  formulaNumber: string;
  manufactureDate: string;
  sampleType: string;
  tests: string[];
  reasonForChanges: string;
  witness: string;
  testedBy: string;
  reviewedBy: string;
}

interface BioChemFormProps {
  onSubmit: (data: FormData) => void;
  role: string;
}

const BioChemForm: React.FC<BioChemFormProps> = ({ onSubmit, role }) => {
  const [formData, setFormData] = useState<FormData>({
    client: "",
    poNumber: "",
    dateSent: "",
    sampleDescription: "",
    lotBatch: "",
    typeOfTest: "",
    numberOfActives: "",
    formulaNumber: "",
    manufactureDate: "",
    sampleType: "",
    tests: [],
    reasonForChanges: "",
    witness: "",
    testedBy: "",
    reviewedBy: "",
  });

  const testOptions: string[] = [
    "Octyl Methoxycinnamate",
    "Benzophenone-3",
    "Titanium Dioxide",
    "Zinc Oxide",
    "Menthyl Anthranilate",
    "Avobenzone",
    "Salicylic Acid",
    "Benzoyl Peroxide",
    "Hydroquinone",
    "Octocrylene",
    "Benzalkonium Chloride",
    "Homosalate",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckBoxChange = (test: string) => {
    setFormData((prev) => ({
      ...prev,
      tests: prev.tests.includes(test)
        ? prev.tests.filter((t) => t !== test)
        : [...prev.tests, test],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      client: "",
      poNumber: "",
      dateSent: "",
      sampleDescription: "",
      lotBatch: "",
      typeOfTest: "",
      numberOfActives: "",
      formulaNumber: "",
      manufactureDate: "",
      sampleType: "",
      tests: [],
      reasonForChanges: "",
      witness: "",
      testedBy: "",
      reviewedBy: "",
    });

    // ✅ Show a success message
    alert("Report submitted successfully!");

    // ✅ Optionally, log the reset state for debugging
    console.log("Form reset to initial state:", formData);
  };
  return (
    <BioChemFormDesign
      formData={formData}
      handleChange={handleChange}
      handleCheckBoxChange={handleCheckBoxChange}
      handleSubmit={handleSubmit}
      role={role}
      testOptions={testOptions}
    />
  );

  // return (
  //   <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
  //     <h1 className="text-xl font-bold text-center">
  //       BIOCHEM LABORATORY, INC.
  //     </h1>
  //     <p className="text-center text-sm">56 PARK AVENUE, LYNDHURST, NJ 07071</p>
  //     <p className="text-center text-sm">
  //       Tel: (201) 883 1222 • Fax: (201) 883 0449
  //     </p>
  //     <p className="text-center text-sm">Email: lab@omegabiochem.com</p>
  //     <hr className="my-2" />

  //     <h2 className="text-lg font-semibold text-center">LABORATORY REPORT</h2>

  //     <form onSubmit={handleSubmit} className="space-y-4">
  //       <div className="grid grid-cols-2 gap-4">
  //         {Object.keys(formData)
  //           .slice(0, 10)
  //           .map((key) => (
  //             <div key={key} className="relative">
  //               <label className="absolute top-0 left-2 text-m text-600 bg-white px-1">
  //                 {key.replace(/([A-Z])/g, " $1").trim()}
  //               </label>
  //               <input
  //                 type={key.includes("date") ? "date" : "text"}
  //                 name={key}
  //                 value={(formData as any)[key]}
  //                 onChange={handleChange}
  //                 className="border p-2 rounded w-full mt-4"
  //               />
  //             </div>
  //           ))}
  //       </div>

  //       <h3 className="text-lg font-semibold">Active To Be Tested:</h3>
  //       <table className="w-full border mt-2">
  //         <thead>
  //           <tr className="bg-gray-200 text-left">
  //             <th className="border px-2 py-1">Check</th>
  //             <th className="border px-2 py-1">Active Ingredient</th>
  //             <th className="border px-2 py-1">Formula Content (%)</th>
  //             <th className="border px-2 py-1">Results</th>
  //             <th className="border px-2 py-1">Date Tested/Initial</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {testOptions.map((test, index) => (
  //             <tr key={index}>
  //               <td className="border px-2 py-1 text-center">
  //                 <input
  //                   type="checkbox"
  //                   onChange={() => handleCheckboxChange(test)}
  //                 />
  //               </td>
  //               <td className="border px-2 py-1">{test}</td>
  //               <td className="border px-2 py-1">
  //                 <input type="text" className="w-full p-1 border" />
  //               </td>
  //               <td className="border px-2 py-1">
  //                 <input type="text" className="w-full p-1 border" />
  //               </td>
  //               <td className="border px-2 py-1">
  //                 <input type="text" className="w-full p-1 border" />
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>

  //       <div>
  //         <label className="block text-sm font-medium">
  //           Reason For Changes:
  //         </label>
  //         <textarea
  //           name="reasonForChanges"
  //           value={formData.reasonForChanges}
  //           onChange={handleChange}
  //           className="w-full border rounded p-2"
  //           rows={2}
  //         ></textarea>
  //       </div>

  //       <div>
  //         <label className="block text-sm font-medium">Witness:</label>
  //         <textarea
  //           name="witness"
  //           value={formData.witness}
  //           onChange={handleChange}
  //           className="w-full border rounded p-2"
  //           rows={1}
  //         ></textarea>
  //       </div>

  //       <div className="grid grid-cols-2 gap-4">
  //         <input
  //           type="text"
  //           name="testedBy"
  //           placeholder="Tested By"
  //           value={formData.testedBy}
  //           onChange={handleChange}
  //           className="border p-2 rounded w-full"
  //         />
  //         <input
  //           type="text"
  //           name="reviewedBy"
  //           placeholder="Reviewed By"
  //           value={formData.reviewedBy}
  //           onChange={handleChange}
  //           className="border p-2 rounded w-full"
  //         />
  //       </div>

  //       <button
  //         type="submit"
  //         className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
  //       >
  //         Submit
  //       </button>
  //     </form>
  //   </div>
  // );
};

export default BioChemForm;
