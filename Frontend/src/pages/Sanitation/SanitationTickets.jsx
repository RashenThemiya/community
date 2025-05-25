import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/axiosInstance";
import { FaTrash } from "react-icons/fa";
import ConfirmWrapper from "../../components/ConfirmWrapper";

// Export to Excel function
const exportSanitationTicketsExcel = async (tickets) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sanitation Tickets");

  worksheet.columns = [
    { header: "Ticket ID", key: "id", width: 15 },
    { header: "Price (Rs.)", key: "price", width: 15 },
    { header: "Date", key: "date", width: 20 },
    { header: "Issued By", key: "byWhom", width: 30 },
  ];

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4CAF50" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  tickets.forEach((ticket) => {
    worksheet.addRow({
      id: ticket.id,
      price: ticket.price,
      date: ticket.date,
      byWhom: ticket.byWhom,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `SanitationTickets_${new Date().toISOString()}.xlsx`);
};

const SanitationTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [ticketPrice, setTicketPrice] = useState("");
  const [searchByWhom, setSearchByWhom] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pendingFrom, setPendingFrom] = useState("");
  const [pendingTo, setPendingTo] = useState("");
  const [dailyIncome, setDailyIncome] = useState({ totalIncome: 0, ticketCount: 0 });
  const [monthlyIncome, setMonthlyIncome] = useState({ totalIncome: 0, ticketCount: 0 });
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch tickets and incomes when searchByWhom changes (date range is client-side)
  useEffect(() => {
    fetchTickets();
    fetchDailyIncome();
    fetchMonthlyIncome();
    // eslint-disable-next-line
  }, [searchByWhom]);

  // Filter tickets by date range on the frontend
  useEffect(() => {
    let filtered = tickets;
    if (fromDate) {
      filtered = filtered.filter(ticket => ticket.date >= fromDate);
    }
    if (toDate) {
      filtered = filtered.filter(ticket => ticket.date <= toDate);
    }
    setFilteredTickets(filtered);
  }, [fromDate, toDate, tickets]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const queryParams = [];
      if (searchByWhom) queryParams.push(`byWhom=${searchByWhom}`);
      const query = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

      const res = await api.get(`/api/sanitation/by-date${query}`);
      const allTickets = res.data.tickets || [];
      setTickets(allTickets);
      setFilteredTickets(allTickets); // Initial, before range filter
    } catch (err) {
      setError("Failed to fetch sanitation tickets.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyIncome = async () => {
    try {
      const queryParams = [];
      if (searchByWhom) queryParams.push(`byWhom=${searchByWhom}`);
      const query = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

      const res = await api.get(`/api/sanitation/daily-income${query}`);
      const data = res.data[0];
      setDailyIncome(data || { totalIncome: 0, ticketCount: 0 });
    } catch (err) {
      console.error("Failed to fetch daily income:", err);
    }
  };

  const fetchMonthlyIncome = async () => {
    try {
      const queryParams = [];
      if (searchByWhom) queryParams.push(`byWhom=${searchByWhom}`);
      const query = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

      const res = await api.get(`/api/sanitation/monthly-income${query}`);
      const now = new Date();
      const monthData = res.data.find(entry =>
        parseInt(entry.month) === now.getMonth() + 1 &&
        parseInt(entry.year) === now.getFullYear()
      );
      setMonthlyIncome(monthData || { totalIncome: 0, ticketCount: 0 });
    } catch (err) {
      console.error("Failed to fetch monthly income:", err);
    }
  };

  const handleIssueTicket = async () => {
    setError(null);
    setSuccessMsg("");

    if (!ticketPrice) {
      setError("Please enter the ticket price.");
      return;
    }

    try {
      const response = await api.post("/api/sanitation", {
        price: ticketPrice,
      });

      setSuccessMsg(`Ticket issued with ID: ${response.data.ticketId}`);
      setTicketPrice("");
      fetchTickets();
      fetchDailyIncome();
      fetchMonthlyIncome();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to issue ticket.");
    }
  };

  const handleDeleteTicket = async (id) => {
    setError(null);
    setSuccessMsg("");

    try {
      await api.delete(`/api/sanitation/${id}`);
      setSuccessMsg("Ticket deleted successfully.");
      fetchTickets();
      fetchDailyIncome();
      fetchMonthlyIncome();
    } catch (err) {
      setError("Failed to delete the ticket.");
      console.error("Failed to delete ticket:", err);
    }
  };

  // Date range filter handlers
  const handleDateRangeSubmit = (e) => {
    e.preventDefault();
    setFromDate(pendingFrom);
    setToDate(pendingTo);
  };

  const handleDateRangeReset = () => {
    setFromDate("");
    setToDate("");
    setPendingFrom("");
    setPendingTo("");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Sanitation Ticket Management
          </h2>

          {/* Issue Ticket Form */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Ticket Price"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg"
            />
            <button
              onClick={handleIssueTicket}
              className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg transition"
            >
              Issue Ticket
            </button>
          </div>

          {error && <div className="mb-4 text-red-600">{error}</div>}
          {successMsg && <div className="mb-4 text-green-600">{successMsg}</div>}

          {/* Filters */}
         {/* Filters */}
<div className="mb-6 flex flex-col gap-4">
  <div className="flex flex-col sm:flex-row gap-4 items-center">
    {/* Search by Email */}
    <label className="flex flex-col items-start w-full sm:w-auto">
      <span className="text-sm font-medium text-gray-700 mb-1">Search By Email (byWhom)</span>
      <input
        type="text"
        placeholder="Search"
        value={searchByWhom}
        onChange={(e) => setSearchByWhom(e.target.value)}
        className="border border-gray-300 p-3 rounded-lg w-64"
      />
    </label>
    {/* Date Range */}
    <form
      className="flex flex-col sm:flex-row items-center gap-2"
      onSubmit={handleDateRangeSubmit}
    >
      <label className="flex flex-col items-start">
        <span className="text-sm font-medium text-gray-700 mb-1">Select Range of Dates</span>
        <div className="flex flex-row gap-2">
          <input
            type="date"
            value={pendingFrom}
            onChange={e => setPendingFrom(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg"
            placeholder="From"
            required
          />
          <input
            type="date"
            value={pendingTo}
            onChange={e => setPendingTo(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg"
            placeholder="To"
            required
          />
        </div>
      </label>
      <button
        type="submit"
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition mt-4 sm:mt-6"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={handleDateRangeReset}
        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition mt-4 sm:mt-6"
      >
        Reset
      </button>
    </form>
  </div>
</div>

          {/* Income Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border border-teal-100">
              <h4 className="text-lg font-semibold text-gray-700">
                {(fromDate || toDate || searchByWhom) ? "Filtered Income" : "Today's Income"}
              </h4>
              {(fromDate || toDate || searchByWhom) ? (
                <>
                  <p className="text-teal-700 font-bold text-2xl">
                    Rs. {filteredTickets.reduce((sum, t) => sum + parseFloat(t.price), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tickets issued: {filteredTickets.length}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-teal-700 font-bold text-2xl">
                    Rs. {parseFloat(dailyIncome?.totalIncome).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tickets issued: {dailyIncome?.ticketCount}
                  </p>
                </>
              )}
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-teal-100">
              <h4 className="text-lg font-semibold text-gray-700">
                {(searchByWhom ? "Filtered Monthly Income" : "This Month's Income")}
              </h4>
              <p className="text-teal-700 font-bold text-2xl">
                Rs. {parseFloat(monthlyIncome?.totalIncome).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Tickets issued: {monthlyIncome?.ticketCount}
              </p>
            </div>
          </div>

          {/* Ticket Table */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Tickets</h3>
              <button
                onClick={() => exportSanitationTicketsExcel(filteredTickets)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
                disabled={filteredTickets.length === 0}
                title={filteredTickets.length === 0 ? "No tickets to export" : "Export tickets to Excel"}
              >
                Export to Excel
              </button>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="w-full table-auto border-collapse">
                <thead className="bg-teal-600 text-white">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">By Whom</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{ticket.id}</td>
                        <td className="p-3">Rs. {ticket.price}</td>
                        <td className="p-3">{ticket.date}</td>
                        <td className="p-3">{ticket.byWhom}</td>
                        <td className="p-3">
                          <ConfirmWrapper
                            message="Are you sure you want to delete this ticket?"
                            onConfirm={() => handleDeleteTicket(ticket.id)}
                          >
                            <button
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto justify-center"
                            >
                              <span>Delete</span>
                              <FaTrash className="text-base" />
                            </button>
                          </ConfirmWrapper>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-3 text-center text-gray-500" colSpan="5">
                        No tickets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanitationTickets;
