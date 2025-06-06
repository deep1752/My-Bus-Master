"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, X, User, HelpCircle, Clock } from "lucide-react";

class ChatMessage {
  constructor(text, sender, timestamp, isSystem = false) {
    this.text = text;
    this.sender = sender;
    this.timestamp = timestamp;
    this.isSystem = isSystem;
  }
}

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState('online'); // 'online', 'offline', 'away'
  const messagesEndRef = useRef(null);

  // Sample FAQs
  const faqs = [
    "How do I cancel my booking?",
    "Where can I find my ticket?",
    "What's your refund policy?",
    "How to change travel date?",
    "Is there a customer care number?"
  ];

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = new ChatMessage(
      "Hello! I'm your BusExpress assistant. How can I help you today?",
      "system",
      new Date(),
      true
    );
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = new ChatMessage(newMessage, "user", new Date());
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate bot response after delay
    setTimeout(() => {
      const botResponse = generateBotResponse(newMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const generateBotResponse = (userMessage) => {
    const responses = {
      "cancel": "You can cancel your booking through 'My Trips' section in your account. Cancellation charges may apply depending on timing.",
      "ticket": "Your e-ticket is available in 'My Trips' section. We've also sent it to your registered email.",
      "refund": "Refunds are processed within 7 working days. The amount depends on cancellation time before departure.",
      "change": "Date changes can be made up to 4 hours before departure, subject to availability and fare difference.",
      "contact": "Our 24/7 customer care number is +91 98765 43210. You can also email us at support@busexpress.com"
    };

    const lowerMsg = userMessage.toLowerCase();
    let responseText = "";

    if (lowerMsg.includes("cancel")) {
      responseText = responses["cancel"];
    } else if (lowerMsg.includes("ticket") || lowerMsg.includes("booking")) {
      responseText = responses["ticket"];
    } else if (lowerMsg.includes("refund")) {
      responseText = responses["refund"];
    } else if (lowerMsg.includes("change") || lowerMsg.includes("date")) {
      responseText = responses["change"];
    } else if (lowerMsg.includes("contact") || lowerMsg.includes("number")) {
      responseText = responses["contact"];
    } else {
      responseText = "I can help with bookings, cancellations, refunds, and general inquiries. Could you please be more specific?";
    }

    return new ChatMessage(responseText, "system", new Date());
  };

  const handleFAQClick = (faq) => {
    setNewMessage(faq);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`chat-container ${isChatOpen ? 'chat-open' : ''}`}>
      {/* Chat Toggle Button */}
      <button 
        className="chat-toggle-button"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        {isChatOpen ? (
          <X className="chat-toggle-icon" />
        ) : (
          <MessageSquare className="chat-toggle-icon" />
        )}
        <span className="chat-toggle-text">
          {isChatOpen ? 'Close' : 'Chat Support'}
        </span>
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="chat-window">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-content">
              <HelpCircle className="chat-header-icon" />
              <div>
                <h3 className="chat-header-title">BusExpress Support</h3>
                <div className="chat-status">
                  <span className={`status-indicator status-${chatStatus}`}></span>
                  <span className="status-text">
                    {chatStatus === 'online' ? 'Online' : 
                     chatStatus === 'away' ? 'Away' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            <button 
              className="chat-close-button"
              onClick={() => setIsChatOpen(false)}
            >
              <X className="chat-close-icon" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'system-message'}`}
              >
                {message.sender === 'system' && (
                  <div className="message-avatar">
                    <HelpCircle className="avatar-icon" />
                  </div>
                )}
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    <Clock className="time-icon" />
                    {formatTime(message.timestamp)}
                  </div>
                </div>
                {message.sender === 'user' && (
                  <div className="message-avatar">
                    <User className="avatar-icon" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="message system-message">
                <div className="message-avatar">
                  <HelpCircle className="avatar-icon" />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQs */}
          <div className="chat-faqs">
            <h4 className="faq-title">Quick Questions:</h4>
            <div className="faq-buttons">
              {faqs.map((faq, index) => (
                <button
                  key={index}
                  className="faq-button"
                  onClick={() => handleFAQClick(faq)}
                >
                  {faq}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="chat-input"
              disabled={chatStatus === 'offline'}
            />
            <Button 
              type="submit" 
              className="send-button"
              disabled={!newMessage.trim() || chatStatus === 'offline'}
            >
              <Send className="send-icon" />
            </Button>
          </form>

          {/* Offline Notice */}
          {chatStatus === 'offline' && (
            <div className="offline-notice">
              Our chat support is currently offline. Please try again later or call our 24/7 support at +91 98765 43210.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatPage;