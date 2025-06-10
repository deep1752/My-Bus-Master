"use client";
export const dynamic = "force-dynamic"; // ⛑️ This disables static export for this page

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "sonner";

export default function TravelsManager({ onEdit, onAdd }) {
  const router = useRouter();

  const [travels, setTravels] = useState([]);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchTravels = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/get`);
      const data = await response.json();

      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at);
        const dateB = new Date(b.updated_at || b.created_at);
        return dateB - dateA;
      });

      setTravels(sortedData);
    } catch (err) {
      console.error("Error fetching travels:", err);
      toast.error("❌ Failed to load travels.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravels();
  }, []);

  const handleDelete = async (idList) => {
    const confirmed = confirm(
      `Are you sure you want to delete ${idList.length > 1 ? "these travels" : "this travel"}?`
    );
    if (!confirmed) return;

    try {
      const deleteRequests = idList.map((id) =>
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/delete/${id}`, {
          method: "DELETE",
        })
      );
      const results = await Promise.all(deleteRequests);
      const allSuccessful = results.every((res) => res.ok);

      if (allSuccessful) {
        toast.success("Travel(s) deleted successfully!");
        await fetchTravels();
        setSelectedIds([]);
        setSelectAll(false);
      } else {
        toast.error("⚠️ Some deletions failed.");
      }
    } catch (err) {
      console.error("Error deleting travel(s):", err);
      toast.error("⚠️ Something went wrong.");
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTravels.map((t) => t.id));
    }
    setSelectAll(!selectAll);
  };

  const filteredTravels = travels.filter((t) =>
    t.from_location.toLowerCase().includes(searchFrom.toLowerCase()) &&
    t.to_location.toLowerCase().includes(searchTo.toLowerCase())
  );

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Travel List", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["From", "To", "Time", "Seats", "Price", "Last Updated"]],
      body: filteredTravels.map((t) => [
        t.from_location,
        t.to_location,
        t.time,
        t.seats,
        `₹${t.price}`,
        new Date(t.updated_at || t.created_at).toLocaleString(),
      ]),
    });
    doc.save("travels.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTravels.map((t) => ({
        From: t.from_location,
        To: t.to_location,
        Time: t.time,
        Seats: t.seats,
        Price: t.price,
        "Last Updated": new Date(t.updated_at || t.created_at).toLocaleString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Travels");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "travels.xlsx");
  };

  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading travels...</p>
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

        <h2 className="title">Travels Manager</h2>

        <div className="actions">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search From..."
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
              className="search-input"
            />
            <input
              type="text"
              placeholder="Search To..."
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
              className="search-input"
            />
            <button
              className="clear-search-button"
              onClick={() => {
                setSearchFrom("");
                setSearchTo("");
              }}
            >
              Clear
            </button>
          </div>

          <Link href="/admin/travels/add">
            <button className="add-button" onClick={onAdd}>
              ➕ Add
            </button>
          </Link>
          <button onClick={downloadPDF} className="download-button">
            📄 Download PDF
          </button>
          <button onClick={downloadExcel} className="download-button">
            📊 Download Excel
          </button>
          <button
            onClick={() => {
              if (selectedIds.length === 0) {
                toast.warning("⚠️ Please select at least one travel to delete.");
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
              <th>Image</th>
              <th>From</th>
              <th>To</th>
              <th>Time</th>
              <th>Seats</th>
              <th>Price</th>
              <th>Last Modified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTravels.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-users-found">
                  🔍 No travels found matching &quot;From: {searchFrom}, To: {searchTo}&quot;
                </td>
              </tr>
            ) : (
              filteredTravels.map((t) => (
                <tr key={t.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(t.id)}
                      onChange={() => toggleSelectOne(t.id)}
                    />
                  </td>
                  <td>
                    <Image
                      src={t.image}
                      alt="travel"
                      width={60}
                      height={40}
                      style={{ objectFit: "cover" }}
                      unoptimized={true}
                    />
                  </td>
                  <td>{t.from_location}</td>
                  <td>{t.to_location}</td>
                  <td>{t.time}</td>
                  <td>{t.seats}</td>
                  <td>₹{t.price}</td>
                  <td>{new Date(t.updated_at || t.created_at).toLocaleString()}</td>
                  <td className="action-buttons">
                    <Link href={`/admin/travels/edit/${t.id}`}>
                      <button className="edit-button" onClick={() => onEdit?.(t.id)}>
                        ✏️
                      </button>
                    </Link>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete([t.id])}
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
