"use client";
import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tag, Clock, Users, Ticket, Shield, Gift } from 'lucide-react';

const Offers = () => {
    const offers = [
        {
            id: 1,
            title: "Flash Sale",
            discount: "20% OFF",
            description: "Limited time offer on select routes",
            icon: <Tag className="offer-icon-style" />,
            tag: "Popular",
            expiry: "Ends tomorrow"
        },
        {
            id: 2,
            title: "Advance Booking",
            discount: "15% OFF",
            description: "Book 30+ days in advance",
            icon: <Clock className="offer-icon-style" />,
            tag: "Early Bird",
            expiry: "Valid until Dec 31"
        },
        {
            id: 3,
            title: "Group Discount",
            discount: "25% OFF",
            description: "For 5+ passengers traveling together",
            icon: <Users className="offer-icon-style" />,
            tag: "Group",
            expiry: "Ongoing"
        },
        {
            id: 4,
            title: "Weekend Special",
            discount: "10% OFF",
            description: "Every Friday to Sunday",
            icon: <Ticket className="offer-icon-style" />,
            tag: "Weekly",
            expiry: "Every weekend"
        },
        {
            id: 5,
            title: "Safety Plus",
            discount: "12% OFF",
            description: "With travel insurance purchase",
            icon: <Shield className="offer-icon-style" />,
            tag: "Safety",
            expiry: "Year-round"
        },
        {
            id: 6,
            title: "Festive Bonanza",
            discount: "18% OFF",
            description: "Special holiday season discounts",
            icon: <Gift className="offer-icon-style" />,
            tag: "Seasonal",
            expiry: "Till Jan 15"
        }
    ];

    return (
        <div className="new-offers-container">
            {/* Hero Section */}
            <div className="offers-hero">
                <div className="hero-content">
                    <h1 className="hero-title">Exclusive Travel Deals</h1>
                    <p className="hero-subtitle">Unlock special savings on your next bus journey</p>
                    <div className="hero-badge">Limited Time Offers</div>
                </div>
            </div>

            {/* Offers Grid */}
            <div className="offers-main">
                <h2 className="section-title">Current Promotions</h2>
                <p className="section-description">Book now and save on your travels</p>

                <div className="offers-masonry">
                    {offers.map((offer) => (
                        <div key={offer.id} className={`offer-tile ${offer.tag.toLowerCase()}`}>
                            <div className="offer-header">
                                <div className="offer-icon-circle">
                                    {offer.icon}
                                </div>
                                <span className="offer-tag">{offer.tag}</span>
                            </div>

                            <div className="offer-body">
                                <h3 className="offer-name">{offer.title}</h3>
                                <div className="offer-discount">{offer.discount}</div>
                                <p className="offer-desc">{offer.description}</p>
                            </div>

                            <div className="offer-footer">
                                <span className="offer-expiry">{offer.expiry}</span>
                                <Link href="/bookNow">
                                    <Button className="primary-cta">Book Now</Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="offers-bottom-cta">
                <h3 className="cta-heading">More discounts coming soon!</h3>

                {/* <div className="cta-actions">
                    <Link href="/bookNow">
                        <Button className="primary-cta">Book Now</Button>
                    </Link>
                </div> */}
            </div>
        </div>
    );
};

export default Offers;