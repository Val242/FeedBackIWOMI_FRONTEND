import React from "react";
import logo from "./assets/chat-2.png";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export default function CopyRights() {
  return (
    <footer className="bg-black text-gray-400 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Branding */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-12 h-12" /> {/* Increased size */}
            <span className="text-2xl font-bold text-white">FeedbackHub</span>
          </div>
          <p className="text-gray-400 text-sm">
            Streamline your feedback management process with our comprehensive
            solution to improve your user experience.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-white font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            {["Submit Feedback", "Track Status", "Admin Login", "Developer Portal"].map(
              (link, idx) => (
                <li
                  key={idx}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  {link}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-white font-semibold mb-3">Support</h2>
          <ul className="space-y-2 text-sm">
            {["Help Center", "Documentation", "Contact Us", "Privacy Policy"].map(
              (item, idx) => (
                <li
                  key={idx}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Social Connect */}
        <div className="space-y-3">
          <h2 className="text-white font-semibold">Connect</h2>
          <div className="flex gap-5 mt-2">
            <FaTwitter className="text-gray-400 hover:text-white transition-transform transform hover:scale-125 cursor-pointer text-2xl" />
            <FaGithub className="text-gray-400 hover:text-white transition-transform transform hover:scale-125 cursor-pointer text-2xl" />
            <FaLinkedin className="text-gray-400 hover:text-white transition-transform transform hover:scale-125 cursor-pointer text-2xl" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} FeedbackHub. All rights reserved.
      </div>
    </footer>
  );
}
