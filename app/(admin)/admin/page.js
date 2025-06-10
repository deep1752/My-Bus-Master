'use client';

import { useForm } from "react-hook-form"; // React Hook Form for form handling
import { z } from "zod"; // Zod for schema validation
import { zodResolver } from "@hookform/resolvers/zod"; // Integration of Zod with React Hook Form
import axios from "axios"; // Axios for API calls
import { toast } from "sonner"; // Toast notifications
import { useEffect } from "react"; // React hook for side effects
import { useRouter } from "next/navigation"; // Next.js router for navigation

// Define validation schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"), // Email must be valid
  password: z.string().min(6, "Password must be at least 6 characters long"), // Password must be at least 6 chars
});

export default function LoginPage() {
  const router = useRouter();

  // Initialize the form with Zod validation
  const {
    register, // Registers form inputs
    handleSubmit, // Handles form submission
    formState: { errors, isSubmitting }, // Tracks form errors and submission state
  } = useForm({
    resolver: zodResolver(loginSchema), // Connect Zod schema with the form
  });

  // Redirect to admin profile if already logged in as admin
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const role = localStorage.getItem("admin_role");
    if (token && role === "admin") {
      router.push("/admin/profile");
    }
  }, [router]);

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      // Login request
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, data);
      const token = res.data.access_token;

      // Fetch user profile with the token
      const profile = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userRole = profile.data.role?.toLowerCase();

      // Check if user is admin
      if (userRole !== "admin") {
        toast.error("Access denied. Only admins can log in.");
        return;
      }

      // Store user data in localStorage
      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_user", JSON.stringify(profile.data));
      localStorage.setItem("admin_role", profile.data.role);

      toast.success("Login successful!");
      router.push("/admin/profile"); // Redirect to admin profile
    } catch (err) {
      // Show error message if login fails
      const errorMessage = err?.response?.data?.detail || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  // JSX for login form
  return (
    <div className="login-page-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h2 className="login-title">Admin Login</h2>

        {/* Email input field */}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            {...register("email")}
            type="email"
            className={`form-input ${errors.email ? "input-error" : ""}`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        {/* Password input field */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            {...register("password")}
            type="password"
            className={`form-input ${errors.password ? "input-error" : ""}`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            // Show loading indicator while submitting
            <span className="button-loading">
              <span className="loading-spinner"></span>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}
