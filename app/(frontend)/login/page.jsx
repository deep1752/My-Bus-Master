
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

// Zod for schema validation and integration with react-hook-form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserContext } from "@/context/UserContext";

// JWT decode to extract data from token
import { jwtDecode } from "jwt-decode";

// 🔐 Zod schema for validating login form inputs
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const router = useRouter(); // Next.js router
  const [token, setToken] = useState(null); // State to hold token
  const { refreshUserInfo } = useUserContext(); // Refresh user info from context

  // Auto-redirect user to profile if already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        const userName = decoded?.name || decoded?.sub || "User";
        localStorage.setItem("userName", userName);
        setToken(storedToken);
        router.push("/profile");
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
      }
    }
  }, [router]);

  // ⚙️ Setup form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  // 🎯 Form submission handler
  const onSubmit = async (data) => {
    try {
      const response = await fetch("https://my-bus-api.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // ❌ If login failed
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.detail || "Login failed");
        throw new Error(errorData.detail || "Login failed");
      }

      // ✅ If login successful
      const result = await response.json();
      const accessToken = result.access_token;

      if (accessToken) {
        // Save token in localStorage and update context
        localStorage.setItem("token", accessToken);
        setToken(accessToken);
        await refreshUserInfo();

        toast.success("Login successful!");

        // 🧭 Redirect if coming from wishlist page
        const wishlistSlug = localStorage.getItem("wishlist_redirect");
        if (wishlistSlug) {
          localStorage.removeItem("wishlist_redirect");
          router.push(`/products/${wishlistSlug}?addToWishlist=true`);
        } else {
          router.push("/bookNow");
        }
      } else {
        toast.error("No access token received.");
      }
    } catch (error) {
      console.error(error);
      setError("root", {
        type: "manual",
        message: error.message || "Invalid credentials. Please try again.",
      });
      toast.error(error.message || "Something went wrong!");
    }
  };

  // 🧱 Render the login form
  return (
    <div className="auth-container">
      <Card className="glass-card">
        <CardContent className="card-body">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account</p>
            <div className="decoration-line"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="auth-fields">
              {/* Email Field */}
              <div className="auth-field-group">
                <Label htmlFor="email" className="auth-label">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="auth-input"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="auth-error" aria-live="polite">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="auth-field-group">
                <Label htmlFor="password" className="auth-label">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className="auth-input"
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <p className="auth-error" aria-live="polite">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="auth-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ReloadIcon className="auth-spinner" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="auth-footer">
            <div className="auth-footer-links">
              <Link href="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>
            <div className="auth-footer-text">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="auth-link">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="floating-shapes">
        <div className="shape-1"></div>
        <div className="shape-2"></div>
      </div>
    </div>
  );
}