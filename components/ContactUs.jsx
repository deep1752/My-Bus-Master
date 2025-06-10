"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });
  
      if (response.ok) {
        toast.success("Your message has been sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
      } else {
        toast.error("Failed to send message. Please try again!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again later!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-container max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="contact-form bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Send us a message</h2>
          <form onSubmit={handleSubmit} className={isSubmitting ? "form-submitting" : ""}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 form-input"
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 form-input"
                required
                placeholder="Enter your email address"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 form-input"
                placeholder="Enter your phone number (optional)"
              />
            </div>
            
            <div className="mb-8">
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700">
                Your Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 form-input"
                required
                placeholder="Type your message here..."
              ></textarea>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 text-lg font-medium transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>
        
        {/* Contact Information */}
        <div className="contact-info bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">Our Information</h2>
          
          <div className="space-y-8">
            <div className="flex items-start info-item">
              <div className="bg-blue-100 p-3 rounded-full mr-4 icon-container">
                <Mail className="text-blue-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-800 mb-1">Email</h3>
                <p className="text-gray-600 hover:text-blue-600 transition-colors">support@busbooking.com</p>
                <p className="text-gray-600 hover:text-blue-600 transition-colors">bookings@busbooking.com</p>
              </div>
            </div>
            
            <div className="flex items-start info-item">
              <div className="bg-green-100 p-3 rounded-full mr-4 icon-container">
                <Phone className="text-green-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-800 mb-1">Phone</h3>
                <p className="text-gray-600 hover:text-green-600 transition-colors">+91 98765 43210 (Customer Care)</p>
                <p className="text-gray-600 hover:text-green-600 transition-colors">+91 12345 67890 (Bookings)</p>
              </div>
            </div>
            
            <div className="flex items-start info-item">
              <div className="bg-orange-100 p-3 rounded-full mr-4 icon-container">
                <MapPin className="text-orange-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-800 mb-1">Head Office</h3>
                <p className="text-gray-600 hover:text-orange-600 transition-colors">123 Bus Plaza, MG Road</p>
                <p className="text-gray-600 hover:text-orange-600 transition-colors">Bangalore, Karnataka - 560001</p>
              </div>
            </div>
            
            <div className="flex items-start info-item">
              <div className="bg-purple-100 p-3 rounded-full mr-4 icon-container">
                <Clock className="text-purple-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-800 mb-1">Working Hours</h3>
                <p className="text-gray-600">Monday - Friday: 8:00 AM - 8:00 PM</p>
                <p className="text-gray-600">Saturday - Sunday: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="font-medium text-lg mb-4 text-gray-800">Follow Us</h3>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="social-button w-12 h-12">
                <FontAwesomeIcon icon={faFacebookF} className="text-blue-600 text-lg" />
              </Button>
              <Button variant="outline" size="icon" className="social-button w-12 h-12">
                <FontAwesomeIcon icon={faTwitter} className="text-blue-400 text-lg" />
              </Button>
              <Button variant="outline" size="icon" className="social-button w-12 h-12">
                <FontAwesomeIcon icon={faInstagram} className="text-pink-600 text-lg" />
              </Button>
              <Button variant="outline" size="icon" className="social-button w-12 h-12">
                <FontAwesomeIcon icon={faLinkedinIn} className="text-blue-700 text-lg" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Smaller Map Section */}
      <div className="mt-16 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Find Us on Map</h2>
        <div className="map-container aspect-w-16 aspect-h-9 bg-gray-200 rounded-xl overflow-hidden h-64">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.003073604687!2d77.59451431482196!3d12.97196299085611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf5df53c1045041b5!2sMG%20Road%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;