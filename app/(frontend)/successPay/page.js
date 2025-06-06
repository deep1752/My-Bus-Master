"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { toast } from "sonner";
import axios from "axios";
import { CheckCircle, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';


const SuccessPay = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userInfo, loading } = useUserContext();
  const [sessionData, setSessionData] = useState(null);
  const [travelDetails, setTravelDetails] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      const sessionId = searchParams.get('session_id');
      if (!sessionId) {
        toast.error("Invalid session ID");
        router.push("/");
        return;
      }

      try {
        const response = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch session data");
        }
        const data = await response.json();
        setSessionData(data);

        const travelId = data.metadata.travel_id;
        const travelResponse = await axios.get(
          `http://127.0.0.1:8000/travels/get_by_id/${travelId}`
        );
        setTravelDetails(travelResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to verify payment");
        router.push("/");
      }
    };

    if (!loading && !userInfo) {
      toast.error("Please login to complete booking");
      router.push("/login");
    } else if (!loading && userInfo) {
      fetchSessionData();
    }
  }, [loading, userInfo]);

  const updateAvailableSeats = async (travelId, bookedSeats) => {
    try {
      const currentTravel = await axios.get(
        `http://127.0.0.1:8000/travels/get_by_id/${travelId}`
      );
      const currentSeats = currentTravel.data.seats;
      const updatedSeats = currentSeats - bookedSeats;

      await axios.put(
        `http://127.0.0.1:8000/travels/update/${travelId}`,
        { seats: updatedSeats },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return true;
    } catch (error) {
      console.error("Error updating seats:", error);
      return false;
    }
  };

  const copyToClipboard = () => {
    setIsCopying(true);
    navigator.clipboard.writeText(bookingId)
      .then(() => {
        toast.success("Booking ID copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy");
      })
      .finally(() => {
        setTimeout(() => setIsCopying(false), 1000);
      });
  };

  useEffect(() => {
    const createBooking = async () => {
      if (!userInfo || !sessionData || !travelDetails) return;

      const now = new Date().toISOString();


      const bookingData = {
        user_id: userInfo.id,
        from_location: sessionData.metadata.from_location,
        to_location: sessionData.metadata.to_location,
        seats: parseInt(sessionData.metadata.seats),
        price_per_seat: parseFloat(sessionData.metadata.price_per_seat),
        total_price: parseFloat(sessionData.metadata.total_price),
        travel_id: sessionData.metadata.travel_id,
        created_at: now,
        updated_at: now,
      };

      try {
        const bookingResponse = await axios.post(
          "http://127.0.0.1:8000/bookings/post",
          bookingData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (bookingResponse.status === 200 || bookingResponse.status === 201) {
          setBookingId(bookingResponse.data.id); // Store the booking ID
          const seatsUpdated = await updateAvailableSeats(
            sessionData.metadata.travel_id,
            bookingData.seats
          );

          if (seatsUpdated) {
            toast.success("Booking successful! Seats updated.");
          } else {
            toast.warning("Booking created but failed to update seats. Please contact support.");
          }
        } else {
          toast.error("Booking failed. Please try again.");
        }
      } catch (error) {
        console.error("Booking Error:", error);
        toast.error("Error while creating booking.");
      }
    };

    if (sessionData && travelDetails) {
      createBooking();
    }
  }, [sessionData, userInfo, travelDetails]);

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <CheckCircle className="payment-success-icon" size={60} />
        <h1 className="payment-success-title">Payment Successful!</h1>

        {bookingId ? (
          <>
            <p className="payment-success-message">
              Your booking has been confirmed with ID:
            </p>
            <div className="booking-id-container">
              <span className="booking-id">#{bookingId}</span>
              <button
                onClick={copyToClipboard}
                className="copy-button"
                disabled={isCopying}
              >
                {isCopying ? (
                  <Loader2 className="copy-icon animate-spin" size={16} />
                ) : (
                  <Copy className="copy-icon" size={16} />
                )}
              </button>
            </div>
            <p className="payment-note">
              A confirmation has been sent to your email.
            </p>

            {/* New View Booking Button */}
            <div className="mt-6">
              <Button
                onClick={() => router.push(`/bookings`)}
                className="view-booking-button"
              >
                View Your Booking Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <p className="payment-success-message">
            Processing your booking... Please wait.
          </p>
        )}
      </div>
    </div>
  );
};
export default SuccessPay;