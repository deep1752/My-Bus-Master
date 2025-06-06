"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Briefcase, Clock, DollarSign, HeartPulse, Globe, Shield, Mail } from "lucide-react";

const CareersPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: ""
  });

  const jobCategories = [
    { id: "all", name: "All Departments" },
    { id: "tech", name: "Technology" },
    { id: "operations", name: "Operations" },
    { id: "customer", name: "Customer Service" },
    { id: "marketing", name: "Marketing" },
  ];

  const jobOpenings = [
    {
      id: 1,
      title: "Frontend Developer",
      department: "tech",
      type: "Full-time",
      location: "Bangalore (Remote)",
      posted: "2 days ago",
      description: "Build user interfaces for our booking platform using React and Next.js."
    },
    {
      id: 2,
      title: "Bus Operations Manager",
      department: "operations",
      type: "Full-time",
      location: "Delhi",
      posted: "1 week ago",
      description: "Oversee daily bus operations and ensure schedule adherence."
    },
    {
      id: 3,
      title: "Customer Support Executive",
      department: "customer",
      type: "Full-time",
      location: "Mumbai (Hybrid)",
      posted: "3 days ago",
      description: "Assist customers with bookings and travel inquiries."
    },
    {
      id: 4,
      title: "Digital Marketing Specialist",
      department: "marketing",
      type: "Full-time",
      location: "Bangalore",
      posted: "1 day ago",
      description: "Develop and execute digital marketing campaigns."
    },
    {
      id: 5,
      title: "Backend Engineer",
      department: "tech",
      type: "Full-time",
      location: "Remote",
      posted: "5 days ago",
      description: "Develop and maintain our booking API and services."
    },
  ];

  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6 text-blue-600" />,
      title: "Competitive Salary",
      description: "Industry-standard compensation with regular reviews"
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-green-600" />,
      title: "Health Insurance",
      description: "Comprehensive medical coverage for you and family"
    },
    {
      icon: <Globe className="w-6 h-6 text-purple-600" />,
      title: "Flexible Work",
      description: "Remote/hybrid options for many positions"
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      title: "Paid Time Off",
      description: "Generous vacation and holiday policy"
    },
    {
      icon: <Briefcase className="w-6 h-6 text-yellow-600" />,
      title: "Career Growth",
      description: "Clear paths for professional development"
    },
    {
      icon: <Shield className="w-6 h-6 text-red-600" />,
      title: "Travel Benefits",
      description: "Discounts on all our bus services"
    },
  ];

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      resume: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the application to your backend
    console.log("Application submitted:", { job: selectedJob, ...formData });
    alert(`Application for ${selectedJob.title} submitted successfully!`);
    setShowApplicationForm(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      resume: null,
      coverLetter: ""
    });
  };

  const filteredJobs = activeTab === "all" 
    ? jobOpenings 
    : jobOpenings.filter(job => job.department === activeTab);

  
    return (
      <div className="careers-page">
        {/* Hero Section */}
        <section className="careers-hero">
          <h1 className="careers-title">Join Our <span className="text-blue-600">Team</span></h1>
          <p className="careers-subtitle">
            Help us revolutionize bus travel in India while growing your career in a dynamic environment.
          </p>
        </section>
  
        {/* Application Form Modal */}
        {showApplicationForm && selectedJob && (
          <div className="careers-modal">
            <div className="careers-modal-content">
              <div className="careers-modal-header">
                <h2 className="careers-modal-title">Apply for {selectedJob.title}</h2>
                <button 
                  onClick={() => setShowApplicationForm(false)}
                  className="careers-modal-close"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="careers-application-form">
                <div className="careers-form-grid">
                  <div className="careers-form-group">
                    <label className="careers-form-label">Full Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="careers-form-input"
                      required
                    />
                  </div>
                  {/* Repeat for other form fields */}
                </div>
                <div className="careers-form-footer">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowApplicationForm(false)}
                    className="careers-form-cancel"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="careers-form-submit">
                    <Mail className="mr-2 h-4 w-4" />
                    Submit Application
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
  
        {/* Why Join Us Section */}
        <section className="careers-benefits">
          <h2 className="careers-section-title">Why Work With Us</h2>
          <div className="careers-benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="careers-benefit-card">
                <div className="careers-benefit-header">
                  <div className="careers-benefit-icon">
                    {benefit.icon}
                  </div>
                  <h3 className="careers-benefit-title">{benefit.title}</h3>
                </div>
                <p className="careers-benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>
  
        {/* Job Openings Section */}
        <section className="careers-jobs">
          <div className="careers-jobs-header">
            <h2 className="careers-section-title">Current Openings</h2>
            <div className="careers-category-tabs">
              {jobCategories.map(category => (
                <Button
                  key={category.id}
                  variant={activeTab === category.id ? "default" : "outline"}
                  onClick={() => setActiveTab(category.id)}
                  className="careers-category-tab"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
  
          <div className="careers-jobs-list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div key={job.id} className="careers-job-card">
                  <div className="careers-job-header">
                    <div className="careers-job-info">
                      <h3 className="careers-job-title">{job.title}</h3>
                      <div className="careers-job-meta">
                        <span className="careers-job-type">{job.type}</span>
                        <span className="careers-job-location">{job.location}</span>
                        <span className="careers-job-posted">Posted {job.posted}</span>
                      </div>
                    </div>
                    <Button onClick={() => handleApplyClick(job)} className="careers-job-apply">
                      Apply Now
                    </Button>
                  </div>
                  <p className="careers-job-description">{job.description}</p>
                </div>
              ))
            ) : (
              <div className="careers-no-jobs">
                <p className="careers-no-jobs-text">No current openings in this department. Please check back later.</p>
              </div>
            )}
          </div>
        </section>
  
        {/* Culture Section */}
        <section className="careers-culture">
          <div className="careers-culture-content">
            <div className="careers-culture-image">
              <img 
                src="/images/team-culture.jpg" 
                alt="Our team culture" 
                className="careers-culture-img"
              />
            </div>
            <div className="careers-culture-text">
              <h2 className="careers-section-title">Our Culture</h2>
              <p className="careers-culture-paragraph">
                At BusExpress, we believe our people are our greatest asset...
              </p>
              <Button variant="outline" className="careers-culture-button">
                Learn About Our Values
              </Button>
            </div>
          </div>
        </section>
  
        {/* CTA Section */}
        <section className="careers-cta">
          <h2 className="careers-cta-title">Don't See Your Dream Role?</h2>
          <p className="careers-cta-text">
            We're always looking for talented individuals...
          </p>
          <Button variant="secondary" className="careers-cta-button">
            <Mail className="mr-2 h-4 w-4" />
            Submit General Application
          </Button>
        </section>
      </div>
    );
  };
  
  export default CareersPage;