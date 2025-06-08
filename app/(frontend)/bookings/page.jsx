"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/UserContext";

import { Loader2, Trash2, Calendar, MapPin, Users, IndianRupee, Hash, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const BookingsPage = () => {
  const { userInfo, loading, error } = useUserContext();
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !userInfo) {
      toast.error('Please login to view your bookings');
      router.push('/login');
    }
  }, [userInfo, loading, router]);

  useEffect(() => {
    if (userInfo?.id) {
      const fetchBookings = async () => {
        try {
          const response = await fetch(`https://my-bus-api.onrender.com/bookings/user/${userInfo.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch bookings');
          }
          const data = await response.json();
          const sortedBookings = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setBookings(sortedBookings);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setIsLoadingBookings(false);
        }
      };

      fetchBookings();
    }
  }, [userInfo]);

  // Function to calculate time remaining for confirmation
  const getTimeRemaining = (createdAt) => {
    const createdTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - createdTime;
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    const remainingTime = Math.max(oneHour - elapsedTime, 0);

    return {
      hours: Math.floor(remainingTime / (1000 * 60 * 60)),
      minutes: Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((remainingTime % (1000 * 60)) / 1000),
      isExpired: remainingTime <= 0
    };
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this booking?');

    if (!confirmed) return;

    setCancellingId(bookingId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://my-bus-api.onrender.com/bookings/delete/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      setBookings(bookings.filter(booking => booking.id !== bookingId));
      toast.info('Booking cancelled successfully. Refund will be processed to your payment method within 3-5 business days');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCancellingId(null);
    }
  };

  // Effect to update countdown timers every second
  useEffect(() => {
    const timer = setInterval(() => {
      setBookings(prevBookings => {
        return prevBookings.map(booking => {
          return { ...booking }; // This triggers a re-render to update the timers
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading || isLoadingBookings) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <h1 className="bookings-title">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bookings-empty-state">
          <p className="bookings-empty-text">You don't have any bookings yet.</p>
          <Button
            onClick={() => router.push('/bookNow')}
            className="bookings-empty-button"
          >
            Book Now
          </Button>
        </div>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead className="bookings-table-header">
              <tr>
                <th className="bookings-table-head">Booking ID</th>
                <th className="bookings-table-head">Route</th>
                <th className="bookings-table-head">Date</th>
                <th className="bookings-table-head">Seats</th>
                <th className="bookings-table-head">Price/Seat</th>
                <th className="bookings-table-head">Total</th>
                <th className="bookings-table-head">Status</th>
                <th className="bookings-table-head actions-head">Action</th>
              </tr>
            </thead>
            <tbody className="bookings-table-body">
              {bookings.map((booking) => {
                const timeRemaining = getTimeRemaining(booking.created_at);
                const isConfirmed = timeRemaining.isExpired;

                return (
                  <tr key={booking.id} className="bookings-table-row">
                    <td className="bookings-table-cell">
                      <div className="bookings-cell-content">
                        <Hash className="bookings-cell-icon" />
                        <span className="bookings-id">#{booking.id}</span>
                      </div>
                    </td>
                    <td className="bookings-table-cell">
                      <div className="bookings-cell-content">
                        <MapPin className="bookings-cell-icon" />
                        <span>{booking.from_location} → {booking.to_location}</span>
                      </div>
                    </td>
                    <td className="bookings-table-cell">
                      <div className="bookings-cell-content">
                        <Calendar className="bookings-cell-icon" />
                        <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="bookings-table-cell">
                      <div className="bookings-cell-content">
                        <Users className="bookings-cell-icon" />
                        <span>{booking.seats}</span>
                      </div>
                    </td>
                    <td className="bookings-table-cell">
                      <div className="bookings-cell-content">
                        <IndianRupee className="bookings-cell-icon" />
                        <span>{booking.price_per_seat}</span>
                      </div>
                    </td>
                    <td className="bookings-table-cell">
                      <div className="bookings-cell-content">
                        <IndianRupee className="bookings-cell-icon" />
                        <span className="bookings-total-price">{booking.total_price}</span>
                      </div>
                    </td>
                    <td className="bookings-table-cell">
                      <div className="bookings-cell-content">
                        {isConfirmed ? (
                          <div className="flex items-center text-green-500">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span>Confirmed</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-yellow-500">
                            <span>Confirmed</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="bookings-table-cell actions-cell">
                      {!isConfirmed ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            ({timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s)
                          </span>
                          <Button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="bookings-cancel-button"
                          >
                            {cancellingId === booking.id ? (
                              <Loader2 className="bookings-button-icon animate-spin" />
                            ) : (
                              <Trash2 className="bookings-button-icon" />
                            )}
                            Cancel
                          </Button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default BookingsPage;