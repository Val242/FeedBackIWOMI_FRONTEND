// Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/chat-2.png";
import { motion } from "framer-motion";

function Header() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white shadow-lg sticky top-0 z-50 transition-colors duration-300 hover:bg-indigo-50">
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-3 mb-3 sm:mb-0 cursor-pointer"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 rounded-xl shadow-lg"
          />
          <span className="text-2xl font-extrabold text-indigo-700 tracking-wide">
            FeedbackHub
          </span>
        </motion.div>

        {/* Nav Links */}
        <div className="flex flex-wrap justify-center gap-6 text-base font-medium ">
          {["Home", "Submit Feedback","Connection" ].map((item, index) => (
            <motion.div
              key={index}
              className="cursor-pointer text-gray-700   hover:text-indigo-700 transition-colors duration-300 font-semibold"
              onClick={() =>
                navigate(
                  item === "Home" || item === "Submit Feedback" ? "/feedbackForm" : "/login"
                )
              }
              whileHover={{ scale: 1.1, color: "#4F46E5" }}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-200 via-white to-indigo-100 px-6 py-20 text-center overflow-hidden">
        {/* Animated background shapes */}
        <motion.div
          className="absolute top-0 left-1/4 w-40 h-40 bg-indigo-300 rounded-full opacity-20 animate-pulse"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-60 h-60 bg-indigo-400 rounded-full opacity-20 animate-pulse"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="font-bold text-4xl sm:text-5xl text-indigo-800 mb-6">
            Feedback Management System
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-700 leading-relaxed"
        >
          Share your feedback, track progress, and collaborate with our
          development team to{" "}
          <br className="hidden sm:block" />
          build a better experience for everyone.
        </motion.p>

        {/* Call-to-action button */}
        <motion.button
          className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:bg-indigo-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
}

export default Header;
