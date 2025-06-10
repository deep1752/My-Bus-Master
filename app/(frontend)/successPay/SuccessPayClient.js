'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';
import { toast } from 'sonner';
import axios from 'axios';
import { CheckCircle, Copy, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SuccessPayClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userInfo, loading } = useUserContext();

  const [sessionData, setSessionData] = useState(null);
  const [travelDetails, setTravelDetails] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [isCopying, setIsCopying] = useState(false);

  const updateAvailableSeats = useCallback(async (travelId, bookedSeats) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/get_by_id/${travelId}`
      );
      const updatedSeats = data.seats - bookedSeats;

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/update/${travelId}`,
        { seats: updatedSeats },
        { headers: { 'Content-Type': 'application/json' } }
      );

      return true;
    } catch (error) {
      console.error('Error updating seats:', error);
      return false;
    }
  }, []);

  const createBooking = useCallback(async () => {
    if (!userInfo || !sessionData || !travelDetails) return;

    const now = new Date().toISOString();
    const metadata = sessionData.metadata;

    const bookingData = {
      user_id: userInfo.id,
      from_location: metadata.from_location,
      to_location: metadata.to_location,
      seats: parseInt(metadata.seats),
      price_per_seat: parseFloat(metadata.price_per_seat),
      total_price: parseFloat(metadata.total_price),
      travel_id: metadata.travel_id,
      created_at: now,
      updated_at: now,
    };

    try {
      const { data, status } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/post`,
        bookingData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (status === 200 || status === 201) {
        setBookingId(data.id);
        const updated = await updateAvailableSeats(metadata.travel_id, bookingData.seats);

        if (updated) {
          toast.success('Booking successful! Seats updated.');
        } else {
          toast.warning('Booking done, but seat update failed.');
        }
      } else {
        toast.error('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking Error:', error);
      toast.error('Booking failed due to an error.');
    }
  }, [sessionData, userInfo, travelDetails, updateAvailableSeats]);

  const fetchSessionData = useCallback(async () => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      toast.error('Missing session ID.');
      router.push('/');
      return;
    }

    try {
      const res = await fetch(`/api/stripe/session?session_id=${sessionId}`);
      if (!res.ok) throw new Error('Invalid session response');

      const data = await res.json();
      setSessionData(data);

      const travelId = data.metadata.travel_id;
      const travelRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/get_by_id/${travelId}`
      );
      setTravelDetails(travelRes.data);
    } catch (err) {
      console.error('Session fetch error:', err);
      toast.error('Payment verification failed.');
      router.push('/');
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (!loading && !userInfo) {
      toast.error('Please login to view booking.');
      router.push('/login');
    } else if (!loading && userInfo) {
      fetchSessionData();
    }
  }, [loading, userInfo, router, fetchSessionData]);

  useEffect(() => {
    if (sessionData && travelDetails) {
      createBooking();
    }
  }, [sessionData, travelDetails, createBooking]);

  const copyToClipboard = () => {
    setIsCopying(true);
    navigator.clipboard
      .writeText(bookingId)
      .then(() => toast.success('Booking ID copied'))
      .catch(() => toast.error('Copy failed'))
      .finally(() => setTimeout(() => setIsCopying(false), 1000));
  };

  return (
    <div className="payment-success-container p-6 max-w-xl mx-auto text-center">
      <div className="payment-success-card bg-white shadow-lg rounded-xl p-8">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={60} />
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>

        {bookingId ? (
          <>
            <p className="mb-2">Your booking has been confirmed with ID:</p>
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="font-mono text-lg text-blue-600">#{bookingId}</span>
              <button onClick={copyToClipboard} disabled={isCopying}>
                {isCopying ? (
                  <Loader2 className="animate-spin text-gray-500" size={16} />
                ) : (
                  <Copy className="text-gray-700" size={16} />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              A confirmation has been sent to your email.
            </p>
            <Button onClick={() => router.push('/bookings')}>
              View Your Booking Details <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </>
        ) : (
          <p className="text-gray-600">Processing your booking... Please wait.</p>
        )}
      </div>
    </div>
  );
};

export default SuccessPayClient;
