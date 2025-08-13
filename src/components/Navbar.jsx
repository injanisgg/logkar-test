import React, { useState } from "react";
import logo from "../images/logkar.ico";

export default function Navbar({ onSearch, onOpenFilter }) {
  const [keyword, setKeyword] = useState("");

  const handleClear = () => {
    setKeyword("");
    onSearch("");
  };

  return (
    <div className="pt-2 pb-5 bg-white relative">
      <div className="flex flex-col lg:flex-row lg:px-5">
        {/* Logo */}
        <div className="flex justify-center gap-3 items-center my-3">
          <img src={logo} alt="logo logkar" className="w-10" />
          <span className="text-2xl font-bold text-green-700">LOG KAR</span>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 mx-3 lg:flex-1 relative">
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
              onClick={onOpenFilter}
              className="flex-none lg:flex lg:items-center lg:gap-2 lg:border lg:border-gray-300 lg:rounded-lg lg:hover:bg-blue-200 lg:hover:rounded-xl p-2"
            >
              <span className="hidden lg:block">Filter</span>
              <i className="fa-solid fa-filter fa-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
