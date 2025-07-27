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
  Mail,
  Info,
  CheckCircle,
  Twitter,
  Linkedin,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// import dummyData from './data/dummy_data.json';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

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
      image: "/tmt_bars.jpg",
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
      image: "/galvanized_sheets.jpg",
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
      image: "/i_beam.jpg",
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
      image: "/erw_pipes.jpg",
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

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        scrollY > 100 ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'
      }`}>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-10 bg-gradient-to-r from-orange-600 to-red-700 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">SAIL</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">SAIL Steel</span>
                <span className="text-xs text-gray-600">Ministry of Steel, Govt. of India</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Home
              </Link>
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-orange-600 font-medium transition-colors">
                  Products
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                <div className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                  {categories.map((category, index) => (
                    <Link 
                      key={index}
                      href={`/products?category=${category.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/bulk-orders" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Bulk Orders
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                About SAIL
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-6">
              {/* Search */}
              <div className="hidden lg:block relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>

              {/* Cart */}
              <Link 
                href="/cart" 
                className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </Link>

              {/* Auth buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <button 
                  onClick={() => router.push('/auth?mode=login')} 
                  className="flex items-center text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <LogIn className="w-5 h-5 mr-1" />
                  Login
                </button>
                <button 
                  onClick={() => router.push('/auth?mode=signup')}
                  className="bg-gradient-to-r from-orange-600 to-red-700 text-white px-6 py-2 
                    rounded-full hover:from-orange-700 hover:to-red-800 transition-all transform 
                    hover:scale-105 font-medium"
                >
                  Sign Up
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-orange-600"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-1">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-orange-600">
                Home
              </Link>
              <Link href="/products" className="block px-3 py-2 text-gray-700 hover:text-orange-600">
                Products
              </Link>
              <Link href="/bulk-orders" className="block px-3 py-2 text-gray-700 hover:text-orange-600">
                Bulk Orders
              </Link>
              <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-orange-600">
                About SAIL
              </Link>
              <div className="pt-4 border-t">
                <button 
                  onClick={() => router.push('/auth?mode=login')}
                  className="w-full mb-2 flex items-center justify-center text-gray-700 
                    hover:text-orange-600 transition-colors"
                >
                  <LogIn className="w-5 h-5 mr-1" />
                  Login
                </button>
                <button 
                  onClick={() => router.push('/auth?mode=signup')}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-700 text-white 
                    px-6 py-2 rounded-full hover:from-orange-700 hover:to-red-800 transition-all"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold transform -rotate-3 shadow-lg">
                      Factory Direct
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">
                      ISI Certified
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-sm text-orange-600 font-medium mb-2">{product.brand}</p>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{product.specifications}</p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-700 bg-clip-text text-transparent">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full bg-gradient-to-r from-orange-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-800 transition-all transform hover:scale-105 group-hover:shadow-lg">
                      Add to Cart
                    </button>
                    <button className="w-full border border-orange-600 text-orange-600 py-2 rounded-xl font-medium hover:bg-orange-50 transition-all">
                      Get Bulk Quote
                    </button>
                  </div>
                </div>
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
      <section className="py-24 bg-slate-900 relative overflow-hidden">
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
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Enter your business email"
                  className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
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
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-10 bg-gradient-to-r from-orange-600 to-red-700 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SAIL</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold">SAIL Steel</span>
                  <span className="text-xs text-gray-400">Ministry of Steel, Govt. of India</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                India&lsquo;s largest steel producer, committed to providing quality steel products directly to consumers and businesses.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Products</h3>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Structural Steel</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Steel Sheets & Plates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">TMT Bars</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Steel Pipes & Tubes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Wire Products</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Bulk Orders</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Custom Steel Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Technical Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quality Certification</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Logistics Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About SAIL</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Plants</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Investor Relations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; 2025 Steel Authority of India Limited (SAIL). All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                <a href="#" className="hover:text-white transition-colors">Quality Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}