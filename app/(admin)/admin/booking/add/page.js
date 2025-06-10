"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const defaultBooking = {
  user_id: "",
  from_location: "",
  to_location: "",
  seats: "1",
  price_per_seat: "",
  total_price: "",
};

export default function AddBooking() {
  const [bookings, setBookings] = useState([{ ...defaultBooking }]);
  const [errors, setErrors] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [travels, setTravels] = useState([]);

  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/get`)
      .then((res) => res.json())
      .then((data) => setTravels(data))
      .catch((err) => {
        console.error("Failed to fetch travels:", err);
        toast.error("❌ Failed to fetch travel routes.");
      });
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...bookings];
    updated[index][field] = value;

    // Numeric validation
    if ((["user_id", "seats", "price_per_seat", "total_price"].includes(field)) && !/^\d*$/.test(value)) return;

    // If from/to location changed, update price/seats
    if (field === "from_location" || field === "to_location") {
      const from = field === "from_location" ? value : updated[index].from_location;
      const to = field === "to_location" ? value : updated[index].to_location;
      const match = travels.find(t => t.from_location === from && t.to_location === to);

      if (match) {
        updated[index].price_per_seat = String(match.price);
        updated[index].seats = "1"; // Default to 1 seat initially
      } else {
        updated[index].price_per_seat = "";
        updated[index].seats = "1";
      }
    }

    // Auto calc total_price
    const seats = parseInt(updated[index].seats || "0", 10);
    const price = parseInt(updated[index].price_per_seat || "0", 10);
    updated[index].total_price = seats && price ? String(seats * price) : "";

    setBookings(updated);

    const updatedErrors = [...errors];
    if (updatedErrors[index]) {
      updatedErrors[index][field] = "";
      if (["seats", "price_per_seat"].includes(field)) {
        updatedErrors[index]["total_price"] = "";
      }
    }
    setErrors(updatedErrors);
  };

  const addRow = () => {
    setBookings([{ ...defaultBooking }, ...bookings]);
    setErrors([{}, ...errors]);
  };

  const removeRow = (index) => {
    if (bookings.length === 1) {
      toast.warning("⚠️ You cannot remove the last row.");
      return;
    }
    setBookings(bookings.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };

  const validate = () => {
    let hasError = false;
    const newErrors = bookings.map((booking) => {
      const fieldErrors = {};
      if (!booking.user_id.trim()) fieldErrors.user_id = "User ID is required";
      if (!booking.from_location.trim()) fieldErrors.from_location = "From location is required";
      if (!booking.to_location.trim()) fieldErrors.to_location = "To location is required";
      if (!booking.seats.trim()) fieldErrors.seats = "Seats are required";
      if (!booking.price_per_seat.trim()) fieldErrors.price_per_seat = "Price per seat is required";
      if (!booking.total_price.trim()) fieldErrors.total_price = "Total price is required";

      if (Object.keys(fieldErrors).length > 0) hasError = true;
      return fieldErrors;
    });

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("❗ Please correct the highlighted errors before submitting.");
      return;
    }

    setLoading(true);
    const now = new Date().toISOString();

    try {
      for (const booking of bookings) {
        const payload = {
          user_id: parseInt(booking.user_id),
          from_location: booking.from_location,
          to_location: booking.to_location,
          seats: parseInt(booking.seats),
          price_per_seat: parseInt(booking.price_per_seat),
          total_price: parseInt(booking.total_price),
          created_at: now,
          updated_at: now,
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/post`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          toast.error("❌ Failed to submit a booking entry.");
          return;
        }
      }

      toast.success("✅ Booking(s) added successfully!");
      router.push("/admin/booking");
    } catch (error) {
      toast.error("❌ Error submitting data. User Not Found");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="product-add-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p className="loading-text">Submitting bookings...</p>
        </div>
      )}
      <div className="product-header">
        <button onClick={() => router.push("/admin/booking")} className="back-btn">
          ◀ Back
        </button>
      </div>

      <h1 className="product-add-heading">Add Bookings</h1>
      <form onSubmit={handleSubmit}>
        <table className="product-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>From</th>
              <th>To</th>
              <th>Seats</th>
              <th>Price/Seat</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => {
              const fromOptions = [...new Set(travels.map((t) => t.from_location))];
              const toOptions = travels
                .filter((t) => t.from_location === booking.from_location)
                .map((t) => t.to_location);

              return (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={booking.user_id}
                      onChange={(e) => handleChange(index, "user_id", e.target.value)}
                      className={`product-input ${errors[index]?.user_id ? "input-error" : ""}`}
                    />
                    {errors[index]?.user_id && <small className="error-text">{errors[index].user_id}</small>}
                  </td>

                  <td>
                    <select
                      value={booking.from_location}
                      onChange={(e) => handleChange(index, "from_location", e.target.value)}
                      className={`product-input ${errors[index]?.from_location ? "input-error" : ""}`}
                    >
                      <option value="">Select From</option>
                      {fromOptions.map((from, i) => (
                        <option key={i} value={from}>
                          {from}
                        </option>
                      ))}
                    </select>
                    {errors[index]?.from_location && <small className="error-text">{errors[index].from_location}</small>}
                  </td>

                  <td>
                    <select
                      value={booking.to_location}
                      onChange={(e) => handleChange(index, "to_location", e.target.value)}
                      className={`product-input ${errors[index]?.to_location ? "input-error" : ""}`}
                    >
                      <option value="">Select To</option>
                      {toOptions.map((to, i) => (
                        <option key={i} value={to}>
                          {to}
                        </option>
                      ))}
                    </select>
                    {errors[index]?.to_location && <small className="error-text">{errors[index].to_location}</small>}
                  </td>

                  <td>
                    <input
                      type="number"
                      value={booking.seats}
                      min="1"
                      max={
                        travels.find(
                          (t) =>
                            t.from_location === booking.from_location &&
                            t.to_location === booking.to_location
                        )?.seats || ""
                      }
                      onChange={(e) => handleChange(index, "seats", e.target.value)}
                      className={`product-input ${errors[index]?.seats ? "input-error" : ""}`}
                    />
                    {errors[index]?.seats && <small className="error-text">{errors[index].seats}</small>}
                  </td>



                  <td>
                    <input
                      type="text"
                      value={booking.price_per_seat}
                      readOnly
                      className={`product-input read-only ${errors[index]?.price_per_seat ? "input-error" : ""}`}
                    />
                    {errors[index]?.price_per_seat && <small className="error-text">{errors[index].price_per_seat}</small>}
                  </td>

                  <td>
                    <input
                      type="text"
                      value={booking.total_price}
                      readOnly
                      className={`product-input read-only ${errors[index]?.total_price ? "input-error" : ""}`}
                    />
                    {errors[index]?.total_price && <small className="error-text">{errors[index].total_price}</small>}
                  </td>

                  <td>
                    <button type="button" onClick={() => removeRow(index)} className="remove-btn">
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="product-actions">
          <button type="button" onClick={addRow} className="btn add-btn">
            + Add Booking
          </button>
          <button type="submit" className="btn submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit All"}
          </button>
        </div>
      </form>
    </div>
  );
}







