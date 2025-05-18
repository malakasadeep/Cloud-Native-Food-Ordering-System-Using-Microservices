import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Info, Search } from "lucide-react";
import orderService from "../services/orderservice";
import deliverService from "../../partnersManagement/services/deliverServices";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await orderService.getAllOrders();
        if (response.success) {
          setOrders(response.data?.orders || []);
        } else {
          setError(response.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError("An error occurred while fetching orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filtered orders
  const filteredOrders = orders.filter(
    (order) =>
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-headingColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p className="flex items-center">
          <Info className="mr-2" size={20} /> {error}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by customer name or order ID..."
            className="w-full px-4 py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-headingColor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-headingColor uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-headingColor uppercase">
                Delivery Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-headingColor uppercase">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-headingColor uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-headingColor uppercase">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textColor">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-headingColor font-medium">
                    {order.deliveryAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textColor">
                    ${order.totalAmount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={order.orderStatus}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        const result = await orderService.updateOrderStatus(
                          order._id,
                          newStatus
                        );

                        if (result.success) {
                          setOrders((prev) =>
                            prev.map((o) =>
                              o._id === order._id
                                ? { ...o, orderStatus: newStatus }
                                : o
                            )
                          );

                          //if status set to compleated then call the deliver service
                          if (newStatus === "COMPLETED") {
                            try {
                              const requestBody = {
                                orderId: order._id,
                                customerId: "680f6bd0bdc07e87c9332fd6", //hard coded bcuse of no data found on db
                                resturentId: "6807f49eb6416f7a21985b9b", //hard coded bcuse of no data found on db
                              };
                              const deliveryResponse =
                                await deliverService.assignRiderToDelivery(
                                  requestBody
                                );
                              if (!deliveryResponse.success) {
                                alert(
                                  deliveryResponse.message ||
                                    "Failed to trigger delivery"
                                );
                              }
                            } catch (error) {
                              console.error("Delivery API error:", error);
                              alert(
                                "An error occurred while triggering delivery"
                              );
                            }
                          }
                        } else {
                          alert(
                            result.message || "Failed to update order status"
                          );
                        }
                      }}
                      className="border px-2 py-1 rounded-md text-sm text-gray-700"
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textColor">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-sm text-textColor"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-textColor">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredOrders.length)}
                </span>{" "}
                of <span className="font-medium">{filteredOrders.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${
                    currentPage === 1
                      ? "cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (number) =>
                      number === 1 ||
                      number === totalPages ||
                      (number >= currentPage - 1 && number <= currentPage + 1)
                  )
                  .map((number, index, array) => {
                    if (index > 0 && array[index - 1] !== number - 1) {
                      return (
                        <React.Fragment key={`ellipsis-${number}`}>
                          <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            ...
                          </span>
                          <button
                            onClick={() => paginate(number)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                              currentPage === number
                                ? "bg-headingColor text-white"
                                : "text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            {number}
                          </button>
                        </React.Fragment>
                      );
                    }
                    return (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                          currentPage === number
                            ? "bg-headingColor text-white"
                            : "text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {number}
                      </button>
                    );
                  })}

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
