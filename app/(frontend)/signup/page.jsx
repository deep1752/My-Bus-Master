"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mob_number: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/profile");
    }
  }, []);

  const validate = () => {
    const errs = {};

    if (form.name.trim().length < 2) errs.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email address";
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.mob_number.length < 10) errs.mob_number = "Mobile number is required";

    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the form errors.");
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.detail || "Something went wrong");

      toast.success("Account created successfully! You can now log in.");
      setForm({ name: "", email: "", password: "", mob_number: "" });
      router.push("/login");
    } catch (error) {
      toast.error(error.message || "Signup failed. Please try again.");
      setErrors({ root: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <Card className="glass-card">
        <CardContent className="card-body">
          <div className="signup-header">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join our community</p>
            <div className="decoration-line"></div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-fields">
              {["name", "email", "password", "mob_number"].map((field) => (
                <div key={field} className="auth-field-group">
                  <Label htmlFor={field} className="auth-label">
                    {field === "mob_number" ? "Mobile Number" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    id={field}
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    placeholder={`Enter your ${field}`}
                    value={form[field]}
                    onChange={handleChange}
                    className="auth-input"
                  />
                  {errors[field] && <p className="auth-error">{errors[field]}</p>}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="auth-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ReloadIcon className="auth-spinner" />
                  <span>Creating account...</span>
                </>
              ) : "Sign up"}
            </Button>
          </form>

          <div className="signup-footer">
            <span>Already have an account?</span>
            <Link href="/login" className="signup-link">Sign in</Link>
          </div>
        </CardContent>
      </Card>
      <div className="floating-shapes">
        <div className="shape-1"></div>
        <div className="shape-2"></div>
      </div>
    </div>
  )
}