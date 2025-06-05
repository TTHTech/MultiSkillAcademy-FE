import React, { useEffect, useState } from "react";
import FilterReport from "../../components/admin/ReportSection/FilterReport";
import TableReport from "../../components/admin/ReportSection/TableReport";
import Header from "../../components/admin/common/Header";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default function PageSectionReport() {
  const [reports, setReports] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: "", reporterRole: "ALL" });
  const [refreshToggle, setRefreshToggle] = useState(false);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/admin/section/reports`, {
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
          r.courseTitle.toLowerCase().includes(lower) ||
          r.sectionTitle.toLowerCase().includes(lower) ||
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
        <Header title="Báo Cáo Chương Học" />
        <div className="p-6">
          <FilterReport onFilter={handleFilter} />
          <TableReport reports={displayed} triggerRefresh={triggerRefresh} />
        </div>
      </div>
    </div>
  );
}