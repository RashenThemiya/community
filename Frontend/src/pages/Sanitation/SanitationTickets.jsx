import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/axiosInstance";

const SanitationTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [ticketPrice, setTicketPrice] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [dailyIncome, setDailyIncome] = useState({ totalIncome: 0, ticketCount: 0 });
  const [monthlyIncome, setMonthlyIncome] = useState({ totalIncome: 0, ticketCount: 0 });
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
    fetchDailyIncome();
  }, [searchDate]);

  useEffect(() => {
    fetchMonthlyIncome();
  }, []);

  const fetchTickets = async () => {
    try {
      const query = searchDate ? `?date=${searchDate}` : "";
      const res = await api.get(`/api/sanitation/by-date${query}`);
      setTickets(res.data.tickets || []);
    } catch (err) {
      setError("Failed to fetch sanitation tickets.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyIncome = async () => {
    try {
      const query = searchDate ? `?date=${searchDate}` : "";
      const res = await api.get(`/api/sanitation/daily-income${query}`);
      const data = res.data[0]; // Only one item expected
      setDailyIncome(data || { totalIncome: 0, ticketCount: 0 });
    } catch (err) {
      console.error("Failed to fetch daily income:", err);
    }
  };

  const fetchMonthlyIncome = async () => {
    try {
      const res = await api.get("/api/sanitation/monthly-income");
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
      const response = await api.post("/api/sanitation", { price: ticketPrice });

      setSuccessMsg(`Ticket issued with ID: ${response.data.ticketId}`);
      setTicketPrice("");
      fetchTickets();
      fetchDailyIncome();
      fetchMonthlyIncome();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to issue ticket.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Sanitation Ticket Management</h2>

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

          {/* Filter by Date */}
          <div className="mb-6">
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full sm:w-auto"
            />
          </div>

          {/* Income Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border border-teal-100">
              <h4 className="text-lg font-semibold text-gray-700">
                {searchDate ? `Income on ${searchDate}` : "Today's Income"}
              </h4>
              <p className="text-teal-700 font-bold text-2xl">
                Rs. {parseFloat(dailyIncome?.totalIncome).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Tickets issued: {dailyIncome?.ticketCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-teal-100">
              <h4 className="text-lg font-semibold text-gray-700">This Month's Income</h4>
              <p className="text-teal-700 font-bold text-2xl">
                Rs. {parseFloat(monthlyIncome?.totalIncome).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Tickets issued: {monthlyIncome?.ticketCount}</p>
            </div>
          </div>

          {/* Ticket Table */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Tickets</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="w-full table-auto border-collapse">
                <thead className="bg-teal-600 text-white">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{ticket.id}</td>
                        <td className="p-3">Rs. {ticket.price}</td>
                        <td className="p-3">{ticket.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-3 text-center text-gray-500" colSpan="3">
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
