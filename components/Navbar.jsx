"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { CgUser } from "react-icons/cg";
import { toast } from "sonner";
import logo from "../public/Logo.png";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

const Navbar = ({ Searchproducts }) => {
  const { userInfo, setUserInfo } = useUserContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link href="/" className="navbar__logo">
        {/* <Image src={logo} width={140} height={25} alt="logo" /> */}
        <span className="navbar__logo-text">BusExpress</span>
      </Link>

      {/* Nav Links */}
      <ul className="navbar__links">
        <li className="navbar__link-item">
          <Link href="/" className="navbar__link">Home</Link>
        </li>
        <li className="navbar__link-item">
          <Link href="/about" className="navbar__link">About</Link>
        </li>
        <li className="navbar__link-item">
          <Link href="/bookNow" className="navbar__link">Book Now</Link>
        </li>
        <li className="navbar__link-item">
          <Link href="/bookings" className="navbar__link">My Bookings</Link>
        </li>
        <li className="navbar__link-item">
          <Link href="/contact" className="navbar__link">Contact Us</Link>
        </li>
      </ul>

      <div className="navbar__actions">
        {/* User Login/Dropdown */}
        {userInfo ? (
          <div className="navbar__user-dropdown">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="navbar__user-button"
            >
              <CgUser size={22} className="navbar__user-icon" />
              <span className="navbar__user-name">{userInfo.name || "User"}</span>
            </button>
            {showDropdown && (
              <div className="navbar__dropdown-menu">
                <Link href="/profile">
                  <button className="navbar__dropdown-item">Profile</button>
                </Link>
                <Link href="/profile/change-password">
                  <button className="navbar__dropdown-item">Change Password</button>
                </Link>
                <button
                  className="navbar__dropdown-item navbar__dropdown-item--logout"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userName");
                    setUserInfo(null);
                    toast.success("Logged out successfully");
                    router.push("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <button className="navbar__login-button">
              <CgUser size={22} className="navbar__user-icon" />
              <span>Login/Sign Up</span>
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;