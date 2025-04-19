import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/axiosInstance";

const VehicleTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("Lorry");
  const [ticketPrice, setTicketPrice] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");
  const [searchVehicleNumber, setSearchVehicleNumber] = useState("");
  const [dailyIncome, setDailyIncome] = useState({ totalIncome: 0, ticketCount: 0 });
  const [monthlyIncome, setMonthlyIncome] = useState({ totalIncome: 0, ticketCount: 0 });

  const vehicleTypes = ["Lorry", "Van", "Three-Wheeler", "Motorbike", "Car"];

  useEffect(() => {
    fetchTickets();
    fetchDailyIncome(); // <- updated to depend on searchDate
  }, [searchDate]);

  useEffect(() => {
    filterTickets();
  }, [searchVehicleNumber, tickets]);

  useEffect(() => {
    fetchMonthlyIncome();
  }, []);

  const fetchTickets = async () => {
    try {
      const query = searchDate ? `?date=${searchDate}` : "";
      const res = await api.get(`/api/vehicle-tickets/by-date${query}`);
      setTickets(res.data.tickets || []);
      setFilteredTickets(res.data.tickets || []);
    } catch (err) {
      setError("Failed to fetch tickets.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyIncome = async () => {
    try {
      const res = await api.get("/api/vehicle-tickets/daily-income");
      const targetDate = searchDate || new Date().toISOString().split("T")[0];
      const dateData = res.data.find(entry => entry.date === targetDate);
      setDailyIncome(dateData || { totalIncome: 0, ticketCount: 0 });
    } catch (err) {
      console.error("Failed to fetch daily income:", err);
    }
  };

  const fetchMonthlyIncome = async () => {
    try {
      const res = await api.get("/api/vehicle-tickets/monthly-income");
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

  const filterTickets = () => {
    const filtered = tickets.filter(ticket =>
      ticket.vehicleNumber.toLowerCase().includes(searchVehicleNumber.toLowerCase())
    );
    setFilteredTickets(filtered);
  };

  const handleIssueTicket = async () => {
    setError(null);
    setSuccessMsg("");
    if (!vehicleNumber || !vehicleType || !ticketPrice) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await api.post("/api/vehicle-tickets", {
        vehicleNumber,
        vehicleType,
        ticketPrice,
      });

      setSuccessMsg(`Ticket issued with ID: ${response.data.ticket.id}`);
      setVehicleNumber("");
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
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Vehicle Ticket Management
          </h2>

          {/* Issue Ticket Form */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg"
            />
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg"
            >
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Ticket Price"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg"
            />
          </div>

          <button
            onClick={handleIssueTicket}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg transition"
          >
            Issue Ticket
          </button>

          {error && <div className="mt-4 text-red-600">{error}</div>}
          {successMsg && <div className="mt-4 text-green-600">{successMsg}</div>}

          {/* Daily and Monthly Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 mb-8">
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

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg"
            />
            <input
              type="text"
              placeholder="Search by Vehicle Number"
              value={searchVehicleNumber}
              onChange={(e) => setSearchVehicleNumber(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg"
            />
          </div>

          {/* Ticket Table */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Filtered Tickets</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="w-full table-auto border-collapse">
                <thead className="bg-teal-600 text-white">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Vehicle Number</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{ticket.id}</td>
                        <td className="p-3">{ticket.vehicleNumber}</td>
                        <td className="p-3">{ticket.vehicleType}</td>
                        <td className="p-3">Rs. {ticket.ticketPrice}</td>
                        <td className="p-3">{ticket.time}</td>
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

export default VehicleTickets;
