import React, { useEffect, useState } from "react";
import { encodeId } from "../../../utils/hash";

const CertificateList = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const certificatesPerPage = 4;
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/student/certificate/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch certificates");
        }
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCertificates();
  }, [userId, baseUrl, token]);
  const filteredCertificates = certificates.filter((cert) => {
    const fullName = `${cert.firstName} ${cert.lastName}`.toLowerCase();
    return (
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase()) ||
      cert.certificateCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const totalPages = Math.ceil(
    filteredCertificates.length / certificatesPerPage
  );
  const indexOfLast = currentPage * certificatesPerPage;
  const indexOfFirst = indexOfLast - certificatesPerPage;
  const currentSlice = filteredCertificates.slice(indexOfFirst, indexOfLast);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const slots = Array.from(
    { length: certificatesPerPage },
    (_, idx) => currentSlice[idx] || null
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search certificates by title, name, or code..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-6">
        {slots.map((cert, idx) => (
          <div
            key={idx}
            onClick={() =>
              window.open(`/certificate/${encodeId(cert.courseId)}`)
            }
            className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-md transition hover:shadow-lg flex flex-col justify-between cursor-pointer ${
              cert ? "" : "opacity-0 pointer-events-none"
            }`}
          >
            {cert && (
              <>
                <h2 className="text-xl font-semibold text-indigo-600 mb-2">
                  {cert.title}
                </h2>
                <p className="text-gray-700">
                  <span className="font-medium">Tên học viên:</span>{" "}
                  {cert.firstName} {cert.lastName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {cert.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Mã chứng chỉ:</span>{" "}
                  <span className="font-mono">{cert.certificateCode}</span>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Ngày cấp chứng chỉ:{" "}
                  {new Date(cert.createdAt).toLocaleDateString()}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        <span className="text-gray-700">
          Trang {currentPage} trên {totalPages || 1}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default CertificateList;
