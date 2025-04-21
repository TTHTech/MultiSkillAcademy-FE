import React, { useEffect, useState } from "react";
import FilterReport from "../../components/admin/ReportReviewCourse/FilterReport";
import TableReport from "../../components/admin/ReportReviewCourse/TableReport";
import Header from "../../components/admin/common/Header";

export default function ReportPage() {
  const [reports, setReports] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    reporterRole: "ALL",
  });
  const [refreshToggle, setRefreshToggle] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          "http://localhost:8080/api/admin/reviews/reports",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setReports(data);
        applyFilter(data, filters);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [refreshToggle]);

  const applyFilter = (data, { searchTerm, reporterRole }) => {
    let filtered = [...data];
    if (reporterRole !== "ALL")
      filtered = filtered.filter((r) => r.reporterRole === reporterRole);
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          `${r.firstName} ${r.lastName}`.toLowerCase().includes(lower) ||
          r.comment.toLowerCase().includes(lower) ||
          r.reason.toLowerCase().includes(lower)
      );
    }
    setDisplayed(filtered);
  };

  const handleFilter = (flt) => {
    setFilters(flt);
    applyFilter(reports, flt);
  };

  const handleDelete = (id) => {
    setReports((prev) => prev.filter((r) => r.reportId !== id));
    setDisplayed((prev) => prev.filter((r) => r.reportId !== id));
  };

  const triggerRefresh = () => setRefreshToggle((prev) => !prev);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto">
        <Header title="Report Reviews" />
        <div className="p-6">
          <FilterReport onFilter={handleFilter}/>
          <TableReport
            reports={displayed}
            onDeleteReport={handleDelete}
            triggerRefresh={triggerRefresh}
          />
        </div>
      </div>
    </div>
  );
}
