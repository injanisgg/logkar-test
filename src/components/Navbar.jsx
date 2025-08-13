import React, { useState, useEffect } from "react";
import Filter from "./Filter";
import logo from "../images/logkar.ico";

export default function Navbar({ onApplyFilter, onSearch }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Update mode (desktop/mobile) saat window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsFilterOpen(false); // Tutup filter saat berubah mode
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClear = () => {
    setKeyword("");
    onSearch("");
  };

  return (
    <div className="pt-2 pb-5 bg-white relative">
      <div className="flex flex-col lg:flex-row xl:gap-5 lg:px-5 xl:px-10">
        {/* Logo */}
        <div className="flex justify-center gap-3 items-center my-3">
          <img src={logo} alt="logo logkar" className="w-10" />
          <span className="text-2xl font-bold text-green-700">LOG KAR</span>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 mx-3 lg:flex-1 xl:gap-20 relative">
          {/* Search input */}
          <div className="flex items-center flex-1 border border-gray-300 rounded-lg px-3 py-2">
            <i className="fa-solid fa-magnifying-glass text-gray-500"></i>
            <input
              type="text"
              placeholder="Cari nama barang..."
              className="flex-1 border-none outline-none px-2"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                onSearch(e.target.value);
              }}
            />
            {keyword && (
              <button onClick={handleClear}>
                <i className="fa-solid fa-xmark text-gray-500"></i>
              </button>
            )}
          </div>

          {/* Filter icon */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="flex-none lg:flex lg:items-center lg:gap-2 lg:border lg:border-gray-300 lg:rounded-lg lg:hover:bg-blue-200 lg:hover:rounded-xl p-2"
            >
              <span className="hidden lg:block">Filter</span>
              <i className="fa-solid fa-filter fa-xl"></i>
            </button>

            {/* Popover filter untuk desktop */}
            {isDesktop && isFilterOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border z-50">
                <Filter
                  isOpen={true}
                  mode="popover"
                  onClose={() => setIsFilterOpen(false)}
                  onApply={(filters) => {
                    onApplyFilter(filters);
                    setIsFilterOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar filter untuk mobile */}
      {!isDesktop && (
        <Filter
          isOpen={isFilterOpen}
          mode="sidebar"
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => {
            onApplyFilter(filters);
            setIsFilterOpen(false);
          }}
        />
      )}
    </div>
  );
}