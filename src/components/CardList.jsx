import React, { useEffect, useState } from "react";
import Button from "./Button";
import Navbar from "./Navbar";
import Filter from "./Filter";

export default function CardList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ origin_code: [], destination_code: [] });
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const itemsPerPage = 6;

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchOrders = async (customFilters = filters, customKeyword = keyword, page = currentPage) => {
    try {
      setLoading(true);
      console.log('Fetching orders with:', { customFilters, customKeyword, page, itemsPerPage });
      
      const res = await fetch(
        "https://frontend-api-mocking-production-2cb1.up.railway.app/api/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keyword: customKeyword,
            filter: {
              order_status: [0],
              origin_code: customFilters.origin_code,
              destination_code: customFilters.destination_code,
            },
            page: page,
            limit: itemsPerPage,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('API Response:', data);
      
      // Pastikan data yang diterima sesuai format
      const orderList = data.order_list || data.orders || data.data || [];
      const totalPagesFromAPI = data.total_pages || Math.ceil((data.total || data.total_items || orderList.length) / itemsPerPage);
      const totalItemsFromAPI = data.total || data.total_items || orderList.length;
      
      setOrders(orderList);
      setTotalPages(totalPagesFromAPI);
      setTotalItems(totalItemsFromAPI);
      
      console.log(`Showing ${orderList.length} items on page ${page} of ${totalPagesFromAPI}`);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(filters, keyword, currentPage);
  }, [currentPage]);

  const handleSearch = (kw) => {
    setKeyword(kw);
    setCurrentPage(1);
    fetchOrders(filters, kw, 1);
  };

  const handleFilterApply = (f) => {
    setFilters(f);
    setCurrentPage(1);
    fetchOrders(f, keyword, 1);
    setIsFilterOpen(false);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate pagination numbers with ellipsis for better UX
  const generatePaginationNumbers = () => {
    const delta = 2; // Show 2 pages before and after current page
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    range.push(1);

    // Add pages around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Always include last page if there's more than 1 page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Add dots where needed
    let prev = 0;
    for (const page of range) {
      if (page - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if (page - prev !== 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(page);
      prev = page;
    }

    return rangeWithDots;
  };

  return (
    <div>
      <Navbar
        onSearch={handleSearch}
        onOpenFilter={() => setIsFilterOpen(true)}
      />

      {/* Filter */}
      {isDesktop ? (
        isFilterOpen && (
          <div className="absolute right-5 mt-2 z-50">
            <Filter
              isOpen={true}
              mode="popover"
              initialFilter={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={handleFilterApply}
            />
          </div>
        )
      ) : (
        <Filter
          isOpen={isFilterOpen}
          mode="sidebar"
          initialFilter={filters}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleFilterApply}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Results info */}
          {orders.length > 0 && (
            <div className="px-4 py-2 text-sm text-gray-600">
              Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} hasil
            </div>
          )}

          <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-3 p-4">
            {orders.length > 0 ? (
              orders.slice(0, itemsPerPage).map((order) => (
                <div key={order.do_id} className="bg-white rounded-lg p-2 lg:p-5 w-full shadow-sm border">
                  <span className="flex flex-col border border-black p-2 lg:p-3 rounded-xl">
                    <p className="text-xs md:text-base text-gray-600">Order ID</p>
                    <h3 className="text-sm md:text-xl font-bold">{order.do_id}</h3>
                  </span>
                  <div className="flex flex-col justify-center items-center mt-2 lg:mt-5 gap-2 lg:gap-5">
                    <h3 className="bg-green-100 w-full text-center p-2 rounded-lg text-sm md:text-base">
                      {order.goods_name}
                    </h3>
                    <span className="flex flex-col md:flex-row items-center gap-1 lg:gap-5 text-sm lg:text-lg font-semibold lg:font-bold">
                      <h2>{order.origin_name}</h2>
                      <i className="fa-solid fa-arrow-down block md:hidden text-blue-500"></i>
                      <i className="fa-solid fa-arrow-right hidden md:block text-blue-500"></i>
                      <h2>{order.destination_name}</h2>
                    </span>
                    <Button text={"Lihat Detail"} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center col-span-full py-10">
                <i className="fa-solid fa-box-open text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">Tidak ada data ditemukan.</p>
                {(keyword || filters.origin_code.length > 0 || filters.destination_code.length > 0) && (
                  <p className="text-sm text-gray-500 mt-2">Coba ubah kata kunci pencarian atau filter Anda.</p>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-5 mb-10">
              {/* Page info */}
              <div className="text-sm text-gray-600">
                Halaman {currentPage} dari {totalPages}
              </div>
              
              {/* Pagination controls */}
              <div className="flex justify-center items-center gap-2">
                {/* Previous button */}
                <button
                  className={`px-3 py-1 border rounded transition-colors ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fa-solid fa-caret-left"></i>
                </button>

                {/* Page numbers */}
                {generatePaginationNumbers().map((page, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 border rounded transition-colors ${
                      page === currentPage
                        ? "bg-btn-blue text-white border-btn-blue"
                        : page === '...'
                        ? "bg-transparent border-transparent cursor-default"
                        : "bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => typeof page === 'number' ? goToPage(page) : null}
                    disabled={page === '...'}
                  >
                    {page}
                  </button>
                ))}

                {/* Next button */}
                <button
                  className={`px-3 py-1 border rounded transition-colors ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fa-solid fa-caret-right"></i>
                </button>
              </div>

              {/* Quick navigation for large pagination */}
              {totalPages > 10 && (
                <div className="flex items-center gap-2 text-sm">
                  <span>Ke halaman:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        goToPage(page);
                      }
                    }}
                    className="w-16 px-2 py-1 border rounded text-center"
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}