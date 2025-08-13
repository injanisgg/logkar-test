import React, { useState, useEffect } from "react";

const ORIGIN_OPTIONS = [
  { code: "BDG", name: "BANDUNG" },
  { code: "JKT", name: "JAKARTA" },
  { code: "SBY", name: "SURABAYA" },
  { code: "MLG", name: "MALANG" },
  { code: "DPS", name: "DENPASAR" },
];

const DESTINATION_OPTIONS = [
  { code: "MDN", name: "MEDAN" },
  { code: "PKU", name: "PEKANBARU" },
  { code: "BJM", name: "BANJARMASIN" },
  { code: "PLB", name: "PALEMBANG" },
  { code: "BJM2", name: "BANJARMASIN 2" },
];

export default function Filter({
  isOpen,
  onClose,
  onApply,
  initialFilter = { origin_code: [], destination_code: [] },
  mode = "sidebar",
}) {
  const [activeTab, setActiveTab] = useState("origin");
  const [searchTerm, setSearchTerm] = useState("");
  const [tempFilter, setTempFilter] = useState(initialFilter);
  const [appliedFilter, setAppliedFilter] = useState(initialFilter);

  // Sync filter ketika modal dibuka ulang
  useEffect(() => {
    if (isOpen) {
      setTempFilter(initialFilter);
      setAppliedFilter(initialFilter);
    }
  }, [isOpen, initialFilter]);

  const handleCheckboxChange = (type, code) => {
    setTempFilter((prev) => {
      const updated = prev[type].includes(code)
        ? prev[type].filter((c) => c !== code)
        : [...prev[type], code];
      return { ...prev, [type]: updated };
    });
  };

  const filteredOptions =
    activeTab === "origin"
      ? ORIGIN_OPTIONS.filter((o) =>
          o.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : DESTINATION_OPTIONS.filter((o) =>
          o.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const resetAll = () =>
    setTempFilter({ origin_code: [], destination_code: [] });

  const applyFilter = () => {
    setAppliedFilter(tempFilter);
    onApply(tempFilter);
    if (mode === "popover") {
      onClose(); // popover tutup otomatis
    }
  };

  const isFilterChanged =
    JSON.stringify(tempFilter) !== JSON.stringify(appliedFilter);

  // === POPUP STYLE ===
  const containerClasses =
    mode === "sidebar"
      ? `fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`
      : `w-80 bg-white shadow-lg rounded-lg border flex flex-col`;

  return (
    <>
      {/* Overlay untuk sidebar */}
      {mode === "sidebar" && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {isOpen && (
        <div className={containerClasses}>
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Filter</h2>
            <button onClick={onClose}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 ${
                activeTab === "origin"
                  ? "bg-btn-blue text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => setActiveTab("origin")}
            >
              Origin ({tempFilter.origin_code.length})
            </button>
            <button
              className={`flex-1 py-2 ${
                activeTab === "destination"
                  ? "bg-btn-blue text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => setActiveTab("destination")}
            >
              Destination ({tempFilter.destination_code.length})
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 p-4">
            <i className="fa-solid fa-magnifying-glass text-gray-500"></i>
            <input
              type="text"
              className="flex-1 border-b outline-none"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-xs text-white bg-btn-blue p-1 rounded-lg"
              >
                Reset
              </button>
            )}
          </div>

          {/* Checklist */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredOptions.map((option) => {
              const isSelected =
                activeTab === "origin"
                  ? tempFilter.origin_code.includes(option.code)
                  : tempFilter.destination_code.includes(option.code);

              return (
                <label
                  key={option.code}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      handleCheckboxChange(
                        activeTab === "origin"
                          ? "origin_code"
                          : "destination_code",
                        option.code
                      )
                    }
                    className="w-4 h-4"
                  />
                  <span
                    className={`px-2 py-1 rounded ${
                      isSelected
                        ? "text-btn-blue font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {option.name} : {option.code}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex gap-2">
            <button
              onClick={resetAll}
              className="flex-1 border border-gray-300 rounded-lg py-2"
            >
              Reset Semua
            </button>
            <button
              onClick={applyFilter}
              disabled={!isFilterChanged}
              className={`flex-1 py-2 rounded-lg text-white ${
                isFilterChanged
                  ? "bg-btn-blue"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </>
  );
}
