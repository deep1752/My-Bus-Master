"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function EditBooking() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    user_id: "",
    from_location: "",
    to_location: "",
    seats: "1",
    price_per_seat: "",
    total_price: "",
  });

  const [errors, setErrors] = useState({});
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch travel routes
  useEffect(() => {
    fetch("https://my-bus-api.onrender.com/travels/get")
      .then((res) => res.json())
      .then((data) => setTravels(data))
      .catch(() => toast.error("❌ Failed to load travel routes"));
  }, []);

  // Fetch booking details
  useEffect(() => {
    fetch(`https://my-bus-api.onrender.com/bookings/get_by_id/${id}`)
      .then((res) => res.json())
      .then((booking) => {
        setFormData({
          user_id: booking.user_id.toString(),
          from_location: booking.from_location,
          to_location: booking.to_location,
          seats: booking.seats.toString(),
          price_per_seat: booking.price_per_seat.toString(),
          total_price: booking.total_price.toString(),
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("❌ Failed to load booking data.");
        setLoading(false);
      });
  }, [id]);

  // Derived options
  const fromOptions = [...new Set(travels.map((t) => t.from_location))];
  const toOptions = travels
    .filter((t) => t.from_location === formData.from_location)
    .map((t) => t.to_location);

  const handleChange = (field, value) => {
    let updated = { ...formData, [field]: value };

    // If locations change, update price
    if (field === "from_location" || field === "to_location") {
      const from = field === "from_location" ? value : updated.from_location;
      const to = field === "to_location" ? value : updated.to_location;
      const match = travels.find((t) => t.from_location === from && t.to_location === to);

      if (match) {
        updated.price_per_seat = String(match.price);
      } else {
        updated.price_per_seat = "";
      }
    }

    // Auto calculate total
    const seats = parseInt(updated.seats || "0", 10);
    const price = parseInt(updated.price_per_seat || "0", 10);
    updated.total_price = seats && price ? String(seats * price) : "";

    setFormData(updated);

    // Clear errors
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.user_id) newErrors.user_id = "User ID is required";
    if (!formData.from_location) newErrors.from_location = "From is required";
    if (!formData.to_location) newErrors.to_location = "To is required";
    if (!formData.seats) newErrors.seats = "Seats are required";
    if (!formData.price_per_seat) newErrors.price_per_seat = "Price per seat is required";
    if (!formData.total_price) newErrors.total_price = "Total price is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("❗ Please fix validation errors.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: parseInt(formData.user_id),
        from_location: formData.from_location,
        to_location: formData.to_location,
        seats: parseInt(formData.seats),
        price_per_seat: parseInt(formData.price_per_seat),
        total_price: parseInt(formData.total_price),
        updated_at: new Date().toISOString(),
      };

      const res = await fetch(`https://my-bus-api.onrender.com/bookings/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update booking");

      toast.success("✅ Booking updated successfully!");
      router.push("/admin/booking");
    } catch (err) {
      toast.error("❌ Error updating booking.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-container">Loading booking...</div>;

  return (
    <div className="edit-booking-container">
      <div className="edit-booking-header">
        <button onClick={() => router.push("/admin/booking")} className="back-button">
          ◀ Back
        </button>
        <h1 className="edit-booking-title">Edit Booking</h1>
      </div>

      <form onSubmit={handleSubmit} className="edit-booking-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">User ID</label>
            <input
              type="text"
              value={formData.user_id}
              onChange={(e) => handleChange("user_id", e.target.value)}
              className={`form-input ${errors.user_id ? "input-error" : ""}`}
            />
            {errors.user_id && <span className="error-message">{errors.user_id}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">From</label>
            <select
              value={formData.from_location}
              onChange={(e) => handleChange("from_location", e.target.value)}
              className={`form-select ${errors.from_location ? "input-error" : ""}`}
            >
              <option value="">Select From</option>
              {fromOptions.map((from, i) => (
                <option key={i} value={from}>
                  {from}
                </option>
              ))}
            </select>
            {errors.from_location && <span className="error-message">{errors.from_location}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">To</label>
            <select
              value={formData.to_location}
              onChange={(e) => handleChange("to_location", e.target.value)}
              className={`form-select ${errors.to_location ? "input-error" : ""}`}
            >
              <option value="">Select To</option>
              {toOptions.map((to, i) => (
                <option key={i} value={to}>
                  {to}
                </option>
              ))}
            </select>
            {errors.to_location && <span className="error-message">{errors.to_location}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Seats</label>
            <input
              type="number"
              min="1"
              max={
                travels.find(
                  (t) =>
                    t.from_location === formData.from_location &&
                    t.to_location === formData.to_location
                )?.seats || ""
              }
              value={formData.seats}
              onChange={(e) => handleChange("seats", e.target.value)}
              className={`form-input ${errors.seats ? "input-error" : ""}`}
            />
            {errors.seats && <span className="error-message">{errors.seats}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Price per Seat</label>
            <input
              type="text"
              value={formData.price_per_seat}
              readOnly
              className={`form-input readonly ${errors.price_per_seat ? "input-error" : ""}`}
            />
            {errors.price_per_seat && <span className="error-message">{errors.price_per_seat}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Total Price</label>
            <input
              type="text"
              value={formData.total_price}
              readOnly
              className={`form-input readonly ${errors.total_price ? "input-error" : ""}`}
            />
            {errors.total_price && <span className="error-message">{errors.total_price}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Updating..." : "Update Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}