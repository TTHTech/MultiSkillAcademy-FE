import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import certificateBg from "../../../images/certificate/certificate.jpg";
import axios from "axios";

const CertificateGenerator = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseName = queryParams.get("courseName");

  const [studentName, setStudentName] = useState("");
  const [date] = useState(new Date().toLocaleDateString("vi-VN"));
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/student/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token vào header Authorization
            },
          }
        );
        const { firstName, lastName } = response.data;
        setStudentName(`${firstName} ${lastName}`);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchData();
  }, [userId, token]);

  const downloadCertificate = () => {
    const certificateElement = document.getElementById("certificate");
    html2canvas(certificateElement).then((canvas) => {
      const link = document.createElement("a");
      link.download = "certificate.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Your Certificate</h1>
      <button
        onClick={downloadCertificate}
        className="mb-6 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
      >
        Download Certificate
      </button>
      <div
        id="certificate"
        className="certificate bg-cover relative w-[800px] h-[600px]"
        style={{ backgroundImage: `url(${certificateBg})` }}
      >
        <div className="absolute left-16 top-48 flex flex-col justify-start items-start text-left text-black">
          <h2 className="text-3xl font-serif italic font-bold mb-6">
            {studentName}
          </h2>
          <h3 className="text-4xl font-serif font-semibold mb-4">
            {courseName}
          </h3>
          <p className="text-lg font-sans font-light">
            This professional has demonstrated initiative and a commitment to
          </p>
          <p className="text-lg font-sans font-light">
            deepening their skills and advancing their career. Well done!
          </p>
          <p className="text-lg font-sans font-light mt-4">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
