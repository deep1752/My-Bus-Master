"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const defaultTravel = {
  image: "",
  from_location: "",
  to_location: "",
  time: "",
  timePeriod: "AM", // Add this new field
  seats: "",
  price: "",
};

export default function AddTravels() {
  const [travels, setTravels] = useState([{ ...defaultTravel }]);
  const [errors, setErrors] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (index, field, value) => {
    const updated = [...travels];
    if ((field === "price" || field === "seats") && (!/^\d*$/.test(value))) return;
    updated[index][field] = value;
    setTravels(updated);

    const updatedErrors = [...errors];
    if (updatedErrors[index]) updatedErrors[index][field] = "";
    setErrors(updatedErrors);
  };

  // Add this new handler for time period changes
  const handleTimePeriodChange = (index, period) => {
    const updated = [...travels];
    updated[index].timePeriod = period;
    setTravels(updated);
  };

  const addRow = () => {
    setTravels([{ ...defaultTravel }, ...travels]);
    setErrors([{}, ...errors]);
  };

  const removeRow = (index) => {
    if (travels.length === 1) {
      toast.warning("⚠️ You cannot remove the last row.");
      return;
    }
    setTravels(travels.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };

  const validate = () => {
    let hasError = false;
    const newErrors = travels.map((travel) => {
      const fieldErrors = {};
      if (!travel.image.trim()) fieldErrors.image = "Image URL is required";
      if (!travel.from_location.trim()) fieldErrors.from_location = "From location required";
      if (!travel.to_location.trim()) fieldErrors.to_location = "To location required";
      if (!travel.time.trim()) fieldErrors.time = "Time is required";
      if (!travel.seats.trim()) fieldErrors.seats = "Seats required";
      if (!travel.price.trim()) fieldErrors.price = "Price required";

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
      for (const travel of travels) {
        // Combine time and timePeriod for submission
        const fullTime = `${travel.time} ${travel.timePeriod}`;
        
        const payload = {
          image: travel.image,
          from_location: travel.from_location,
          to_location: travel.to_location,
          time: fullTime, // Use the combined time here
          seats: parseInt(travel.seats),
          price: parseInt(travel.price),
          created_at: now,
          updated_at: now,
        };

        const res = await fetch("http://127.0.0.1:8000/travels/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          toast.error("❌ Failed to submit a travel entry.");
          return;
        }
      }

      toast.success("✅ Travel(s) added successfully!");
      router.push("/admin/travels");
    } catch (error) {
      toast.error("❌ Error submitting data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-add-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p className="loading-text">Submitting travels...</p>
        </div>
      )}
      <div className="product-header">
        <button onClick={() => router.push("/admin/travels")} className="back-btn">
          ◀ Back
        </button>
      </div>

      <h1 className="product-add-heading">Add Travels</h1>
      <form onSubmit={handleSubmit}>
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>From</th>
              <th>To</th>
              <th>Time</th>
              <th>Seats</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {travels.map((travel, index) => (
              <tr key={index}>
                {["image", "from_location", "to_location"].map((field) => (
                  <td key={field}>
                    <input
                      type="text"
                      value={travel[field]}
                      onChange={(e) => handleChange(index, field, e.target.value)}
                      placeholder={field.replace("_", " ")}
                      className={`product-input ${errors[index]?.[field] ? "input-error" : ""}`}
                    />
                    {errors[index]?.[field] && (
                      <small className="error-text">{errors[index][field]}</small>
                    )}
                  </td>
                ))}
                <td>
                  <div className="time-input-container">
                    <input
                      type="text"
                      value={travel.time}
                      onChange={(e) => handleChange(index, "time", e.target.value)}
                      placeholder="Time (e.g., 10:30)"
                      className={`product-input ${errors[index]?.time ? "input-error" : ""}`}
                    />
                    <select
                      value={travel.timePeriod}
                      onChange={(e) => handleTimePeriodChange(index, e.target.value)}
                      className="time-period-select"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  {errors[index]?.time && (
                    <small className="error-text">{errors[index].time}</small>
                  )}
                </td>
                {["seats", "price"].map((field) => (
                  <td key={field}>
                    <input
                      type="text"
                      value={travel[field]}
                      onChange={(e) => handleChange(index, field, e.target.value)}
                      placeholder={field}
                      className={`product-input ${errors[index]?.[field] ? "input-error" : ""}`}
                    />
                    {errors[index]?.[field] && (
                      <small className="error-text">{errors[index][field]}</small>
                    )}
                  </td>
                ))}
                <td>
                  <button type="button" onClick={() => removeRow(index)} className="remove-btn">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="product-actions">
          <button type="button" onClick={addRow} className="btn add-btn">
            + Add Travel
          </button>
          <button type="submit" className="btn submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit All"}
          </button>
        </div>
      </form>
    </div>
  );
}