import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import ExcelJS from "exceljs";

const ViewPayments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Calculate total amount for filtered payments
  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + parseFloat(payment.amount_paid),
    0
  );

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("api/payments/payments");
        setPayments(response.data.payments);
        setFilteredPayments(response.data.payments); // Initially show all payments
      } catch (err) {
        setError("Failed to fetch payments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Search filter function
  useEffect(() => {
    const filtered = payments.filter(
      (payment) =>
        payment.payment_id.toString().includes(searchQuery) ||
        (payment.shop_id &&
          payment.shop_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (payment.invoice_id &&
          payment.invoice_id
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (payment.payment_method &&
          payment.payment_method
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    );
    setFilteredPayments(filtered);
  }, [searchQuery, payments]);

  // Export to Excel function
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Payments");

    // Set headers
    worksheet.columns = [
      { header: "Payment ID", key: "payment_id", width: 15 },
      { header: "Shop ID", key: "shop_id", width: 15 },
      { header: "Invoice ID", key: "invoice_id", width: 20 },
      { header: "Amount Paid (LKR)", key: "amount_paid", width: 20 },
      { header: "Payment Method", key: "payment_method", width: 20 },
      { header: "Payment Date", key: "payment_date", width: 20 },
    ];

    // Highlight headers
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Bold + white text
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' }, // Light blue background
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Add payment rows
    filteredPayments.forEach((payment) => {
      worksheet.addRow({
        payment_id: payment.payment_id,
        shop_id: payment.shop_id,
        invoice_id: payment.invoice_id || "N/A",
        amount_paid: parseFloat(payment.amount_paid).toFixed(2),
        payment_method: payment.payment_method,
        payment_date: new Date(payment.payment_date).toLocaleDateString(),
      });
    });

    // Add Total row
    const totalAmount = filteredPayments.reduce((sum, payment) => {
      return sum + parseFloat(payment.amount_paid || 0);
    }, 0);

    const totalRow = worksheet.addRow({
      payment_id: '',
      shop_id: '',
      invoice_id: 'TOTAL',
      amount_paid: totalAmount.toFixed(2),
      payment_method: '',
      payment_date: '',
    });

    // Style Total row
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    // Download as Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Payments.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };


  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex items-center justify-start mb-4 relative">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Back
          </button>
          <h2 className="text-2xl font-bold text-center absolute left-1/2 transform -translate-x-1/2">
            All Payments
          </h2>
        </div>



        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Payment ID, Shop ID, Invoice ID, or Payment Method..."
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <p className="text-lg font-semibold mb-4 text-center">
          Total Amount Paid (LKR): {totalAmount.toFixed(2)}
        </p>

        {loading && (
          <p className="text-blue-500 text-center">Loading payments...</p>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && filteredPayments.length === 0 && (
          <p className="text-gray-600 text-center">
            No matching payments found.
          </p>
        )}

        {!loading && !error && filteredPayments.length > 0 && (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 sticky top-0">
                  <th className="border border-gray-300 px-4 py-2">
                    Payment ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Shop ID</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Invoice ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Amount Paid
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Payment Method
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Payment Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.payment_id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">
                      {payment.payment_id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {payment.shop_id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {payment.invoice_id || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      LKR {parseFloat(payment.amount_paid).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {payment.payment_method}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <ConfirmWrapper
            onConfirm={exportToExcel}
            message="Are you sure you want to download the payments?"
            additionalInfo="This will export all filtered records as an Excel file."
            confirmText="Download"
            cancelText="Cancel"
            buttonBackgroundColor="bg-green-500"
            icon={<span role="img" aria-label="download">📥</span>}
          >
            <button className="ml-auto block bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 mb-4">
              Download as Excel
            </button>
          </ConfirmWrapper>

        </div>


      </div>
    </div>
  );
};

export default ViewPayments;
