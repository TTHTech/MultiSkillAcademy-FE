// src/pages/admin/report/course/PageCourseReport.tsx
import React, { useEffect, useState } from "react";
import FilterReport from "../../components/admin/ReportCourse/FilterReport";
import TableCourseReport from "../../components/admin/ReportCourse/TableReport";
import Header from "../../components/admin/common/Header";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default function PageCourseReport() {
  const [reports, setReports] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: "", reporterRole: "ALL" });
  const [refreshToggle, setRefreshToggle] = useState(false);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/admin/courses/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReports(data);
      applyFilter(data, filters);
    })();
  }, [refreshToggle]);

  const applyFilter = (data, { searchTerm, reporterRole }) => {
    let tmp = [...data];
    if (reporterRole !== "ALL") tmp = tmp.filter(r => r.reporterRole === reporterRole);
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      tmp = tmp.filter(
        r =>
          `${r.firstName} ${r.lastName}`.toLowerCase().includes(lower) ||
          r.title.toLowerCase().includes(lower) ||
          r.reason.toLowerCase().includes(lower)
      );
    }
    setDisplayed(tmp);
  };

  const handleFilter = flt => {
    setFilters(flt);
    applyFilter(reports, flt);
  };

  const triggerRefresh = () => setRefreshToggle(p => !p);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto">
        <Header title="Báo Cáo Khóa Học" />
        <div className="p-6">
          <FilterReport onFilter={handleFilter} />
          <TableCourseReport
            reports={displayed}
            triggerRefresh={triggerRefresh}
          />
        </div>
      </div>
    </div>
  );
}
