import React, { useEffect, useState } from "react";
import Button from "./Button";
import Navbar from "./Navbar";

export default function CardList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ origin_code: [], destination_code: [] });
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchOrders = async (
    customFilters = filters,
    customKeyword = keyword
  ) => {
    try {
      setLoading(true);
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
            page: 1, // ambil semua dulu, pagination di client
          }),
        }
      );

      const data = await res.json();
      setOrders(data.order_list || []);
      setCurrentPage(1); // reset ke halaman pertama setiap ada pencarian/filter
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Data yang akan ditampilkan sesuai pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <Navbar
        onApplyFilter={(f) => {
          setFilters(f);
          fetchOrders(f, keyword);
        }}
        onSearch={(kw) => {
          setKeyword(kw);
          fetchOrders(filters, kw);
        }}
      />

      {loading ? (
        <p className="text-center mt-5">Loading...</p>
      ) : (
        <>
          <div className="grid gap-4 xl:gap-10 xs:grid-cols-2 lg:grid-cols-3 p-4 xl:p-10">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <div key={order.do_id} className="bg-white rounded-lg p-2 lg:p-5 w-full">
                  <span className="flex flex-col border border-black p-2 lg:p-3 rounded-xl">
                    <p className="text-xs md:text-base">Order ID</p>
                    <h3 className="text-sm md:text-xl font-bold">{order.do_id}</h3>
                  </span>
                  <div className="flex flex-col justify-center items-center mt-2 lg:mt-5 gap-2 lg:gap-5">
                    <h3 className="bg-green-100 w-full text-center p-2 rounded-lg lg:text-lg">
                      {order.goods_name}
                    </h3>
                    <span className="flex flex-col md:flex-row items-center gap-1 lg:gap-5 text-sm lg:text-lg font-semibold lg:font-bold">
                      <div className="flex-col text-center">
                        <p className="font-light text-xs">Origin</p>
                        <h2>{order.origin_name}</h2>
                      </div>
                      {/* Mobile */}
                      <i className="fa-solid fa-arrow-down block md:hidden"></i>
                      {/* Desktop */}
                      <i className="fa-solid fa-arrow-right hidden md:block"></i>
                      <div className="flex-col text-center">
                        <p className="font-light text-xs">Destination</p>
                        <h2>{order.destination_name}</h2>
                      </div>
                    </span>
                    <Button text={"Lihat Detail"} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full">Tidak ada data ditemukan.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-5 mb-10">
              <button
                className="fa-solid fa-caret-left fa-2xl px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 border rounded ${
                    currentPage === index + 1 ? "bg-btn-blue text-white" : ""
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="fa-solid fa-caret-right fa-2xl px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}