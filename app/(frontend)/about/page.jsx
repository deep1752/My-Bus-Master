"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Bus, ShieldCheck, Clock, Users, MapPin, Star, Ticket } from "lucide-react";

import { useRouter } from 'next/navigation';
const AboutUs = () => {

  const router = useRouter();

  const handleBookNow = () => {
    router.push('/bookNow'); // Redirect to book now page
  };

  const handleContact = () => {
    router.push('/contact'); // Redirect to contact us page
  };


  const stats = [
    { value: "10,000+", label: "Daily Bookings" },
    { value: "500+", label: "Buses in Fleet" },
    { value: "100+", label: "Routes Covered" },
    { value: "24/7", label: "Customer Support" },
  ];

  const features = [
    {
      icon: <ShieldCheck className="feature-icon text-blue-600" />,
      title: "Safe Travel",
      description: "All our buses are equipped with safety features and regularly maintained."
    },
    {
      icon: <Clock className="feature-icon text-green-600" />,
      title: "On Time",
      description: "90% of our buses arrive within 15 minutes of scheduled time."
    },
    {
      icon: <Ticket className="feature-icon text-purple-600" />,
      title: "Easy Booking",
      description: "Book tickets in just 3 clicks with our user-friendly platform."
    },
    {
      icon: <Star className="feature-icon text-yellow-600" />,
      title: "Premium Service",
      description: "Enjoy premium amenities on select routes at affordable prices."
    },
  ];

  const team = [
    {
      name: "Rahul Sharma",
      role: "Founder & CEO",
      bio: "Transport industry veteran with 15+ years experience."
    },
    {
      name: "Priya Patel",
      role: "Operations Head",
      bio: "Ensures smooth functioning of all bus operations."
    },
    {
      name: "Amit Singh",
      role: "Customer Experience",
      bio: "Leads our 24/7 customer support team."
    },
  ];

  return (
    <div className="about-page max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="about-hero text-center mb-16">
        <h1 className="about-title">About <span className="text-blue-600">BusExpress</span></h1>
        <p className="about-subtitle">
          Revolutionizing bus travel in India with technology, comfort, and reliability since 2015.
        </p>
      </section>

      {/* Stats Section */}
      <section className="about-stats grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Our Story */}
      <section className="about-story mb-16">
        <div className="story-container">
          <div className="story-image-container">
            <img
              src="https://en.yutong.com/res/template/en2023/resource/images/sy_img15.webp"
              alt="Our buses"
              className="story-image"
            />
          </div>


          <div className="story-content">
            <h2 className="section-title">Our Story</h2>
            <p className="story-text">
              Founded in 2015, BusExpress began with a simple mission: to make bus travel in India more comfortable,
              reliable, and accessible. What started as a fleet of 10 buses has now grown to become one of the most
              trusted names in intercity bus transportation.
            </p>
            <p className="story-text">
              We leverage cutting-edge technology to optimize routes, maintain schedules, and provide real-time
              tracking to our customers. Our commitment to safety and customer satisfaction has earned us the
              "Best Bus Service Provider" award three years in a row.
            </p>
            <Button variant="outline" className="story-button">Learn More About Our Journey</Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="about-features mb-16">
        <h2 className="section-title text-center mb-8">Why Choose Us</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-container">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Fleet */}
      <section className="about-fleet mb-16">
        <h2 className="section-title text-center mb-8">Our Fleet</h2>
        <div className="fleet-container">
          <div className="fleet-card">
            <h3 className="fleet-card-title">
              <Bus className="fleet-icon text-blue-600" /> Standard
            </h3>
            <ul className="fleet-features">
              <li>Push-back seats</li>
              <li>AC/Non-AC options</li>
              <li>Onboard charging</li>
              <li>Affordable fares</li>
            </ul>
          </div>
          <div className="fleet-card">
            <h3 className="fleet-card-title">
              <Bus className="fleet-icon text-green-600" /> Premium
            </h3>
            <ul className="fleet-features">
              <li>Recliner seats</li>
              <li>AC with individual vents</li>
              <li>Entertainment screens</li>
              <li>Complimentary water</li>
            </ul>
          </div>
          <div className="fleet-card">
            <h3 className="fleet-card-title">
              <Bus className="fleet-icon text-purple-600" /> Luxury
            </h3>
            <ul className="fleet-features">
              <li>Sleeper berths</li>
              <li>Premium AC</li>
              <li>Onboard WiFi</li>
              <li>Blanket & pillow</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team mb-16">
        <h2 className="section-title text-center mb-8">Meet Our Team</h2>
        <div className="team-grid">
          {team.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-member-image">
                <img
                  src={`/images/team-${index + 1}.jpg`}
                  alt={member.name}
                  className="member-image"
                />
              </div>
              <h3 className="team-member-name">{member.name}</h3>
              <p className="team-member-role">{member.role}</p>
              <p className="team-member-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <h2 className="cta-title">Ready to Travel With Us?</h2>
        <p className="cta-subtitle">
          Join millions of satisfied customers who choose BusExpress for their travel needs.
        </p>
        <div className="cta-buttons">
          <Button variant="secondary" onClick={handleBookNow}>
            Book Your Ticket Now
          </Button>
          <Button variant="outline" className="cta-outline-button" onClick={handleContact}>
            Contact Our Team
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;