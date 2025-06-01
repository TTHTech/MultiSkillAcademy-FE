import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import certificateBg from "../../../images/certificate/certificate.png";
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
import { decodeId } from "../../../utils/hash";
import { useParams } from "react-router-dom";

const CertificateGenerator = () => {
  const { courseHash } = useParams();
  const courseId = decodeId(courseHash);
  const [certificate, setCertificate] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/student/certificate/${userId}/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCertificate(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchData();
  }, [userId, token]);

  const downloadCertificate = () => {
    const certificateElement = document.getElementById("certificate");
    html2canvas(certificateElement, { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "certificate-template.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="flex flex-col items-center p-6">
      <button
        onClick={downloadCertificate}
        className="mb-6 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
      >
        Tải chứng chỉ
      </button>
      <div
        id="certificate"
        className="relative"
        style={{
          width: "800px",
          height: "500px",
          backgroundImage: `url(${certificateBg})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <h2
          className="absolute text-3xl font-serif italic font-bold"
          style={{
            left: "310px",
            top: "320px",
          }}
        >
          {certificate.firstName} {certificate.lastName}
        </h2>
        <h3
          className="absolute text-4xl font-serif font-semibold"
          style={{
            left: "150px",
            top: "190px",
            maxWidth: "600px",
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {certificate.title}
        </h3>
         <div
          className="absolute text-gray-700"
          style={{ left: "150px", top: "410px" }}
        >
          <p className="text-lg font-medium italic tracking-wide mt-4">
            {certificate.certificateCode}
          </p>
        </div>
        <div
          className="absolute text-gray-700"
          style={{ left: "550px", top: "410px" }}
        >
          <p className="text-lg font-medium italic tracking-wide mt-4">
            {new Date(certificate.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
