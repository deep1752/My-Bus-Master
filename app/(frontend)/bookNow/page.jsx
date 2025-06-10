"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Clock, MapPin, Users, IndianRupee, Plus, Minus } from "lucide-react";
import getStripe from "@/lib/getStripe";
import { toast } from "react-hot-toast";
import { useUserContext } from "@/context/UserContext"; // Import the user context
import { useRouter } from "next/navigation"; // Import the router

const BookNowPage = () => {
  const { userInfo, loading: userLoading } = useUserContext(); // Get user info from context
  const router = useRouter(); // Initialize the router
  const [travels, setTravels] = useState([]);
  const [filteredTravels, setFilteredTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [seats, setSeats] = useState(1);

  // Fetch available travels
  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/get`);
        if (!response.ok) {
          throw new Error("Failed to fetch travels");
        }
        const data = await response.json();
        setTravels(data);
        setFilteredTravels(data);
      } catch (error) {
        console.error("Error fetching travels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTravels();
  }, []);

  // Filter travels based on search
  useEffect(() => {
    const filtered = travels.filter((travel) => {
      const fromMatch = searchFrom
        ? travel.from_location.toLowerCase().includes(searchFrom.toLowerCase())
        : true;
      const toMatch = searchTo
        ? travel.to_location.toLowerCase().includes(searchTo.toLowerCase())
        : true;
      return fromMatch && toMatch;
    });
    setFilteredTravels(filtered);
  }, [searchFrom, searchTo, travels]);

  // Handle booking button click
  const handleBookNow = (travel) => {
    // Check if user is logged in
    if (!userInfo) {
      // Store the current travel ID in localStorage for after login
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectAfterLogin", `/book-now?travelId=${travel.id}`);
      }
      // Redirect to login page
      router.push("/login");
      return;
    }

    if (travel.seats <= 0) {
      toast.error("Sorry, no seats available for this travel");
      return;
    }

    setSelectedTravel(travel);
    setSeats(1);
  };
  // Add this useEffect to your BookNowPage component
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check URL for travelId parameter
      const params = new URLSearchParams(window.location.search);
      const travelId = params.get("travelId");

      if (travelId) {
        // Find the travel with this ID
        const travel = travels.find(t => t.id.toString() === travelId);
        if (travel) {
          setSelectedTravel(travel);
          setSeats(1);
        }

        // Clean up the URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [travels]);



  // Handle increase/decrease seat selection
  const handleIncreaseSeats = () => {
    if (seats < selectedTravel.seats) {
      setSeats((prev) => prev + 1);
    } else {
      toast.error("Not enough seats available");
    }
  };

  const handleDecreaseSeats = () => setSeats((prev) => (prev > 1 ? prev - 1 : 1));

  // Stripe Checkout
  const handleCheckout = async () => {
    if (!selectedTravel) {
      toast.error("No travel selected");
      return;
    }

    if (seats > selectedTravel.seats) {
      toast.error("Not enough seats available");
      return;
    }

    const stripe = await getStripe();
    if (!stripe) {
      toast.error("Stripe not loaded");
      return;
    }

    const item = {
      id: selectedTravel.id,
      name: `${selectedTravel.from_location} to ${selectedTravel.to_location}`,
      price: selectedTravel.price,
      quantity: seats,
      image: selectedTravel.image,
      from_location: selectedTravel.from_location, // ⬅️ new
      to_location: selectedTravel.to_location,     // ⬅️ new
    };

    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([item]),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Stripe API Error:", text);
        toast.error("Failed to create checkout session");
        return;
      }

      const data = await response.json();
      if (!data?.id) {
        toast.error("Invalid Stripe session response");
        return;
      }

      toast.loading("Redirecting to payment...");
      await stripe.redirectToCheckout({ sessionId: data.id });

    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong during checkout");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading available travels...</p>
      </div>
    );
  }

  return (
    <div className="book-now-container">
      <h1 className="page-title">Book Your Bus Ticket</h1>

      {/* Search Box */}
      <div className="search-container">
        <div className="search-box">
          <div className="search-field">
            <MapPin className="search-icon" />
            <input
              type="text"
              placeholder="From (e.g. Delhi)"
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-field">
            <MapPin className="search-icon" />
            <input
              type="text"
              placeholder="To (e.g. Jaipur)"
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
              className="search-input"
            />
          </div>
          <Button className="search-button">
            <Search size={18} />
            Search
          </Button>
        </div>
      </div>

      {/* Travels List */}
      <div className="travels-list-container">
        {filteredTravels.length > 0 ? (
          <div className="travels-table">
            <div className="table-header">
              <div className="header-cell">Bus Image</div>
              <div className="header-cell">Route</div>
              <div className="header-cell">Departure</div>
              <div className="header-cell">Avalable Seats</div>
              <div className="header-cell">Price</div>
              <div className="header-cell">Action</div>
            </div>

            {filteredTravels.map((travel) => (
              <div key={travel.id} className="table-row">
                <div className="table-cell image-cell">
                  <img
                    src={travel.image}
                    alt={`Bus from ${travel.from_location} to ${travel.to_location}`}
                    className="bus-image"
                  />
                </div>
                <div className="table-cell route-cell">
                  <div className="route-info">
                    {travel.from_location} → {travel.to_location}
                  </div>
                </div>
                <div className="table-cell time-cell">
                  <Clock size={16} className="icon" />
                  <span>{travel.time}</span>
                </div>
                <div className="table-cell seats-cell">
                  <Users size={16} className="icon" />
                  <span>{travel.seats} seats</span>
                </div>
                <div className="table-cell price-cell">
                  <IndianRupee size={16} className="icon" />
                  <span>{travel.price}</span>
                </div>
                <div className="table-cell action-cell">
                  <div className="table-cell action-cell">
                    <Button
                      onClick={() => handleBookNow(travel)}
                      className="book-now-btn"
                      disabled={travel.seats <= 0}
                    >
                      {travel.seats <= 0 ? "Sold Out" : "Book Now"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No travels found matching your search criteria.</p>
            <Button variant="outline" onClick={() => { setSearchFrom(""); setSearchTo(""); }}>
              Clear Search
            </Button>
          </div>
        )}
      </div>

      {/* Modal for confirming seat selection */}
      {selectedTravel && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Confirm Your Ticket</h2>
              <Button variant="ghost" onClick={() => setSelectedTravel(null)}>
                X
              </Button>
            </div>

            <div className="modal-body">
              <img
                src={selectedTravel.image}
                alt="Bus Image"
                className="modal-bus-image"
              />
              <p className="modal-route">
                {selectedTravel.from_location} → {selectedTravel.to_location}
              </p>
              <p className="modal-price">
                Price per seat: ₹{selectedTravel.price}
              </p>

              <div className="seat-selection">
                <Button variant="outline" onClick={handleDecreaseSeats}>
                  <Minus size={16} />
                </Button>
                <span className="seat-count">{seats}</span>
                <Button variant="outline" onClick={handleIncreaseSeats}>
                  <Plus size={16} />
                </Button>
              </div>

              <p className="modal-total">
                Total: ₹{selectedTravel.price * seats}
              </p>

              <Button onClick={handleCheckout} className="confirm-booking-btn">
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookNowPage;
