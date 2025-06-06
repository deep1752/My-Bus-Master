import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <header className="privacy-header">
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-update">Last Updated: {new Date().toLocaleDateString()}</p>
      </header>

      <main className="privacy-content">
        <section className="privacy-section">
          <h2 className="privacy-section-title">1. Introduction</h2>
          <p className="privacy-text">
            Welcome to BusExpress ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our bus booking services.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">2. Information We Collect</h2>
          <p className="privacy-text">
            We may collect the following types of information when you use our services:
          </p>
          <ul className="privacy-list">
            <li className="privacy-list-item">Personal identification information (Name, email address, phone number)</li>
            <li className="privacy-list-item">Payment information (credit card details, billing address)</li>
            <li className="privacy-list-item">Travel details (booking history, preferred routes)</li>
            <li className="privacy-list-item">Device and usage information (IP address, browser type, pages visited)</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">3. How We Use Your Information</h2>
          <p className="privacy-text">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="privacy-list">
            <li className="privacy-list-item">To process and manage your bookings</li>
            <li className="privacy-list-item">To communicate with you about your trips</li>
            <li className="privacy-list-item">To improve our services and user experience</li>
            <li className="privacy-list-item">To prevent fraud and enhance security</li>
            <li className="privacy-list-item">To comply with legal obligations</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">4. Data Security</h2>
          <p className="privacy-text">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted using SSL technology.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">5. Your Rights</h2>
          <p className="privacy-text">
            You have certain rights regarding your personal information, including:
          </p>
          <ul className="privacy-list">
            <li className="privacy-list-item">The right to access and request copies of your data</li>
            <li className="privacy-list-item">The right to request correction of inaccurate information</li>
            <li className="privacy-list-item">The right to request deletion of your data</li>
            <li className="privacy-list-item">The right to object to certain processing activities</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">6. Contact Us</h2>
          <p className="privacy-text">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <address className="privacy-contact">
            SwiftBus Customer Support<br />
            Email: privacy@swiftbus.com<br />
            Phone: +1 (800) 123-4567<br />
            Address: 123 Transit Lane, Suite 100, Cityville, ST 12345
          </address>
        </section>
      </main>

      <footer className="privacy-footer">
        <p className="privacy-footer-text">© {new Date().getFullYear()} SwiftBus. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;