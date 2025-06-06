"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { IndianRupee, Plus, Minus } from 'lucide-react';

const BookingModal = ({ travel, onClose, onConfirm }) => {
  const [seats, setSeats] = useState(1);
  const totalPrice = seats * travel.price;

  const handleSeatChange = (change) => {
    const newSeats = seats + change;
    if (newSeats >= 1 && newSeats <= travel.seats) {
      setSeats(newSeats);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Confirm Your Booking</h2>
        
        <div className="mb-4">
          <img src={travel.image} alt={`Bus from ${travel.from_location} to ${travel.to_location}`} className="w-full h-48 object-cover rounded" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Route:</span>
            <span>{travel.from_location} → {travel.to_location}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Departure Time:</span>
            <span>{travel.time}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Price per Seat:</span>
            <span className="flex items-center">
              <IndianRupee size={16} className="mr-1" />
              {travel.price}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Seats:</span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSeatChange(-1)}
                disabled={seats <= 1}
              >
                <Minus size={16} />
              </Button>
              <span>{seats}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSeatChange(1)}
                disabled={seats >= travel.seats}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total Price:</span>
            <span className="flex items-center">
              <IndianRupee size={18} className="mr-1" />
              {totalPrice}
            </span>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(seats, totalPrice)}>
            Book Ticket
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;