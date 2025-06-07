"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "sonner";

export default function BookingManager() {
  const router = useRouter();

  // States to manage bookings, search, selection, and loading
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("from_location");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch bookings on component mount
  useEffect(() => {
    fetch("http://127.0.0.1:8000/bookings/get")
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        toast.error("❌ Failed to load bookings.");
        setLoading(false);
      });
  }, []);

  // Function to delete one or more bookings
  const handleDelete = async (idList) => {
    const confirmed = confirm(
      `Are you sure you want to delete ${idList.length > 1 ? "these bookings" : "this booking"}?`
    );
    if (!confirmed) return;

    try {
      const deleteRequests = idList.map((id) =>
        fetch(`http://127.0.0.1:8000/bookings/delete/${id}`, {
          method: "DELETE",
        })
      );

      const results = await Promise.all(deleteRequests);
      const allSuccessful = results.every((res) => res.ok);

      if (allSuccessful) {
        toast.success("Booking(s) deleted successfully!");
        setBookings(bookings.filter((booking) => !idList.includes(booking.id)));
        setSelectedIds([]);
        setSelectAll(false);
      } else {
        toast.error("⚠️ Some deletions failed.");
      }
    } catch (err) {
      console.error("Error deleting bookings:", err);
      toast.error("⚠️ Something went wrong.");
    }
  };

  // Toggle individual booking selection
  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Toggle select all bookings
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBookings.map((booking) => booking.id));
    }
    setSelectAll(!selectAll);
  };

  // Sort bookings by most recent
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // Filter bookings based on search
  const filteredBookings = sortedBookings.filter((booking) => {
    const term = searchTerm.toLowerCase();
    switch (searchField) {
      case "id":
        return String(booking.id).includes(term);
      case "from_location":
        return booking.from_location.toLowerCase().includes(term);
      case "to_location":
        return booking.to_location.toLowerCase().includes(term);
      case "created_at":
        return new Date(booking.created_at).toLocaleString().toLowerCase().includes(term);
      case "user_id":
        return String(booking.user_id).toLowerCase().includes(term);
      default:
        return true;
    }
  });

  // Export to PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Booking List", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["Booking ID", "From", "To", "Seats", "Price/Seat", "Total", "User ID"]],
      body: filteredBookings.map((b) => [
        b.id,
        b.from_location,
        b.to_location,
        b.seats,
        b.price_per_seat,
        b.total_price,
        b.user_id,
      ]),
    });
    doc.save("bookings.pdf");
  };

  // Export to Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredBookings.map((b) => ({
        "Booking ID": b.id,
        From: b.from_location,
        To: b.to_location,
        Seats: b.seats,
        "Price/Seat": b.price_per_seat,
        Total: b.total_price,
        "User ID": b.user_id,
        "Created At": new Date(b.created_at).toLocaleString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "bookings.xlsx");
  };

  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="product-manager-wrapper">
      <div className="header-bar">
        <div className="product-header">
          <button onClick={() => router.push("/admin")} className="back-btn">
            ◀ Back
          </button>
        </div>
        <h2 className="title">Booking Manager</h2>

        <div className="actions">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="dropdown-select"
          >
            <option value="id">Booking ID</option>
            <option value="from_location">From</option>
            <option value="to_location">To</option>
            <option value="created_at">Created At</option>
            <option value="user_id">User ID</option>
          </select>

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <button
            onClick={() => router.push("/admin/booking/add")}
            className="add-button"
          >
            ➕ Add 
          </button>

          <button onClick={downloadPDF} className="download-button">
            📄 Download PDF
          </button>
          <button onClick={downloadExcel} className="download-button">
            📊 Download Excel
          </button>

          <button
            onClick={() => {
              if (selectedIds.length === 0) {
                toast.warning("⚠️ Please select at least one booking to delete.");
              } else {
                handleDelete(selectedIds);
              }
            }}
            className="delete-button"
          >
            🗑️ Delete Selected ({selectedIds.length})
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Booking ID</th>
              <th>From</th>
              <th>To</th>
              <th>Seats</th>
              <th>Price/Seat</th>
              <th>Total Price</th>
              <th>User Details</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-users-found">
                  🔍 No bookings found matching &quot;{searchTerm}&quot;
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(booking.id)}
                      onChange={() => toggleSelectOne(booking.id)}
                    />
                  </td>
                  <td>{booking.id}</td>
                  <td>{booking.from_location}</td>
                  <td>{booking.to_location}</td>
                  <td>{booking.seats}</td>
                  <td>{booking.price_per_seat}</td>
                  <td>{booking.total_price}</td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => router.push(`/admin/booking/viewuser/${booking.user_id}`)}
                    >
                      View
                    </button>
                  </td>
                  <td>{new Date(booking.created_at).toLocaleString()}</td>
                  <td className="action-buttons">
                    <Link href={`/admin/booking/edit/${booking.id}`}>
                      <button className="edit-button">✏️</button>
                    </Link>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete([booking.id])}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}