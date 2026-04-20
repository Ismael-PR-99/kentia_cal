import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getUserRole } from "../lib/auth.js";

export default function Datasets() {
  const role = getUserRole();
  const [search, setSearch] = useState("");
  const [swRelease, setSWRelease] = useState("all");
  const [context, setContext] = useState("all");
  const [lifecycleState, setLifecycleState] = useState("all");
  const [state, setState] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [sortColumn, setSortColumn] = useState("updated");
  const [sortOrder, setSortOrder] = useState("desc");

  // Mock data
  const mockDatasets = [
    { id: 1, lifecycle: "EDIT", datasetId: "DS-001", swRelease: "v1.0.0", context: "ECU-A", variant: "VAR-001", updated: "2026-04-20", state: "Draft" },
    { id: 2, lifecycle: "APP", datasetId: "DS-002", swRelease: "v1.0.0", context: "ECU-B", variant: "VAR-002", updated: "2026-04-19", state: "Pending" },
    { id: 3, lifecycle: "RC", datasetId: "DS-003", swRelease: "v1.1.0", context: "ECU-A", variant: "VAR-003", updated: "2026-04-18", state: "Review" },
    { id: 4, lifecycle: "REL", datasetId: "DS-004", swRelease: "v1.1.0", context: "ECU-C", variant: "VAR-004", updated: "2026-04-17", state: "Released" },
    { id: 5, lifecycle: "DEP", datasetId: "DS-005", swRelease: "v0.9.0", context: "ECU-A", variant: "VAR-005", updated: "2026-04-16", state: "Deprecated" },
    { id: 6, lifecycle: "EDIT", datasetId: "DS-006", swRelease: "v1.2.0", context: "ECU-B", variant: "VAR-006", updated: "2026-04-15", state: "Draft" },
    { id: 7, lifecycle: "APP", datasetId: "DS-007", swRelease: "v1.2.0", context: "ECU-C", variant: "VAR-007", updated: "2026-04-14", state: "Pending" },
    { id: 8, lifecycle: "RC", datasetId: "DS-008", swRelease: "v1.1.0", context: "ECU-B", variant: "VAR-008", updated: "2026-04-13", state: "Review" },
    { id: 9, lifecycle: "REL", datasetId: "DS-009", swRelease: "v1.0.0", context: "ECU-A", variant: "VAR-009", updated: "2026-04-12", state: "Released" },
    { id: 10, lifecycle: "EDIT", datasetId: "DS-010", swRelease: "v1.3.0", context: "ECU-D", variant: "VAR-010", updated: "2026-04-11", state: "Draft" },
    { id: 11, lifecycle: "APP", datasetId: "DS-011", swRelease: "v1.3.0", context: "ECU-A", variant: "VAR-011", updated: "2026-04-10", state: "Pending" },
    { id: 12, lifecycle: "RC", datasetId: "DS-012", swRelease: "v1.2.0", context: "ECU-C", variant: "VAR-012", updated: "2026-04-09", state: "Review" },
    { id: 13, lifecycle: "REL", datasetId: "DS-013", swRelease: "v1.1.0", context: "ECU-B", variant: "VAR-013", updated: "2026-04-08", state: "Released" },
  ];

  // Filter data
  const filteredData = useMemo(() => {
    return mockDatasets.filter((item) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        item.datasetId.toLowerCase().includes(searchLower) ||
        item.variant.toLowerCase().includes(searchLower);

      const matchesSWRelease = swRelease === "all" || item.swRelease === swRelease;
      const matchesContext = context === "all" || item.context === context;
      const matchesState = lifecycleState === "all" || item.lifecycle === lifecycleState;
      const matchesDateFrom = !dateFrom || new Date(item.updated) >= new Date(dateFrom);
      const matchesDateTo = !dateTo || new Date(item.updated) <= new Date(dateTo);

      return (
        matchesSearch &&
        matchesSWRelease &&
        matchesContext &&
        matchesState &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [search, swRelease, context, lifecycleState, dateFrom, dateTo]);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
    return sorted;
  }, [filteredData, sortColumn, sortOrder]);

  // Paginate
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIdx, startIdx + rowsPerPage);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("desc");
    }
  };

  const handleClear = () => {
    setSearch("");
    setSWRelease("all");
    setContext("all");
    setLifecycleState("all");
    setState("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const getLifecycleBadge = (lifecycle) => {
    const badges = {
      EDIT: "badge-edit",
      APP: "badge-app",
      RC: "badge-rc",
      REL: "badge-rel",
      DEP: "badge-dep",
    };
    const text = {
      EDIT: "EDIT",
      APP: "APP",
      RC: "RC",
      REL: "REL",
      DEP: "DEP",
    };
    return <span className={badges[lifecycle]}>{text[lifecycle]}</span>;
  };

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return <span className="text-xs text-gray-400">⇅</span>;
    return <span className="text-xs text-green-dark">{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold text-gray-950">Calibration Datasets</h1>
      </div>

      {/* Filters Row 1 */}
      <div className="flex gap-3 flex-wrap items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search... DS ID/Variant/VIN/"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>

        {/* Dropdowns */}
        <select
          value={swRelease}
          onChange={(e) => {
            setSWRelease(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950 cursor-pointer"
        >
          <option value="all">All Releases</option>
          <option value="v1.0.0">v1.0.0</option>
          <option value="v1.1.0">v1.1.0</option>
          <option value="v1.2.0">v1.2.0</option>
          <option value="v1.3.0">v1.3.0</option>
        </select>

        <select
          value={context}
          onChange={(e) => {
            setContext(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950 cursor-pointer"
        >
          <option value="all">All Contexts</option>
          <option value="ECU-A">ECU-A</option>
          <option value="ECU-B">ECU-B</option>
          <option value="ECU-C">ECU-C</option>
          <option value="ECU-D">ECU-D</option>
        </select>

        <select
          value={lifecycleState}
          onChange={(e) => {
            setLifecycleState(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950 cursor-pointer"
        >
          <option value="all">Lifecycle State</option>
          <option value="EDIT">EDIT</option>
          <option value="APP">APP</option>
          <option value="RC">RC</option>
          <option value="REL">REL</option>
          <option value="DEP">DEP</option>
        </select>

        {/* New Dataset Button */}
        {(role === "admin" || role === "supplier") && (
          <Link
            to="/dashboard/datasets/new"
            className="btn-primary text-sm whitespace-nowrap"
          >
            + New Dataset
          </Link>
        )}
      </div>

      {/* Filters Row 2 */}
      <div className="flex gap-3 flex-wrap items-center text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 cursor-pointer" />
          <span className="text-gray-600">Search</span>
        </label>

        <select
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 border border-gray-light rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950 cursor-pointer"
        >
          <option value="all">All States</option>
          <option value="Draft">Draft</option>
          <option value="Pending">Pending</option>
          <option value="Review">Review</option>
          <option value="Released">Released</option>
          <option value="Deprecated">Deprecated</option>
        </select>

        <button
          onClick={handleClear}
          className="px-3 py-1.5 text-gray-600 hover:text-gray-950 text-sm transition"
        >
          Clear
        </button>

        {/* Date Range */}
        <div className="flex gap-2 items-center">
          <span className="text-gray-600">From:</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2 py-1.5 border border-gray-light rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950"
          />
          <span className="text-gray-600">To:</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2 py-1.5 border border-gray-light rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="table-header">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-950 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("lifecycle")}>
                <div className="flex items-center gap-2">
                  Lifecycle State <SortIcon column="lifecycle" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-950 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("datasetId")}>
                <div className="flex items-center gap-2">
                  Dataset ID <SortIcon column="datasetId" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-950 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("swRelease")}>
                <div className="flex items-center gap-2">
                  SW Release <SortIcon column="swRelease" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-950 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("context")}>
                <div className="flex items-center gap-2">
                  Context <SortIcon column="context" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-950 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("variant")}>
                <div className="flex items-center gap-2">
                  Variant ID <SortIcon column="variant" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-950 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("updated")}>
                <div className="flex items-center gap-2">
                  Updated <SortIcon column="updated" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-950">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr className="table-row">
                <td colSpan="7" className="py-8 px-4 text-center text-gray-600">
                  No datasets found
                </td>
              </tr>
            ) : (
              paginatedData.map((dataset) => (
                <tr key={dataset.id} className="table-row cursor-pointer hover:bg-gray-50" onClick={() => {}}>
                  <td className="py-3 px-4">{getLifecycleBadge(dataset.lifecycle)}</td>
                  <td className="py-3 px-4 font-medium text-gray-950">{dataset.datasetId}</td>
                  <td className="py-3 px-4 text-gray-600">{dataset.swRelease}</td>
                  <td className="py-3 px-4 text-gray-600">{dataset.context}</td>
                  <td className="py-3 px-4 text-gray-600">{dataset.variant}</td>
                  <td className="py-3 px-4 text-gray-600 text-xs">{dataset.updated}</td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/dashboard/datasets/${dataset.id}`}
                      className="text-green-dark hover:font-semibold transition font-medium text-xs"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-600 pt-4">
        {/* Legend */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="badge-edit">EDIT</span>
            <span>EDIT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-app">APP</span>
            <span>UNDER APPROVAL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-rc">RC</span>
            <span>RELEASE CANDIDATE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-rel">REL</span>
            <span>RELEASED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-dep">DEP</span>
            <span>DEPRECATED</span>
          </div>
        </div>

        {/* Pagination Info */}
        <div className="flex items-center gap-4">
          <span>
            Showing {startIdx + 1}-{Math.min(startIdx + rowsPerPage, sortedData.length)} of{" "}
            {sortedData.length}
          </span>
          <div className="flex items-center gap-1">
            <span>Rows per page:</span>
            <select className="px-2 py-1 border border-gray-light rounded text-xs bg-white text-gray-950 cursor-pointer">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 border border-gray-light rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ←
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let page;
            if (totalPages <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }
            return page;
          }).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-2 py-1 border rounded text-sm transition ${
                currentPage === page
                  ? "bg-green-dark text-white border-green-dark"
                  : "border-gray-light hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 py-1">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-2 py-1 border border-gray-light rounded text-sm hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border border-gray-light rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
