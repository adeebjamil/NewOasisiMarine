"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Banner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Array of banner images with descriptions and links - Using Unsplash images
  const banners = [
    {
      image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1920&q=80",
      title: "Contact Us",
      highlight: "Get In Touch",
      description:
        "Reach out for quotes, support or inquiries. Our expert team is here to help you find the right marine & industrial supplies.",
      cta: "Contact Now",
      ctaLink: "/contact",
      icon: <Phone className="w-6 h-6" />,
      stats: [
        { value: "24/7", label: "Support" },
        { value: "UAE", label: "Coverage" },
      ],
    },
    {
      image: "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=1920&q=80",
      title: "About Us",
      highlight: "Excellence Since 2023",
      description:
        "Founded in 2023, we deliver high-quality marine & oilfield equipment across UAE & Middle East, driven by innovation, quality & customer service.",
      cta: "Learn More",
      ctaLink: "/about",
      icon: <MapPin className="w-6 h-6" />,
      stats: [
        { value: "ISO", label: "Certified" },
        { value: "100+", label: "Products" },
      ],
    },
    {
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80",
      title: "Our Products",
      highlight: "Premium Equipment",
      description:
        "Valves, fittings, flanges, rubber & gasket sheets, clamps, hoses + more — all engineered for durability & performance in demanding environments.",
      cta: "Browse Products",
      ctaLink: "/products",
      icon: <Mail className="w-6 h-6" />,
      stats: [
        { value: "Top", label: "Quality" },
        { value: "Fast", label: "Delivery" },
      ],
    },
    {
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
      title: "Our Branches",
      highlight: "Serving You Better",
      description:
        "Serving multiple locations with efficient distribution, quick response & in-person support so you can count on local presence & reliability.",
      cta: "Find Location",
      ctaLink: "/branch",
      icon: <MapPin className="w-6 h-6" />,
      stats: [
        { value: "UAE", label: "Wide" },
        { value: "Local", label: "Support" },
      ],
    },
  ];


  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentImageIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Changed from 5000ms to 3000ms (3 seconds)

    return () => clearInterval(interval);
  }, [banners.length, isAutoPlaying]);

  // Handle navigation
  const goToNext = () => {
    setDirection(1);
    setIsAutoPlaying(false);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setDirection(-1);
    setIsAutoPlaying(false);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const handleIndicatorClick = (index: number) => {
    const newDirection = index > currentImageIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentImageIndex(index);
    setIsAutoPlaying(false);
  };
 

  // Animation variants - Smoother sliding
  const bannerVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
      };
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.8,
      },
    },
  };

  return (
    <div className="w-full relative">
      {/* Banner Container - Full screen height with modern design */}
      <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-screen mt-2 sm:mt-4 overflow-hidden">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={currentImageIndex}
            custom={direction}
            variants={bannerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 }
            }}
            className="absolute inset-0"
          >
            {/* Background Image with zoom effect */}
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={banners[currentImageIndex].image}
                alt={`${banners[currentImageIndex].title} - Oasis Marine UAE`}
                fill
                className="object-cover"
                priority={currentImageIndex === 0}
                sizes="100vw"
              />
            </motion.div>

            {/* Modern gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
            </div>

            {/* Banner Content - Enhanced design */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="max-w-3xl"
                >
                  {/* Icon badge */}
                  <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4 md:mb-6"
                  >
                    <div className="text-cyan-400 flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0">
                      {banners[currentImageIndex].icon}
                    </div>
                    <span className="text-white text-xs sm:text-sm font-medium leading-none">
                      {banners[currentImageIndex].highlight}
                    </span>
                  </motion.div>

                  {/* Title with modern styling */}
                  <motion.h1
                    variants={itemVariants}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight"
                  >
                    <span className="text-white">
                      {banners[currentImageIndex].title}
                    </span>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "60px" }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="h-1 sm:h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-2 sm:mt-3 md:mt-4"
                    />
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    variants={itemVariants}
                    className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-6 md:mb-8 leading-relaxed max-w-2xl"
                  >
                    {banners[currentImageIndex].description}
                  </motion.p>

                  {/* Stats row */}
                  <motion.div
                    variants={statsVariants}
                    className="flex gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-4 sm:mb-6 md:mb-8"
                  >
                    {banners[currentImageIndex].stats.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3"
                      >
                        <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div variants={itemVariants}>
                    <Link
                      href={banners[currentImageIndex].ctaLink}
                      className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold text-sm sm:text-base px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50 group"
                    >
                      <span>{banners[currentImageIndex].cta}</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Modern design - Hidden on mobile */}
        <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 md:px-6 pointer-events-none z-20">
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPrevious}
            className="pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-full p-2 sm:p-2.5 md:p-3 transition-all duration-300 shadow-lg hidden sm:block"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNext}
            className="pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-full p-2 sm:p-2.5 md:p-3 transition-all duration-300 shadow-lg hidden sm:block"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </motion.button>
        </div>

        {/* Progress Indicators - Modern design */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className="group relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`h-0.5 sm:h-1 rounded-full transition-all duration-500 ${
                  index === currentImageIndex
                    ? "w-8 sm:w-10 md:w-12 bg-gradient-to-r from-cyan-400 to-blue-500"
                    : "w-6 sm:w-7 md:w-8 bg-white/40 group-hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white font-medium z-20 text-xs sm:text-sm md:text-base">
          <span className="text-cyan-400">{currentImageIndex + 1}</span>
          <span className="text-white/60"> / {banners.length}</span>
        </div>
      </div>
    </div>
  );
}