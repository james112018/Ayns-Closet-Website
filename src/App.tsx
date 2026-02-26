import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User, ArrowRight, Star, Heart, X, Facebook, Mail, Phone, MessageSquare, Send, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Markdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import SEO from './components/SEO';

const CATEGORIES = [
  { id: 'womens-clothing', name: "Women's Clothing", image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800' },
  { id: 'mens-clothing', name: "Men's Clothing", image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&q=80&w=800' },
  { id: 'kids', name: 'Kids', image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=80&w=800' },
  { id: 'shoes', name: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800' },
  { id: 'accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800' },
];

const FEATURED_PRODUCTS = [
  { id: 1, name: 'Classic White Sneaker', price: 89.99, category: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600', rating: 4.8 },
  { id: 2, name: 'Minimalist Leather Tote', price: 129.00, category: 'Women\'s Accessories', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=600', rating: 4.9 },
  { id: 3, name: 'Linen Blend Blazer', price: 145.00, category: 'Women\'s Clothing', image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=600', rating: 4.7 },
  { id: 4, name: 'Everyday Cotton Tee', price: 24.99, category: 'Men\'s Clothing', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600', rating: 4.5 },
  { id: 5, name: 'Kids Denim Overalls', price: 45.00, category: 'Kids', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=600', rating: 4.9 },
  { id: 6, name: 'Polarized Sunglasses', price: 65.00, category: 'Men\'s Accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600', rating: 4.6 },
  { id: 7, name: 'Wool Blend Coat', price: 199.99, category: 'Men\'s Clothing', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600', rating: 4.8 },
  { id: 8, name: 'Pleated Midi Skirt', price: 78.00, category: 'Women\'s Clothing', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=600', rating: 4.7 },
];

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}

const REVIEWS = [
  { id: 1, name: "Maria Clara", rating: 5, comment: "Love the quality of the clothes! The shipping was fast too.", date: "2 days ago", source: "Facebook" },
  { id: 2, name: "Juan Dela Cruz", rating: 5, comment: "Best shop for kids' apparel in Davao. Highly recommended!", date: "1 week ago", source: "Google" },
  { id: 3, name: "Elena Gilbert", rating: 4, comment: "Stylish accessories. Will definitely order again.", date: "2 weeks ago", source: "Facebook" },
  { id: 4, name: "Damon Salvatore", rating: 5, comment: "Great customer service. They answered all my questions on Facebook.", date: "1 month ago", source: "Google" },
  { id: 5, name: "Stefan Salvatore", rating: 5, comment: "The location is easy to find. Great selection of shoes!", date: "3 days ago", source: "Google" },
  { id: 6, name: "Bonnie Bennett", rating: 5, comment: "Excellent quality and very affordable prices.", date: "5 days ago", source: "Google" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
            i < Math.floor(rating)
              ? 'text-yellow-400 fill-current'
              : i < rating
              ? 'text-yellow-400 fill-current opacity-50'
              : 'text-purple-200'
          }`}
        />
      ))}
      <span className="text-[10px] sm:text-xs text-purple-600/60 ml-1.5 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

function Home() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  
  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  useEffect(() => {
    const timer = setInterval(nextReview, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToFeatured = () => {
    const element = document.getElementById('featured-products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "Ayn's Closet",
    "image": "https://scontent.fcgy1-2.fna.fbcdn.net/v/t39.30808-6/522751706_122249828438075467_2826286420784318693_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=AVLPOL4qjjoQ7kNvwFbK97w&_nc_oc=AdmNxqwLv364DEv40TryNAEvhQwlgm269xyaeyg3mqXj1r7KV5JDnDE_eIoa9WsSRwk&_nc_zt=23&_nc_ht=scontent.fcgy1-2.fna&_nc_gid=3unsPNdcwrHL_Hns9V262A&oh=00_AftX9pMBL4Q6K22mEjFJAoU92SnQW_aSmPAYI8wWJ3Vu2w&oe=69A593FC",
    "@id": "https://www.facebook.com/aynscloset",
    "url": "https://www.facebook.com/aynscloset",
    "telephone": "09513841612",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Cogon Biao Escuela, Tugbok District",
      "addressLocality": "Davao City",
      "addressRegion": "Davao del Sur",
      "addressCountry": "PH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 7.1689188,
      "longitude": 125.5203417
    },
    "sameAs": [
      "https://www.facebook.com/aynscloset"
    ]
  };

  return (
    <>
      <SEO 
        title="Ayn's Closet | Women's, Men's & Kids Clothing in Davao City"
        description="Shop Ayn's Closet in Davao City for the latest trends in women's and men's clothing, kids' apparel, shoes, and accessories. Visit us at Cogon Biao Escuela, Tugbok District."
        keywords="Ayn's Closet, Davao City clothing store, Tugbok District boutique, women's clothing Davao, men's clothing Davao, kids apparel Davao, shoes, fashion accessories"
        schema={localBusinessSchema}
      />
      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] min-h-[400px] sm:min-h-[500px] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y }}>
          <img 
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero fashion" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </motion.div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-4 sm:mb-6 tracking-tight drop-shadow-md"
          >
            Ayn's Closet
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8 font-light drop-shadow-sm px-4"
          >
            Your one-stop shop for Clothing, Shoes, Accessories & Kids Apparel.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToFeatured}
              className="w-full sm:w-auto bg-purple-600 text-white px-8 py-3.5 text-sm font-semibold tracking-wide hover:bg-purple-700 transition-colors shadow-lg cursor-pointer"
            >
              SHOP NEW ARRIVALS
            </motion.button>
            <a href="https://www.facebook.com/aynscloset" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-purple-900 text-white px-8 py-3.5 text-sm font-semibold tracking-wide hover:bg-purple-950 transition-colors shadow-lg flex items-center justify-center gap-2">
              <Facebook className="w-4 h-4" /> VISIT OUR FACEBOOK
            </a>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
        <div className="flex justify-between items-end mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-purple-950">Shop by Category</h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
          {CATEGORIES.map((category, index) => (
            <Link 
              to={`/category/${category.id}`} 
              key={category.id}
              className={`group relative aspect-[4/5] overflow-hidden bg-purple-50 rounded-lg sm:rounded-none ${index === 4 ? 'col-span-2 lg:col-span-1 aspect-[2/1] lg:aspect-[4/5]' : ''}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full h-full"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                  <h3 className="text-white font-medium text-sm sm:text-lg tracking-wide flex items-center justify-between">
                    {category.name}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden sm:block" />
                  </h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-products" className="bg-purple-50/30 py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 sm:mb-10">
            <div>
              <h2 className="text-xl sm:text-3xl font-serif font-bold text-purple-950 mb-1 sm:mb-2">Trending Now</h2>
              <p className="text-sm sm:text-base text-purple-600/70">Our most loved pieces this week.</p>
            </div>
            <Link to="/category/womens-clothing" className="hidden sm:flex items-center text-sm font-medium text-purple-900 hover:text-purple-700 transition-colors">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-8 sm:gap-y-10">
            {FEATURED_PRODUCTS.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative flex flex-col h-full"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-purple-100 mb-3 sm:mb-4 rounded-lg sm:rounded-none">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <button className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/80 backdrop-blur-sm text-purple-900 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:text-red-500 shadow-sm z-10">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="text-xs sm:text-sm font-medium text-purple-950 line-clamp-2">
                      <Link to={`/category/${product.category.toLowerCase().includes('women') ? 'womens-clothing' : 'mens-clothing'}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-purple-900 whitespace-nowrap">${product.price.toFixed(2)}</p>
                  </div>
                  <p className="text-[10px] sm:text-xs text-purple-600/60 mb-1 sm:mb-2">{product.category}</p>
                  <div className="flex items-center mt-auto">
                    <StarRating rating={product.rating} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 sm:hidden flex justify-center">
            <Link 
              to="/category/womens-clothing"
              className="border border-purple-200 text-purple-900 px-6 py-3 text-sm font-medium w-full hover:bg-purple-50 transition-colors rounded-md text-center"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Trust Section */}
      <section className="py-12 sm:py-16 border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="p-4 sm:p-6 bg-purple-50/50 sm:bg-transparent rounded-xl sm:rounded-none">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-purple-950 mb-1 sm:mb-2 uppercase tracking-wider">Wide Selection</h3>
              <p className="text-xs sm:text-sm text-purple-600/70">Clothing, shoes, accessories for men, women, and kids.</p>
            </div>
            <div className="p-4 sm:p-6 bg-purple-50/50 sm:bg-transparent rounded-xl sm:rounded-none">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-purple-950 mb-1 sm:mb-2 uppercase tracking-wider">Community Trusted</h3>
              <p className="text-xs sm:text-sm text-purple-600/70">Join our growing community on Facebook for the latest updates.</p>
            </div>
            <div className="p-4 sm:p-6 bg-purple-50/50 sm:bg-transparent rounded-xl sm:rounded-none">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-purple-950 mb-1 sm:mb-2 uppercase tracking-wider">Premium Quality</h3>
              <p className="text-xs sm:text-sm text-purple-600/70">We carefully curate our closet to ensure you get the best.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-white py-12 sm:py-24 border-t border-purple-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-purple-950 mb-4">What Our Customers Say</h2>
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
              </div>
              <span className="text-purple-950 font-bold">4.9/5</span>
              <span className="text-purple-600/60 text-sm">(Based on 500+ reviews from Facebook & Google)</span>
            </div>
            <div className="flex justify-center gap-4">
              <a href="https://www.facebook.com/aynscloset/reviews" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 text-sm font-medium underline underline-offset-4">
                View on Facebook
              </a>
              <a href="https://www.google.com/maps/place/Ayn's+Closet/@7.1689188,125.5203417,17z/data=!3m1!4b1!4m6!3m5!1s0x32f9153bcd918f5d:0x65824e25f5592017!8m2!3d7.1689188!4d125.5229166!16s%2Fg%2F11vr4dqggy?entry=ttu&g_ep=EgoyMDI2MDIyMy4wIKXMDSoASAFQAw%3D%3D#reviews" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 text-sm font-medium underline underline-offset-4">
                View on Google
              </a>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center justify-center">
              <button 
                onClick={prevReview}
                className="absolute left-0 z-10 p-2 rounded-full bg-white shadow-md text-purple-600 hover:text-purple-900 transition-colors -translate-x-1/2 sm:-translate-x-full"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="w-full px-4 sm:px-12">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentReviewIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-purple-50/30 p-8 sm:p-12 rounded-3xl border border-purple-100 flex flex-col items-center text-center"
                  >
                    <div className="flex justify-between items-center mb-6 w-full">
                      <div className="flex mx-auto">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < REVIEWS[currentReviewIndex].rating ? 'text-yellow-400 fill-current' : 'text-purple-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-purple-950 text-lg sm:text-2xl font-serif italic mb-8 leading-relaxed">
                      "{REVIEWS[currentReviewIndex].comment}"
                    </p>
                    <div>
                      <p className="text-purple-950 font-bold text-lg">{REVIEWS[currentReviewIndex].name}</p>
                      <div className="flex items-center justify-center gap-3 mt-1">
                        <span className="text-purple-600/60 text-xs uppercase tracking-wider">{REVIEWS[currentReviewIndex].date}</span>
                        <span className="w-1 h-1 bg-purple-200 rounded-full"></span>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-tighter">{REVIEWS[currentReviewIndex].source}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button 
                onClick={nextReview}
                className="absolute right-0 z-10 p-2 rounded-full bg-white shadow-md text-purple-600 hover:text-purple-900 transition-colors translate-x-1/2 sm:translate-x-full"
                aria-label="Next review"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex justify-center gap-2 mt-8">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentReviewIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentReviewIndex ? 'w-6 bg-purple-600' : 'bg-purple-200'}`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryPage() {
  const { id } = useParams();
  const category = CATEGORIES.find(c => c.id === id);
  
  if (!category) return <div className="py-24 text-center">Category not found</div>;

  const seoDescriptions: Record<string, string> = {
    'womens-clothing': "Explore Ayn's Closet in Davao City for the latest trends in women's clothing. Shop stylish dresses, tops, bottoms, and outerwear designed for the modern woman.",
    'mens-clothing': "Upgrade your wardrobe with Ayn's Closet's men's clothing collection in Davao City. Discover premium shirts, pants, jackets, and everyday essentials.",
    'kids': "Shop adorable and durable kids' clothing at Ayn's Closet, Davao City. Find comfortable, stylish outfits for boys and girls of all ages.",
    'shoes': "Step out in style with our curated collection of shoes at Ayn's Closet, Davao City. From casual sneakers to elegant heels, find your perfect pair.",
    'accessories': "Complete your look with fashion accessories from Ayn's Closet in Davao City. Shop our selection of bags, sunglasses, jewelry, and more."
  };

  const seoKeywords: Record<string, string> = {
    'womens-clothing': "women's clothing Davao City, women's fashion Davao, dresses, tops, boutique women's apparel Tugbok",
    'mens-clothing': "men's clothing Davao City, men's fashion Davao, men's shirts, men's jackets, boutique men's apparel Tugbok",
    'kids': "kids clothing Davao City, children's apparel Davao, boys clothing, girls clothing, toddler clothes Tugbok",
    'shoes': "shoes Davao City, sneakers, boots, heels, footwear, stylish shoes Davao",
    'accessories': "fashion accessories Davao City, handbags, sunglasses, jewelry, stylish accessories Davao"
  };

  return (
    <div className="py-12 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title={`${category.name} | Ayn's Closet Davao City`}
        description={seoDescriptions[id as string] || `Shop the best selection of ${category.name.toLowerCase()} at Ayn's Closet in Davao City.`}
        keywords={seoKeywords[id as string] || `${category.name.toLowerCase()} Davao City, Ayn's Closet, fashion Davao`}
      />
      <h1 className="text-3xl sm:text-5xl font-serif font-bold text-purple-950 mb-8">{category.name}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-8 sm:gap-y-10">
        {FEATURED_PRODUCTS.filter(p => p.category.toLowerCase().includes(category.name.toLowerCase().replace("'s clothing", "").replace("accessories", ""))).map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative flex flex-col h-full"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-purple-100 mb-3 sm:mb-4 rounded-lg sm:rounded-none">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <button className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/80 backdrop-blur-sm text-purple-900 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:text-red-500 shadow-sm z-10">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-1 gap-2">
                <h3 className="text-xs sm:text-sm font-medium text-purple-950 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-purple-900 whitespace-nowrap">${product.price.toFixed(2)}</p>
              </div>
              <p className="text-[10px] sm:text-xs text-purple-600/60 mb-1 sm:mb-2">{product.category}</p>
              <div className="flex items-center mt-auto">
                <StarRating rating={product.rating} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function InfoPage() {
  const { type } = useParams();
  
  const content: Record<string, { title: string; text: string }> = {
    'shipping': {
      title: 'Shipping Information',
      text: 'We offer free standard shipping on all orders over $100. For orders under $100, a flat rate of $10 applies. Delivery typically takes 3-5 business days.'
    },
    'returns': {
      title: 'Returns & Exchanges',
      text: 'Items can be returned or exchanged within 30 days of purchase. Items must be in their original condition with tags attached.'
    },
    'privacy': {
      title: 'Privacy Policy',
      text: 'Your privacy is important to us. We collect only the information necessary to process your orders and improve your shopping experience.'
    },
    'terms': {
      title: 'Terms of Service',
      text: 'By using our website, you agree to comply with our terms and conditions. We reserve the right to update these terms at any time.'
    },
    'refund': {
      title: 'Refund Policy',
      text: 'Refunds are processed within 5-7 business days of receiving your returned item. The refund will be issued to the original payment method.'
    },
    'size-guide': {
      title: 'Size Guide',
      text: 'Our sizes generally run true to standard US sizing. Please refer to the specific product measurements for the most accurate fit.'
    },
    'faq': {
      title: 'FAQ',
      text: 'Have questions? Check out our frequently asked questions about orders, shipping, and products. If you can\'t find what you\'re looking for, message us on Facebook!'
    }
  };

  const page = content[type || ''];

  if (!page) return <div className="py-24 text-center">Page not found</div>;

  return (
    <div className="py-12 sm:py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title={`${page.title} | Ayn's Closet Davao City`} 
        description={page.text} 
        keywords={`Ayn's Closet, ${page.title}, Davao City, Tugbok District, clothing store policies`}
      />
      <h1 className="text-3xl sm:text-5xl font-serif font-bold text-purple-950 mb-8">{page.title}</h1>
      <div className="prose prose-purple max-w-none">
        <p className="text-purple-900/80 leading-relaxed text-lg">{page.text}</p>
        <p className="mt-8 text-purple-600/60">For more detailed information or specific inquiries, please contact us through our official Facebook page.</p>
      </div>
    </div>
  );
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hi! I'm Ayn's Closet AI assistant. How can I help you today? You can ask me about our collections, shipping, or business info!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `You are an AI assistant for "Ayn's Closet", a clothing and accessories shop. 
            Business Info:
            - Categories: Women's Clothing, Men's Clothing, Kids, Shoes, Accessories.
            - Shipping: Free on orders over $100. Standard rate $10.
            - Returns: 30-day return/exchange policy.
            - Contact: Message on Facebook (aynscloset) or email amoguizayeen@gmail.com.
            - Phone: 0951 384 1612.
            - Address: Cogon Biao Escuela, Tugbok District, Davao City, Philippines.
            - Maps Location: https://www.google.com/maps/place/Ayn's+Closet/@7.1689188,125.5203417,17z/data=!3m1!4b1!4m6!3m5!1s0x32f9153bcd918f5d:0x65824e25f5592017!8m2!3d7.1689188!4d125.5229166!16s%2Fg%2F11vr4dqggy?entry=ttu&g_ep=EgoyMDI2MDIyMy4wIKXMDSoASAFQAw%3D%3D
            - Tone: Friendly, professional, and helpful.
            
            User says: ${userMessage}` }]
          }
        ]
      });

      const response = await model;
      const text = response.text || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-2xl border border-purple-100 flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-purple-900 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Ayn's Closet AI</h3>
                  <p className="text-[10px] text-purple-200">Online & Ready to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-purple-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-purple-50/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
                      : 'bg-white text-purple-950 border border-purple-100 rounded-tl-none shadow-sm'
                  }`}>
                    <div className="markdown-body">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-purple-100 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-purple-100 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-grow text-sm p-2 border border-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Sneakers', 'Denim', 'Accessories']);
  const suggestions = ['Summer Dresses', 'Men\'s Shoes', 'Kids Overalls', 'Leather Bags'];

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewsletterStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('https://formspree.io/f/mjgelrwe', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setNewsletterStatus('success');
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setNewsletterStatus('idle'), 5000);
      } else {
        setNewsletterStatus('idle');
        alert('Oops! There was a problem submitting your form');
      }
    } catch (error) {
      setNewsletterStatus('idle');
      alert('Oops! There was a problem submitting your form');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Announcement Bar */}
      <div className="bg-purple-950 text-white text-xs font-medium py-2 px-4 text-center tracking-wide">
        WELCOME TO AYN's CLOSET | FREE SHIPPING ON ALL ORDERS OVER $100
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 text-purple-600 hover:text-purple-900 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-start flex-1 lg:flex-none">
              <Link to="/" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-purple-950 flex items-center gap-2">
                <img 
                  src="https://scontent.fcgy1-2.fna.fbcdn.net/v/t39.30808-6/522751706_122249828438075467_2826286420784318693_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=AVLPOL4qjjoQ7kNvwFbK97w&_nc_oc=AdmNxqwLv364DEv40TryNAEvhQwlgm269xyaeyg3mqXj1r7KV5JDnDE_eIoa9WsSRwk&_nc_zt=23&_nc_ht=scontent.fcgy1-2.fna&_nc_gid=3unsPNdcwrHL_Hns9V262A&oh=00_AftX9pMBL4Q6K22mEjFJAoU92SnQW_aSmPAYI8wWJ3Vu2w&oe=69A593FC" 
                  alt="Ayn's Closet Logo" 
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border border-purple-100"
                  referrerPolicy="no-referrer"
                />
                Ayn's Closet
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {CATEGORIES.map((item) => (
                <Link key={item.id} to={`/category/${item.id}`} className="text-sm font-medium text-purple-600 hover:text-purple-950 transition-colors">
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-3 sm:space-x-6">
              <div className="hidden md:flex items-center bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
                <Search className="h-4 w-4 text-purple-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  onClick={() => setIsSearchOpen(true)}
                  className="bg-transparent text-sm focus:outline-none w-32 lg:w-48 placeholder:text-purple-300"
                />
              </div>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-purple-600 hover:text-purple-900 md:hidden cursor-pointer" 
                title="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setIsAccountOpen(true)}
                className="text-purple-600 hover:text-purple-900 cursor-pointer" 
                title="Account"
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Modal */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-white flex flex-col"
            >
              <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center border-b border-purple-100">
                <div className="flex-1 flex items-center">
                  <Search className="h-6 w-6 text-purple-400 mr-4" />
                  <input 
                    autoFocus
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..." 
                    className="w-full text-xl sm:text-2xl font-light focus:outline-none placeholder:text-purple-200"
                  />
                </div>
                <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-purple-50 rounded-full transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-xs font-bold text-purple-950 uppercase tracking-widest mb-6">Suggestions</h3>
                    <div className="flex flex-wrap gap-3">
                      {suggestions.map((s) => (
                        <button 
                          key={s}
                          onClick={() => setSearchQuery(s)}
                          className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-purple-950 uppercase tracking-widest mb-6">Recent Searches</h3>
                    <div className="space-y-4">
                      {recentSearches.map((s) => (
                        <button 
                          key={s}
                          onClick={() => setSearchQuery(s)}
                          className="flex items-center text-purple-600 hover:text-purple-950 transition-colors w-full group"
                        >
                          <Search className="w-4 h-4 mr-3 text-purple-300 group-hover:text-purple-600" />
                          <span className="text-sm">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {searchQuery && (
                  <div className="mt-16">
                    <h3 className="text-sm font-medium text-purple-950 mb-6">Results for "{searchQuery}"</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {FEATURED_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                        <Link key={p.id} to={`/category/${p.category.toLowerCase().includes('women') ? 'womens-clothing' : 'mens-clothing'}`} onClick={() => setIsSearchOpen(false)} className="group">
                          <div className="aspect-[3/4] overflow-hidden bg-purple-50 rounded-lg mb-3">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                          </div>
                          <h4 className="text-sm font-medium text-purple-950">{p.name}</h4>
                          <p className="text-xs text-purple-600/60">${p.price.toFixed(2)}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Account Modal */}
        <AnimatePresence>
          {isAccountOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white max-w-md w-full p-8 rounded-2xl shadow-2xl relative border border-purple-100"
              >
                <button onClick={() => setIsAccountOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-purple-50 rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="h-8 w-8 text-purple-700" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-2 text-purple-950">Welcome Back</h3>
                  <p className="text-purple-600/70 mb-8">Sign in to your account to manage orders and preferences.</p>
                  <div className="space-y-4">
                    <button className="w-full bg-purple-700 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition-colors">
                      Sign In
                    </button>
                    <button className="w-full border border-purple-200 py-3 rounded-lg font-medium hover:bg-purple-50 text-purple-700 transition-colors">
                      Create Account
                    </button>
                  </div>
                  <p className="mt-6 text-xs text-purple-400">Feature coming soon! We're working on bringing you a personalized shopping experience.</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-[55] bg-purple-950/40 backdrop-blur-sm lg:hidden"
              />
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white border-t border-purple-100 overflow-hidden relative z-[60]"
              >
                <div className="px-4 pt-2 pb-6 space-y-1">
                  {CATEGORIES.map((item) => (
                    <Link 
                      key={item.id} 
                      to={`/category/${item.id}`} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-4 text-base font-medium text-purple-950 border-b border-purple-50 hover:bg-purple-50 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 flex items-center space-x-4 px-3">
                    <a href="https://www.facebook.com/aynscloset" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-900">
                      <Facebook className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/info/:type" element={<InfoPage />} />
        </Routes>
      </main>

      <Chatbot />

      {/* Footer */}
      <footer className="bg-purple-950 text-white pt-12 sm:pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
            <div>
              <h3 className="font-serif text-2xl font-bold tracking-tight mb-4 sm:mb-6 flex items-center gap-2">
                <img 
                  src="https://scontent.fcgy1-2.fna.fbcdn.net/v/t39.30808-6/522751706_122249828438075467_2826286420784318693_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=AVLPOL4qjjoQ7kNvwFbK97w&_nc_oc=AdmNxqwLv364DEv40TryNAEvhQwlgm269xyaeyg3mqXj1r7KV5JDnDE_eIoa9WsSRwk&_nc_zt=23&_nc_ht=scontent.fcgy1-2.fna&_nc_gid=3unsPNdcwrHL_Hns9V262A&oh=00_AftX9pMBL4Q6K22mEjFJAoU92SnQW_aSmPAYI8wWJ3Vu2w&oe=69A593FC" 
                  alt="Ayn's Closet Logo" 
                  className="h-8 w-8 rounded-full object-cover border border-purple-800"
                  referrerPolicy="no-referrer"
                />
                Ayn's Closet
              </h3>
              <p className="text-purple-200/70 text-sm leading-relaxed mb-6">
                Your premier destination for trendy clothing, stylish shoes, and must-have accessories for the whole family.
              </p>
              <div className="space-y-3 text-sm text-purple-200/70 mb-6">
                <p className="flex items-center gap-3">
                  <Mail className="w-4 h-4" /> amoguizayeen@gmail.com
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-4 h-4" /> 0951 384 1612
                </p>
                <a 
                  href="https://www.google.com/maps/place/Ayn's+Closet/@7.1689188,125.5203417,17z/data=!3m1!4b1!4m6!3m5!1s0x32f9153bcd918f5d:0x65824e25f5592017!8m2!3d7.1689188!4d125.5229166!16s%2Fg%2F11vr4dqggy?entry=ttu&g_ep=EgoyMDI2MDIyMy4wIKXMDSoASAFQAw%3D%3D" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 hover:text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4" /> Cogon Biao Escuela, Tugbok District, Davao City
                </a>
              </div>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/aynscloset" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center hover:bg-purple-700 text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 sm:mb-6">Shop</h4>
              <ul className="space-y-3 sm:space-y-4 text-sm text-purple-200/70">
                {CATEGORIES.map((category) => (
                  <li key={category.id}>
                    <Link to={`/category/${category.id}`} className="hover:text-white transition-colors">{category.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 sm:mb-6">Customer Service</h4>
              <ul className="space-y-3 sm:space-y-4 text-sm text-purple-200/70">
                <li><a href="https://www.facebook.com/aynscloset" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact Us via Facebook</a></li>
                <li><Link to="/info/shipping" className="hover:text-white transition-colors">Shipping Information</Link></li>
                <li><Link to="/info/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
                <li><Link to="/info/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
                <li><Link to="/info/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 sm:mb-6">Stay Updated</h4>
              <p className="text-purple-200/70 text-sm mb-4">
                Follow our Facebook page or subscribe to our newsletter for the latest arrivals and exclusive offers.
              </p>
              {newsletterStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-900 text-white p-4 rounded-md text-sm border border-purple-800"
                >
                  Thank you for subscribing!
                </motion.div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="Enter your email" 
                    className="bg-purple-900 text-white px-4 py-3 sm:py-2.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-purple-400 rounded-md sm:rounded-none sm:rounded-l-md placeholder:text-purple-400"
                  />
                  <button 
                    type="submit" 
                    disabled={newsletterStatus === 'loading'}
                    className="bg-white text-purple-950 px-4 py-3 sm:py-2.5 text-sm font-medium hover:bg-purple-50 transition-colors rounded-md sm:rounded-none sm:rounded-r-md whitespace-nowrap disabled:opacity-50"
                  >
                    {newsletterStatus === 'loading' ? 'Joining...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          <div className="border-t border-purple-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-0">
            <p className="text-purple-400 text-xs text-center md:text-left">
              &copy; {new Date().getFullYear()} Ayn's Closet. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:space-x-6 text-xs text-purple-400">
              <Link to="/info/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/info/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/info/refund" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
