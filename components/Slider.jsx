"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/busSlider1.jpg",
      title: "Luxury Bus Travel",
      facilities: ["Free WiFi", "Comfy Seats", "Charging Ports", "AC"],
      description: "Experience premium comfort on your journey"
    },
    {
      image: "/busSlider2.jpg",
      title: "Affordable Travel",
      facilities: ["Economy Pricing", "On-time Service", "Safe Travel", "Clean Buses"],
      description: "Quality travel that fits your budget"
    },
    {
      image: "/busSlider3.jpg",
      title: "City to City",
      facilities: ["Multiple Routes", "Frequent Departures", "Online Booking", "24/7 Support"],
      description: "Connecting major cities across the country"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className="slide">
            <div className="slide-image-container">
              <img
                src={slide.image}
                alt={slide.title}
                className="slide-image"
              />
              <div className="slide-overlay"></div>
            </div>
            <div className="slide-content">
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-description">{slide.description}</p>

              <div className="facilities-container">
                {slide.facilities.map((facility, i) => (
                  <span key={i} className="facility-badge">{facility}</span>
                ))}
              </div>

              <Link href="/bookNow">
                <Button className="primary-cta">Book Now</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button onClick={prevSlide} className="slider-nav-btn prev-btn">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="slider-nav-btn next-btn">
        <ChevronRight size={24} />
      </button>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;