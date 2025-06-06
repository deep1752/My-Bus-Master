import React from 'react';
import Image from 'next/image';

import Link from "next/link";
import { GrFacebookOption, GrYoutube, GrInstagram } from 'react-icons/gr';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__logo">
          <Link href="/" className="navbar__logo">
            <span className="navbar__logo-text">BusExpress</span>
          </Link>
          <p className="footer__description">BusExpress is the world's largest online bus ticket booking service trusted by over 25 million happy customers globally. myBus offers bus ticket booking through its website, iOS and Android mobile apps for all major routes.</p>
          <div className="footer__social">
            <a href="https://www.facebook.com/ranveer.kumawat.716" target="_blank" rel="noopener noreferrer">
              <GrFacebookOption className="footer__social-icon" />
            </a>
            <a href="https://www.youtube.com/@neverseen-2805" target="_blank" rel="noopener noreferrer">
              <GrYoutube className="footer__social-icon" />
            </a>
            <a href="https://www.instagram.com/neverseen2805" target="_blank" rel="noopener noreferrer">
              <GrInstagram className="footer__social-icon" />
            </a>
          </div>
        </div>

        <div className="footer__section">
          <h3 className="footer__heading">Company</h3>
          <ul className="footer__links">
            <li><Link href="/about" className="footer__link">About</Link></li>
            <li><Link href="/footer/privacy" className="footer__link">Privacy Policy</Link></li>
            <li><Link href="/contact" className="footer__link">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer__section">
          <h3 className="footer__heading">Support</h3>
          <ul className="footer__links">
            <li><Link href="/footer/careers" className="footer__link">Support Career</Link></li>
            <li><Link href="/footer/support" className="footer__link">24h Service</Link></li>
            <li><Link href="/footer/chat" className="footer__link">Quick Chat</Link></li>
          </ul>
        </div>

        <div className="footer__section">
          <h3 className="footer__heading">Contact</h3>
          <ul className="footer__links">
            <li>
              <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer" className="footer__link">
                WhatsApp
              </a>
            </li>
            <li><Link href="/footer/support" className="footer__link">Support 24h</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;