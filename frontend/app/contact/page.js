"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChevronDown,
  Search,
  ArrowRight
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
    vehicle: {
      year: '',
      make: '',
      model: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const [openFaq, setOpenFaq] = useState(null);

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6 text-white" />,
      title: 'Phone Support',
      description: 'Speak with our parts experts',
      details: '+1 (555) 123-4567',
      subDetails: 'Mon-Fri: 8AM-8PM EST',
      color: 'from-slate-800 to-slate-900'
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      title: 'Live Chat',
      description: 'Get instant help online',
      details: 'Chat with us now',
      subDetails: 'Available 24/7',
      color: 'from-slate-700 to-slate-800'
    },
    {
      icon: <Mail className="w-6 h-6 text-white" />,
      title: 'Email Support',
      description: 'Send us a detailed message',
      details: 'support@autopartspro.com',
      subDetails: 'Response within 24 hours',
      color: 'from-slate-800 to-slate-900'
    },
    {
      icon: <MapPin className="w-6 h-6 text-white" />,
      title: 'Visit Our Store',
      description: 'Come see us in person',
      details: '123 Auto Parts Blvd',
      subDetails: 'Detroit, MI 48201',
      color: 'from-slate-700 to-slate-800'
    }
  ];

  const faqs = [
    {
      question: 'How do I find the right part for my vehicle?',
      answer: 'Use our vehicle compatibility checker on each product page, or contact our experts who can help you identify the correct part using your VIN number.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy on most items. Parts must be in original condition and packaging. Installation services may have different terms.'
    },
    {
      question: 'Do you offer installation services?',
      answer: 'Yes! We have certified technicians and partner with local garages. Contact us for installation quotes and to schedule service.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping is 3-5 business days. Express shipping (1-2 days) is available. Free shipping on orders over $100.'
    },
    {
      question: 'Do you provide warranties on parts?',
      answer: 'All parts come with manufacturer warranties. We also offer extended warranty options for additional peace of mind.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('vehicle.')) {
      const vehicleField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          [vehicleField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'general',
          message: '',
          vehicle: { year: '', make: '', model: '' }
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AutoParts Pro</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Products
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Cart
              </Link>
              <Link href="/contact" className="text-blue-600 font-medium">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Contact Us</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our automotive experts are here to help you find the perfect parts for your vehicle. 
            Reach out through any of our convenient contact methods.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {method.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{method.title}</h3>
              <p className="text-gray-600 mb-3 text-center text-sm">{method.description}</p>
              <p className="text-blue-600 font-semibold text-center">{method.details}</p>
              <p className="text-gray-500 text-sm text-center">{method.subDetails}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'contact'
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Contact Form
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'faq'
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab('location')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'location'
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Location
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'contact' && (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-slate-900 p-8 text-white text-center">
                <h2 className="text-3xl font-bold mb-2">Send Us a Message</h2>
                <p className="text-slate-300">We'll get back to you within 24 hours</p>
              </div>
              
              <div className="p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for contacting us. We&apos;ll respond within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="parts">Parts Question</option>
                          <option value="warranty">Warranty Claim</option>
                          <option value="installation">Installation Help</option>
                          <option value="return">Return/Exchange</option>
                          <option value="wholesale">Wholesale Inquiry</option>
                        </select>
                      </div>
                    </div>

                    {/* Vehicle Information */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Information (Optional)</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          name="vehicle.year"
                          value={formData.vehicle.year}
                          onChange={handleInputChange}
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                          placeholder="Year (e.g., 2020)"
                        />
                        <input
                          type="text"
                          name="vehicle.make"
                          value={formData.vehicle.make}
                          onChange={handleInputChange}
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                          placeholder="Make (e.g., Honda)"
                        />
                        <input
                          type="text"
                          name="vehicle.model"
                          value={formData.vehicle.model}
                          onChange={handleInputChange}
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                          placeholder="Model (e.g., Accord)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all resize-none"
                        placeholder="Please describe how we can help you..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Message...
                        </div>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-slate-900 p-8 text-white text-center">
                <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
                <p className="text-slate-300">Find quick answers to common questions</p>
              </div>
              
              <div className="p-8">
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                          <ChevronDown 
                            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                              openFaq === index ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>
                      {openFaq === index && (
                        <div className="px-6 py-4 bg-white border-t border-gray-200">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-slate-900 p-8 text-white text-center">
                <h2 className="text-3xl font-bold mb-2">Visit Our Store</h2>
                <p className="text-slate-300">Come see our parts in person</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Store Information</h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                          <p className="text-gray-600">XYZ road<br />Delhi, India</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Store Hours</h4>
                          <div className="text-gray-600 space-y-1">
                            <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                            <p>Saturday: 9:00 AM - 6:00 PM</p>
                            <p>Sunday: 10:00 AM - 4:00 PM</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                          <p className="text-gray-600">+1 (555) 123-4567</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="font-semibold text-gray-900 mb-4">Services Available</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-600">Professional Installation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-600">Part Compatibility Check</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-600">Free Consultation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-600">Warranty Support</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Location Map</h3>
                    <div className="bg-gradient-to-br from-gray-200 to-gray-400 rounded-xl h-80 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-600">Interactive Map</p>
                        <p className="text-sm text-gray-500">123 Auto Parts Blvd, Detroit, MI</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="mt-16 bg-slate-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Need Immediate Help?</h2>
          <p className="mb-6 text-slate-300">For urgent parts requests or roadside assistance</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+15551234567"
              className="bg-white text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-slate-100 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Emergency Hotline</span>
            </a>
            <button className="bg-slate-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-700 transition-all transform hover:scale-105 flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Live Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}