// Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/chat-2.png";

function Header() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-50">
        {/* Logo */}
        <div
          className="flex items-center space-x-3 mb-3 sm:mb-0 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo" className="w-10 h-10 rounded-lg shadow" />
          <span className="text-2xl font-bold text-gray-800 tracking-wide">
            FeedbackHub
          </span>
        </div>

        {/* Nav Links */}
        <div className="flex flex-wrap justify-center gap-6 text-base font-medium">
          <div
            className="cursor-pointer text-gray-700 hover:text-black transition"
            onClick={() => navigate("/")}
          >
            Home
          </div>
          <div
            className="cursor-pointer text-gray-700 hover:text-black transition"
            onClick={() => navigate("/")} // stays on home where feedback form is
          >
            Submit Feedback
          </div>
          <div
            className="cursor-pointer text-gray-700 hover:text-black transition"
            onClick={() => navigate("/login")}
          >
            Connection
          </div>
        </div>
      </div>

      {/* Hero Section with Indigo Gradient */}
      <div className="bg-gradient-to-r from-indigo-100 via-white to-indigo-50 px-6 py-14 text-center">
        <div className="font-bold text-4xl sm:text-5xl text-gray-800 mb-6">
          Feedback Management System
        </div>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Share your feedback, track progress, and collaborate with our
            development team to{" "}
            <br className="hidden sm:block" />
            build a better experience for everyone.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Header;
