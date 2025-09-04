import React, { useState } from "react";
import FeedBackForm from "./feedBackForm";
import Login from "./Login";
import logo from "./assets/chat-2.png";

function Header() {
  const [showForm, setShowForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setShowLogin(false);
  };

  const toggleLogin = () => {
    setShowLogin((prev) => !prev);
    setShowForm(false);
  };

  return (
    <div className="w-full">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          <img src={logo} alt="logo" className="w-10 h-10 rounded-lg shadow" />
          <span className="text-2xl font-bold text-gray-800 tracking-wide">
            FeedbackHub
          </span>
        </div>

        {/* Nav Links */}
        <div className="flex flex-wrap justify-center gap-6 text-base font-medium">
          <div className="cursor-pointer text-gray-700 hover:text-black transition">
            Home
          </div>
          <div
            className="cursor-pointer text-gray-700 hover:text-black transition"
            onClick={toggleForm}
          >
            Submit Feedback
          </div>
          <div
            className="cursor-pointer text-gray-700 hover:text-black transition"
            onClick={toggleLogin}
          >
            Connection
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative">
            {/* Cancel button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
              onClick={() => setShowLogin(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
              Admin Login
            </h2>
            <Login />
          </div>
        </div>
      )}

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
