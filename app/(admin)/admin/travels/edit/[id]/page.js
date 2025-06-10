"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

// Utility function to validate URL
const isValidUrl = (url) => {
  const regex = /^(ftp|http|https):\/\/[^ "]+$/;
  return regex.test(url);
};

// Reusable InputField Component
const InputField = ({ label, name, type, value, onChange, error }) => (
  <tr key={name} className="edit-row">
    <td className="edit-label">{label}</td>
    <td className="edit-input-cell">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`edit-input ${error ? "input-error" : ""}`}
        required
      />
      {error && <small className="error-text">{error}</small>}
    </td>
  </tr>
);

// New TimeInputField Component with AM/PM selector
const TimeInputField = ({ value, onChange, error }) => {
  const [time, setTime] = useState("");
  const [period, setPeriod] = useState("AM");

  useEffect(() => {
    if (value) {
      // Split the existing time value into time and period
      const parts = value.split(" ");
      if (parts.length === 2) {
        setTime(parts[0]);
        setPeriod(parts[1]);
      } else {
        setTime(value);
      }
    }
  }, [value]);

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);
    onChange(`${newTime} ${period}`);
  };

  const handlePeriodChange = (e) => {
    const newPeriod = e.target.value;
    setPeriod(newPeriod);
    onChange(`${time} ${newPeriod}`);
  };

  return (
    <tr className="edit-row">
      <td className="edit-label">Time</td>
      <td className="edit-input-cell">
        <div className="time-input-container">
          <input
            type="text"
            value={time}
            onChange={handleTimeChange}
            placeholder="HH:MM"
            className={`edit-input ${error ? "input-error" : ""}`}
            required
          />
          <select
            value={period}
            onChange={handlePeriodChange}
            className="time-period-select"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        {error && <small className="error-text">{error}</small>}
      </td>
    </tr>
  );
};

export default function EditTravel() {
  const { id: travelId } = useParams();
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!travelId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/get_by_id/${travelId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch travel data");
        return res.json();
      })
      .then((data) => {
        setFormData({
          image: data.image || "",
          from_location: data.from_location || "",
          to_location: data.to_location || "",
          time: data.time || "",
          seats: data.seats ?? 0,
          price: data.price ?? 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching travel data:", err);
        setLoading(false);
        router.push("/admin/travels");
      });
  }, [travelId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["seats", "price"].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTimeChange = (timeWithPeriod) => {
    setFormData((prev) => ({ ...prev, time: timeWithPeriod }));
    setErrors((prev) => ({ ...prev, time: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.image.trim()) newErrors.image = "Image URL is required";
    else if (!isValidUrl(formData.image.trim())) newErrors.image = "Please provide a valid image URL.";

    if (!formData.from_location.trim()) newErrors.from_location = "From location is required";
    if (!formData.to_location.trim()) newErrors.to_location = "To location is required";
    if (!formData.time.trim()) newErrors.time = "Time is required";

    if (!formData.seats.toString().trim()) {
      newErrors.seats = "Seats are required";
    } else if (!/^\d+$/.test(formData.seats)) {
      newErrors.seats = "Seats must be a number";
    }

    if (!formData.price.toString().trim()) {
      newErrors.price = "Price is required";
    } else if (!/^\d+$/.test(formData.price)) {
      newErrors.price = "Price must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("❗ Please correct all required fields.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/update/${travelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          seats: parseInt(formData.seats, 10),
          price: parseInt(formData.price, 10),
        }),
      });

      if (res.ok) {
        toast.success("✅ Travel updated successfully!");
        router.push("/admin/travels");
      } else {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          toast.error(`❌ Update failed: ${json.detail || "Unknown error"}`);
        } catch {
          toast.error(`❌ Update failed: ${text || res.statusText}`);
        }
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("❌ Something went wrong during update.");
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading travel details...</p>
      </div>
    );
  }

  if (!formData) {
    return <p className="text-red-500">❌ Failed to load travel data.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <button
        type="button"
        onClick={() => router.push("/admin/travels")}
        className="back-btn"
      >
        ◀ Back
      </button>
      <table className="edit-table">
        <tbody>
          {[
            { label: "Image URL", name: "image", type: "text" },
            { label: "From Location", name: "from_location", type: "text" },
            { label: "To Location", name: "to_location", type: "text" },
          ].map(({ label, name, type }) => (
            <InputField
              key={name}
              label={label}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              error={errors[name]}
            />
          ))}
          
          <TimeInputField 
            value={formData.time}
            onChange={handleTimeChange}
            error={errors.time}
          />

          {[
            { label: "Seats", name: "seats", type: "number" },
            { label: "Price", name: "price", type: "number" },
          ].map(({ label, name, type }) => (
            <InputField
              key={name}
              label={label}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              error={errors[name]}
            />
          ))}
        </tbody>
      </table>

      <div className="edit-submit-container">
        <button type="submit" className="edit-submit-button">
          Update Travel
        </button>
      </div>
    </form>
  );
}