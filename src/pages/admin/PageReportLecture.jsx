import React, { useEffect, useState } from "react";
import Header from "../../components/admin/common/Header";
import FilterReport from "../../components/admin/ReportLecture/FilterReport";
import TableReport from "../../components/admin/ReportLecture/TableReport";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default function PageReportLecture() {
  const [reports, setReports] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: "", reporterRole: "ALL" });
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `${baseUrl}/api/admin/lectures/reports`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setReports(data);
        applyFilter(data, filters);
      } catch (err) {
        console.error(err);
      }
    })();
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
          r.title.toLowerCase().includes(lower) ||
          r.reason.toLowerCase().includes(lower)
      );
    }
    setDisplayed(filtered);
  };

  const handleFilter = (flt) => {
    setFilters(flt);
    applyFilter(reports, flt);
  };

  const triggerRefresh = () => setRefreshToggle((prev) => !prev);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto">
        <Header title="Báo Cáo Bài Học" />
        <div className="p-6">
          <FilterReport onFilter={handleFilter} />
          <TableReport
            reports={displayed}
            detailLoading={detailLoading}
            setDetailLoading={setDetailLoading}
            triggerRefresh={triggerRefresh}
          />
        </div>
      </div>
    </div>
  );
}
