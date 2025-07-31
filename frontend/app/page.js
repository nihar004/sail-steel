"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search, 
  Menu, 
  UserCircle2,
  LogIn,
  ShoppingBag,
  PhoneCall,
  ChevronDown,
  Check, 
  Building2, 
  Star, 
  Users,
  ChevronRight
} from 'lucide-react';
import Footer from "./components/Footer";
import Header from './components/Header';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Premium Steel Products",
      subtitle: "Direct from India's leading steel manufacturer",
      image: "/home-hero/steel_production.jpg",
      cta: "Explore Products"
    },
    {
      title: "Industrial Grade Quality",
      subtitle: "Trusted by contractors and builders nationwide",
      image: "/home-hero/steel_construction.jpg",
      cta: "Get Quote"
    },
    {
      title: "Direct Factory Pricing",
      subtitle: "Cut out middlemen, save on every order",
      image: "/home-hero/steel_warehouse.jpg",
      cta: "Shop Now"
    }
  ];

  // Steel categories mapping
  const categories = [
    {
      name: "Structural Steel",
      image: "/structural_steel.jpg",
      count: "500+ products",
      description: "I-beams, H-beams, channels, and angles for construction",
      slug: "structural-steel"
    },
    {
      name: "Steel Sheets & Plates",
      image: "/steel_sheets.jpg", 
      count: "300+ products",
      description: "Hot rolled, cold rolled, and galvanized sheets",
      slug: "sheets-plates"
    },
    {
      name: "Steel Bars & Rods",
      image: "/steel_bars.jpg",
      count: "250+ products", 
      description: "TMT bars, round bars, and reinforcement steel",
      slug: "bars-rods"
    },
    {
      name: "Steel Pipes & Tubes",
      image: "/steel_pipes.jpg",
      count: "400+ products",
      description: "ERW pipes, seamless tubes, and hollow sections",
      slug: "pipes-tubes"
    },
    {
      name: "Wire & Wire Products",
      image: "/steel_wire.jpg",
      count: "150+ products",
      description: "Binding wire, mesh, and specialty wire products",
      slug: "wire-products"
    },
    {
      name: "Specialty Steel",
      image: "/specialty_steel.jpg",
      count: "200+ products",
      description: "Stainless steel, alloy steel, and custom grades",
      slug: "specialty-steel"
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "TMT Steel Bars - Fe 500D Grade",
      price: "₹52,000",
      originalPrice: "₹55,000",
      image: "/images/categories/accessories.avif",
      rating: 4.8,
      reviews: 245,
      brand: "SAIL",
      inStock: true,
      specifications: "12mm dia, 12m length"
    },
    {
      id: 2,
      name: "Galvanized Steel Sheets",
      price: "₹68,500",
      originalPrice: "₹72,000",
      image: "/images/categories/body.jpg",
      rating: 4.7,
      reviews: 189,
      brand: "SAIL",
      inStock: true,
      specifications: "1.2mm thick, 4x8 ft"
    },
    {
      id: 3,
      name: "MS I-Beam ISMB 200",
      price: "₹45,800",
      originalPrice: "₹48,500",
      image: "/images/categories/brake-system.webp",
      rating: 4.9,
      reviews: 156,
      brand: "SAIL",
      inStock: true,
      specifications: "200mm height, 6m length"
    },
    {
      id: 4,
      name: "ERW Steel Pipes",
      price: "₹38,200",
      originalPrice: "₹41,000",
      image: "/images/categories/engine-parts.jpg",
      rating: 4.6,
      reviews: 203,
      brand: "SAIL",
      inStock: true,
      specifications: "100mm dia, 6m length"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        {heroSlides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: 'scale(1.05)',
            }}
          ></div>
        ))}
        
        <div className="relative z-20 text-center text-white max-w-5xl mx-auto px-4 flex flex-col h-full justify-center">
          <div className="bg-orange-600/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block mb-6 self-center">
            <span className="text-orange-200 font-medium">Trusted by Industry Leaders Since 1954</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                {heroSlides[currentSlide].cta}
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                Request Bulk Quote
              </button>
            </div>
          </div>

          {/* Trust indicators - Now fixed at bottom */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/80 mb-16">
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-400" />
              ISI Certified
            </div>
            <div className="flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-green-400" />
              Government Backed
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-green-400" />
              70+ Years Experience
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-400" />
              50,000+ Customers
            </div>
          </div>
        </div>

        {/* Hero Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section - Simplified */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Product Range</h2>
            <p className="mt-4 text-lg text-gray-600">
              Complete range of steel products for construction and manufacturing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link 
                href={`/products?category=${category.slug}`}
                key={index}
                className="group bg-white rounded-lg border border-gray-200 hover:border-orange-500 transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9 relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/75 to-transparent"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-sm text-orange-600 font-medium">
                      {category.count}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-sm text-orange-600 font-medium">
                    View Products
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/products" 
              className="inline-flex items-center px-6 py-3 border-2 border-orange-600 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-colors"
            >
              View All Products
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-orange-100 text-orange-600 text-sm font-medium px-4 py-2 rounded-full inline-block mb-4">
              Best Sellers
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Steel Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Top-quality steel products trusted by contractors and builders nationwide
            </p>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {featuredProducts.map((product) => (
    <div
      key={product.id}
      className="group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-100/50 hover:border-gray-200 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1"
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50">
        <div className="aspect-square relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Floating badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
            Factory Direct
          </div>
        </div>
        
        <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium shadow-md">
            ISI Certified
          </div>
        </div>

        {/* Quick action buttons - appear on hover */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="p-5">
        {/* Brand */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full tracking-wide uppercase">
            {product.brand}
          </span>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium text-gray-600">{product.rating}</span>
          </div>
        </div>
        
        {/* Product Name */}
        <h3 className="font-bold text-gray-900 mb-2 leading-tight group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Specifications */}
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {product.specifications}
        </p>
        
        {/* Reviews */}
        <div className="flex items-center mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-2">({product.reviews})</span>
        </div>
        
        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
            {product.price}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {product.originalPrice}
          </span>
          <div className="ml-auto">
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Save {Math.round(((parseFloat(product.originalPrice.replace('₹', '').replace(',', '')) - parseFloat(product.price.replace('₹', '').replace(',', ''))) / parseFloat(product.originalPrice.replace('₹', '').replace(',', ''))) * 100)}%
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          <button className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white py-3 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-95">
            Add to Cart
          </button>
          <button className="w-full border border-gray-200 text-gray-700 py-2.5 rounded-2xl font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
            Get Bulk Quote
          </button>
        </div>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-600/5 via-red-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  ))}
</div>
        </div>
      </section>

      {/* Why Choose SAIL Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-orange-100 text-orange-600 text-sm font-medium px-4 py-2 rounded-full inline-block mb-4">
              Why Choose SAIL
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">India&lsquo;s Most Trusted Steel Brand</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              With over 70 years of excellence, SAIL has been the backbone of India&lsquo;s infrastructure development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">ISI Certified Quality</h3>
              <p className="text-gray-600">All products meet stringent ISI standards and international quality benchmarks</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Direct from Factory</h3>
              <p className="text-gray-600">Eliminate middlemen costs with direct factory pricing and faster delivery</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Nationwide Network</h3>
              <p className="text-gray-600">Pan-India delivery network with technical support from steel experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-slate-900 text-white relative">
        {/* Fixed Background Image */}
        <div 
          className="absolute inset-0 bg-fixed bg-center bg-cover bg-no-repeat z-0" 
          style={{
            backgroundImage: 'url("/steel-warehouse.jpg")',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-slate-900/80"></div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl">
              <div className="text-5xl font-bold text-orange-400 mb-2">70+</div>
              <div className="text-gray-200">Years of Excellence</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl">
              <div className="text-5xl font-bold text-orange-400 mb-2">13.5</div>
              <div className="text-gray-200">Million Tonnes Capacity</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl">
              <div className="text-5xl font-bold text-orange-400 mb-2">5</div>
              <div className="text-gray-200">Integrated Steel Plants</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl">
              <div className="text-5xl font-bold text-orange-400 mb-2">50K+</div>
              <div className="text-gray-200">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-slate-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <span className="bg-orange-500/10 text-orange-400 text-sm font-medium px-4 py-2 rounded-full inline-block mb-6">
              Stay Updated
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Get Industry Insights & Exclusive Deals
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
              Subscribe for steel market updates, technical guides, and special pricing for bulk orders.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your business email"
                  className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              <button className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 active:scale-100">
                Subscribe
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex items-center justify-center gap-x-6 text-sm text-slate-400">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                100% Secure
              </div>
              <div className="w-px h-4 bg-slate-700"></div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No Spam
              </div>
              <div className="w-px h-4 bg-slate-700"></div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Unsubscribe Anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}