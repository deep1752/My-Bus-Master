"use client";

import React from "react";
import { Phone, Mail, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Support = () => {
  return (
    <div className="support-page">
      {/* Header Section */}
      <section className="support-header">
        <h1 className="support-title">Need Help?</h1>
        <p className="support-subtitle">
          We're here for you 24/7. Choose your preferred way to get support.
        </p>
      </section>

      {/* Support Options */}
      <section className="support-options-grid">
        <div className="support-card">
          <Phone className="support-icon phone-icon" size={40} />
          <h2 className="support-option-title">Phone Support</h2>
          <p className="support-option-text">Call us anytime at 1800-123-4567</p>
          <Button variant="outline" className="support-button">Call Now</Button>
        </div>

        <div className="support-card">
          <Mail className="support-icon email-icon" size={40} />
          <h2 className="support-option-title">Email Us</h2>
          <p className="support-option-text">Get a reply within 24 hours</p>
          <Button variant="outline" className="support-button">Send Email</Button>
        </div>

        <div className="support-card">
          <MessageSquare className="support-icon chat-icon" size={40} />
          <h2 className="support-option-title">Live Chat</h2>
          <p className="support-option-text">Chat with our agents in real-time</p>
          <Button variant="outline" className="support-button">Start Chat</Button>
        </div>

        <div className="support-card">
          <HelpCircle className="support-icon faq-icon" size={40} />
          <h2 className="support-option-title">FAQs</h2>
          <p className="support-option-text">Find answers to common questions</p>
          <Button variant="outline" className="support-button">View FAQs</Button>
        </div>
      </section>

      {/* Contact Form */}
      <section className="support-form-section">
        <h2 className="support-form-title">Or Send Us a Message</h2>
        <form className="support-form">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="support-input"
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="support-input"
          />
          <input 
            type="text" 
            placeholder="Phone Number" 
            className="support-input"
          />
          <input 
            type="text" 
            placeholder="Booking ID (Optional)" 
            className="support-input"
          />
          <textarea 
            placeholder="Your Message" 
            rows="5" 
            className="support-textarea"
          ></textarea>
          <Button type="submit" className="support-submit-button">
            Submit Request
          </Button>
        </form>
      </section>
    </div>
  );
};

export default Support;