'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Axios for HTTP requests
import { toast } from 'sonner';
import moment from 'moment'; // For date/time manipulation

const AdminDashboard = () => {
  // State variables for travels, bookings, users, and loading state
  const [travels, setTravels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect runs once when component mounts
  useEffect(() => {
    fetchData(); // Fetch data from API
  }, []);

  // Fetch data from backend APIs using axios
  const fetchData = async () => {
    try {
      // Fetch travels, bookings, and users in parallel using Promise.all
      const [travelsRes, bookingsRes, usersRes] = await Promise.all([
        axios.get('https://my-bus-api.onrender.com/travels/get'),
        axios.get('https://my-bus-api.onrender.com/bookings/get'),
        axios.get('https://my-bus-api.onrender.com/users/users'),
      ]);

      // Store API data in state; fallback to empty array if response is undefined/null
      setTravels(travelsRes.data || []);
      setBookings(bookingsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {

      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      // Turn off loading spinner regardless of success or failure
      setLoading(false);
    }
  };

  // Calculate total revenue from bookings
  // Optionally filter by a specific date range (startDate and endDate)
  const calculateRevenue = (startDate = null, endDate = null) => {
    return bookings
      .filter((b) => {
        const created = moment(b.created_at);
        if (startDate && endDate) {
          return created.isBetween(startDate, endDate, undefined, '[]'); // inclusive
        }
        return true; // if no filter, include all bookings
      })
      .reduce((sum, b) => sum + (b.total_price || 0), 0);
  };

  // Set current moment
  const now = moment();

  // Define custom date ranges
  const startOfThisMonth = moment().startOf('month');
  const endOfThisMonth = moment().endOf('month');

  const startOfFinancialYear = now.month() >= 3 // April is month 3 (0-indexed)
    ? moment([now.year(), 3, 1]) // April 1 this year
    : moment([now.year() - 1, 3, 1]); // April 1 last year

  const endOfFinancialYear = startOfFinancialYear.clone().add(1, 'year').subtract(1, 'day');

  // Pre-compute revenue values for display
  const revenue = {
    total: calculateRevenue(), // All time
    last10Days: calculateRevenue(now.clone().subtract(10, 'days'), now),
    lastMonth: calculateRevenue(now.clone().subtract(30, 'days'), now),
    last3Months: calculateRevenue(now.clone().subtract(90, 'days'), now),
    lastYear: calculateRevenue(now.clone().subtract(365, 'days'), now),
    thisMonth: calculateRevenue(startOfThisMonth, endOfThisMonth),
    thisFinancialYear: calculateRevenue(startOfFinancialYear, endOfFinancialYear),
  };

  // Show loading screen while data is being fetched
  if (loading) return <div className="admin-dashboard-loading">Loading Dashboard...</div>;

  // Dashboard UI
  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard__title">Admin Dashboard</h1>

      {/* Summary stats for travels, customers, and bookings */}
      <div className="admin-dashboard__summary-grid">
        <Card title="Total Travels" value={travels.length} />
        <Card title="Total Customers" value={users.length} />
        <Card title="Total Bookings" value={bookings.length} />
      </div>

      {/* Revenue section */}
      <h2 className="admin-dashboard__subtitle">Revenue Summary</h2>
      <div className="admin-dashboard__revenue-grid">

        <Card title="This Month's Revenue" value={`₹${revenue.thisMonth}`} />
        <Card title="Last 10 Days Revenue" value={`₹${revenue.last10Days}`} />
        <Card title="Last Month Revenue" value={`₹${revenue.lastMonth}`} />
        <Card title="Last 3 Months Revenue" value={`₹${revenue.last3Months}`} />
        <Card title="This Year Revenue" value={`₹${revenue.thisFinancialYear}`} />
        <Card title="Last Year Revenue" value={`₹${revenue.lastYear}`} />
        <Card title="Total Revenue" value={`₹${revenue.total}`} />
      </div>
    </div>
  );
};

// Reusable Card component for dashboard metrics
const Card = ({ title, value }) => (
  <div className="admin-dashboard-card">
    <h3 className="admin-dashboard-card__title">{title}</h3>
    <p className="admin-dashboard-card__value">{value}</p>
  </div>
);

export default AdminDashboard; // Export the component
