import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import { format } from "date-fns";
import deliverService from "../../../features/partnersManagement/services/deliverServices";

const statusColors = {
  pending: "default",
  accepted: "primary",
  assigned: "info",
  delivered: "success",
  canceled: "error",
};

const AdminOrderPage = () => {
  const [deliveryOrders, setDeliveryOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchAllDeliveryOrders();
  }, []);

  const fetchAllDeliveryOrders = async () => {
    setLoading(true);
    try {
      const response = await deliverService.getAllDeliveryLogs();
      // Normalize response to ensure it's an array
      const orders = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      console.log("Fetched orders:", orders); // Debug
      setDeliveryOrders(orders);
      setError("");
    } catch (error) {
      console.error("Failed to fetch delivery logs:", error);
      setError("Unable to load delivery logs");
      setDeliveryOrders([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Sorting logic
  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(column);
  };

  // Filtering and sorting data
  const sortedAndFilteredOrders = useMemo(() => {
    // Ensure deliveryOrders is an array
    const orders = Array.isArray(deliveryOrders) ? [...deliveryOrders] : [];

    // Apply status filter
    let filteredOrders = orders;
    if (filterStatus !== "all") {
      filteredOrders = filteredOrders.filter(
        (order) => order.delivery_status === filterStatus
      );
    }

    // Sort orders
    filteredOrders.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        return sortOrder === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }
      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return filteredOrders;
  }, [deliveryOrders, sortBy, sortOrder, filterStatus]);

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format ID for display
  const formatId = (id) => {
    if (!id) return "N/A";
    return `${id.slice(0, 6)}...${id.slice(-4)}`;
  };

  // Format coordinates
  const formatLocation = (location) => {
    if (!location || !location.lat || !location.lng) return "N/A";
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Delivery Logs
        </Typography>
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            {/* Filter Controls */}
            <Box display="flex" justifyContent="space-between" mb={2}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Filter by Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="canceled">Canceled</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {[
                      { id: "orderId", label: "Order ID" },
                      { id: "customerId", label: "Customer ID" },
                      { id: "resturentId", label: "Restaurant ID" },
                      { id: "driverId", label: "Driver ID" },
                      { id: "delivery_status", label: "Status" },
                      { id: "pickup_location", label: "Pickup Location" },
                      { id: "dropoff_location", label: "Dropoff Location" },
                      { id: "createdAt", label: "Created At" },
                      { id: "updatedAt", label: "Updated At" },
                    ].map((column) => (
                      <TableCell key={column.id}>
                        <TableSortLabel
                          active={sortBy === column.id}
                          direction={sortBy === column.id ? sortOrder : "asc"}
                          onClick={() => handleSort(column.id)}
                        >
                          {column.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedAndFilteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>
                          <Tooltip title={order.orderId}>
                            <span>{formatId(order.orderId)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={order.customerId}>
                            <span>{formatId(order.customerId)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={order.resturentId}>
                            <span>{formatId(order.resturentId)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={order.driverId || "N/A"}>
                            <span>{formatId(order.driverId)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.delivery_status.toUpperCase()}
                            color={
                              statusColors[order.delivery_status] || "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {formatLocation(order.pickup_location)}
                        </TableCell>
                        <TableCell>
                          {formatLocation(order.dropoff_location)}
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.createdAt), "PPp")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.updatedAt), "PPp")}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={sortedAndFilteredOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminOrderPage;
