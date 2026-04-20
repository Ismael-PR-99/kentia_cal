import { useState } from "react";
import { useParams } from "react-router-dom";

export default function DatasetDetail() {
  const { id } = useParams() || { id: "DS-00451" };
  const [activeTab, setActiveTab] = useState("labels");
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState(new Set());
  const [modifiedOnly, setModifiedOnly] = useState(false);
  const [regulatory, setRegulatory] = useState(false);
  const [paramCust, setParamCust] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Mock data for labels
  const mockLabels = [
    { id: 1, label: "FUEL_PRESSURE", value: "50.5", unit: "bar", level: "Production", confidence: "Validated", regulatory: true, paramCust: false, modified: false },
    { id: 2, label: "IGNITION_TIMING", value: "12.3", unit: "°CA", level: "Variant-specific", confidence: "Estimated", regulatory: false, paramCust: true, modified: true },
    { id: 3, label: "INJECTION_DURATION", value: "3.2", unit: "ms", level: "Production", confidence: "Validated", regulatory: true, paramCust: true, modified: false },
    { id: 4, label: "IDLE_RPM", value: "750", unit: "rpm", level: "Post-sales", confidence: "Estimated", regulatory: false, paramCust: false, modified: true },
    { id: 5, label: "MAX_TORQUE", value: "250", unit: "Nm", level: "Production", confidence: "Validated", regulatory: true, paramCust: false, modified: false },
    { id: 6, label: "BOOST_PRESSURE", value: "1.8", unit: "bar", level: "Variant-specific", confidence: "Validated", regulatory: false, paramCust: true, modified: false },
    { id: 7, label: "EXHAUST_TEMP", value: "850", unit: "°C", level: "Production", confidence: "Estimated", regulatory: true, paramCust: false, modified: true },
    { id: 8, label: "LAMBDA_TARGET", value: "1.0", unit: "ratio", level: "Production", confidence: "Validated", regulatory: true, paramCust: false, modified: false },
    { id: 9, label: "EGR_RATE", value: "15", unit: "%", level: "Variant-specific", confidence: "Estimated", regulatory: true, paramCust: false, modified: false },
    { id: 10, label: "SCRAP_THRESHOLD", value: "0.05", unit: "g/s", level: "Post-sales", confidence: "Validated", regulatory: false, paramCust: false, modified: false },
    { id: 11, label: "VVT_ADVANCE", value: "8.5", unit: "°CA", level: "Production", confidence: "Estimated", regulatory: false, paramCust: true, modified: true },
    { id: 12, label: "CAM_DURATION", value: "280", unit: "°CA", level: "Variant-specific", confidence: "Validated", regulatory: false, paramCust: false, modified: false },
  ];

  // Filter labels
  const filteredLabels = mockLabels.filter((label) => {
    const matchesSearch = label.label.toLowerCase().includes(search.toLowerCase());
    const matchesModified = !modifiedOnly || label.modified;
    const matchesRegulatory = !regulatory || label.regulatory;
    const matchesParamCust = !paramCust || label.paramCust;
    return matchesSearch && matchesModified && matchesRegulatory && matchesParamCust;
  });

  const totalPages = Math.ceil(filteredLabels.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedLabels = filteredLabels.slice(startIdx, startIdx + rowsPerPage);

  const handleRowSelect = (labelId) => {
    const newSelected = new Set(selectedLabels);
    if (newSelected.has(labelId)) {
      newSelected.delete(labelId);
    } else {
      newSelected.add(labelId);
    }
    setSelectedLabels(newSelected);
  };

  const handleLabelClick = (label) => {
    setSelectedLabel(label);
  };

  const regulatoryCount = filteredLabels.filter((l) => l.regulatory).length;
  const paramCustCount = filteredLabels.filter((l) => l.paramCust).length;

  const datasetMetadata = {
    number: "DS-00451",
    lifecycle: "EDIT",
    createdBy: "jwilson",
    updated: "2026-02-18",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-950">Dataset {datasetMetadata.number}</h1>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-edit">EDIT</span>
              <span className="text-gray-600">Lifecycle Stat</span>
            </div>
            <div className="text-xs text-gray-600 mb-2">Created by {datasetMetadata.createdBy}</div>
            <div className="text-xs text-gray-600">Updated: {datasetMetadata.updated}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b border-gray-light">
        {["Overview", "Labels", "Artefacts", "Change Log"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab.toLowerCase());
              setCurrentPage(1);
            }}
            className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === tab.toLowerCase()
                ? "text-green-dark border-green-dark"
                : "text-gray-600 border-transparent hover:text-gray-950"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-950 mb-4">Overview</h3>
          <p className="text-gray-600">Overview content placeholder</p>
        </div>
      )}

      {activeTab === "labels" && (
        <div className="flex gap-6">
          {/* Left Column - 70% */}
          <div className="flex-1">
            {/* Filters */}
            <div className="flex gap-4 mb-4 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={modifiedOnly}
                  onChange={(e) => {
                    setModifiedOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-gray-600">Modified only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regulatory}
                  onChange={(e) => {
                    setRegulatory(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-gray-600">Regulatory</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paramCust}
                  onChange={(e) => {
                    setParamCust(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-gray-600">Param. Cust.</span>
              </label>
            </div>

            {/* Search */}
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search label..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
            </div>

            {/* Table */}
            <div className="card overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead className="table-header">
                  <tr>
                    <th className="w-12 py-3 px-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLabels(new Set(paginatedLabels.map((l) => l.id)));
                          } else {
                            setSelectedLabels(new Set());
                          }
                        }}
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-950">Label</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-950">Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-950">Unit</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-950">Level</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-950">Confidence</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-950">Reg</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-950">Param</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLabels.length === 0 ? (
                    <tr className="table-row">
                      <td colSpan="8" className="py-8 px-4 text-center text-gray-600">
                        No labels found
                      </td>
                    </tr>
                  ) : (
                    paginatedLabels.map((label) => (
                      <tr
                        key={label.id}
                        onClick={() => handleLabelClick(label)}
                        className={`table-row cursor-pointer ${
                          selectedLabel?.id === label.id ? "bg-green-50" : ""
                        }`}
                      >
                        <td
                          className="w-12 py-3 px-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowSelect(label.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedLabels.has(label.id)}
                            onChange={() => {}}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-950">{label.label}</td>
                        <td className="py-3 px-4 text-gray-600">{label.value}</td>
                        <td className="py-3 px-4 text-gray-600 text-xs">{label.unit}</td>
                        <td className="py-3 px-4 text-gray-600 text-xs">{label.level}</td>
                        <td className="py-3 px-4 text-gray-600 text-xs">{label.confidence}</td>
                        <td className="py-3 px-4 text-center text-sm">{label.regulatory ? "✓" : "-"}</td>
                        <td className="py-3 px-4 text-center text-sm">{label.paramCust ? "✓" : "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Stats */}
            <div className="text-xs text-gray-600 mb-4 flex gap-4">
              <span>Regulatory: {regulatoryCount > 0 ? "Yes" : "No"}</span>
              <span>Param.Cust.: {paramCustCount > 0 ? "Yes" : "No"}</span>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>
                Showing {startIdx + 1}-{Math.min(startIdx + rowsPerPage, filteredLabels.length)} of{" "}
                {filteredLabels.length}
              </span>
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select className="px-2 py-1 border border-gray-light rounded text-xs bg-white text-gray-950 cursor-pointer">
                  <option>10</option>
                  <option>20</option>
                </select>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2 text-gray-400 disabled:opacity-50"
                >
                  &lt;
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 text-gray-400 disabled:opacity-50"
                >
                  &gt;
                </button>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6">
              <button className="btn-primary w-full">
                Run Technical Validation
              </button>
            </div>
          </div>

          {/* Right Panel - 30% */}
          {selectedLabel && (
            <div className="w-96 card sticky top-20 h-fit">
              <h3 className="text-lg font-semibold text-gray-950 mb-6 border-b border-gray-light pb-4">
                {selectedLabel.label}
              </h3>

              <div className="space-y-4">
                {/* Label */}
                <div>
                  <label className="block text-sm font-medium text-gray-950 mb-2">Label</label>
                  <input
                    type="text"
                    value={selectedLabel.label}
                    className="w-full px-3 py-2 border border-gray-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-950 mb-2">Unit</label>
                  <input
                    type="text"
                    value={selectedLabel.unit}
                    className="w-full px-3 py-2 border border-gray-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950"
                  />
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-950 mb-2">Level</label>
                  <select className="w-full px-3 py-2 border border-gray-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950 cursor-pointer">
                    <option>Variant-specific</option>
                    <option>Production</option>
                    <option>Post-sales</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1 italic">Configuration level for this parameter</p>
                </div>

                {/* Confidence */}
                <div>
                  <label className="block text-sm font-medium text-gray-950 mb-2">Confidence</label>
                  <select className="w-full px-3 py-2 border border-gray-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950 cursor-pointer">
                    <option>Estimated</option>
                    <option>Validated</option>
                  </select>
                </div>

                {/* Regulatory */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    defaultChecked={selectedLabel.regulatory}
                    id="regulatory-checkbox"
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="regulatory-checkbox" className="text-sm font-medium text-gray-950 cursor-pointer">
                    Regulatory
                  </label>
                </div>

                {/* Min/Max */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-950 mb-2">Min</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-950 mb-2">Max</label>
                    <input
                      type="number"
                      placeholder="100"
                      className="w-full px-3 py-2 border border-gray-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950"
                    />
                  </div>
                </div>

                {/* Data Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-950 mb-2">Data type</label>
                  <select className="w-full px-3 py-2 border border-gray-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 bg-white text-gray-950 cursor-pointer">
                    <option>Float</option>
                    <option>Integer</option>
                    <option>Boolean</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-6 border-t border-gray-light">
                  <button className="btn-primary w-full text-sm">Save</button>
                  <button className="btn-primary w-full text-sm">Submit for Approval →</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "artefacts" && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-950 mb-4">Artefacts</h3>
          <p className="text-gray-600">Artefacts content placeholder</p>
        </div>
      )}

      {activeTab === "change log" && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-950 mb-4">Change Log</h3>
          <p className="text-gray-600">Change Log content placeholder</p>
        </div>
      )}
    </div>
  );
}
