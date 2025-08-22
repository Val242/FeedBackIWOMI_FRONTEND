import React, { useState } from "react";
import axios from "axios";

function FeedBackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedbackType: "bug",
    customType: "",
    message: "",
    screenshot: null,
  });

  const [showEmail, setShowEmail] = useState(false); 
  const [loading, setLoading] = useState(false); // NEW state

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading

    try {
      const data = new FormData();
      data.append("name", formData.name);
      if (showEmail) data.append("email", formData.email);
      data.append(
        "feedbackType",
        formData.feedbackType === "other" ? formData.customType : formData.feedbackType
      );
      data.append("message", formData.message);
      if (formData.screenshot) {
        data.append("screenshot", formData.screenshot);
      }

      const res = await axios.post(
        "http://localhost:3000/api/auth/registerFeedback",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Feedback submitted successfully!");
      console.log(res.data);

      setFormData({
        name: "",
        email: "",
        feedbackType: "bug",
        customType: "",
        message: "",
        screenshot: null,
      });
      setShowEmail(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("❌ Error submitting feedback. Please try again.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 p-6">
      <div className="relative w-full max-w-3xl bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Submit Your Feedback
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Help us improve by sharing your thoughts, suggestions, or reporting issues.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name (optional)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none transition disabled:opacity-50"
            />
          </div>

          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Type
            </label>
            <select
              name="feedbackType"
              value={formData.feedbackType}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none transition disabled:opacity-50"
            >
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="general">General Feedback</option>
              <option value="improvement">Improvement Suggestions</option>
              <option value="other">Other</option>
            </select>

            {formData.feedbackType === "other" && (
              <input
                type="text"
                name="customType"
                value={formData.customType}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter custom category"
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none transition disabled:opacity-50"
              />
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Please describe your feedback in detail"
              onFocus={() => setShowEmail(true)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none resize-none transition h-28 disabled:opacity-50"
            />
          </div>

          {/* Email */}
          {showEmail && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="Your.email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none transition disabled:opacity-50"
              />
            </div>
          )}

          {/* Screenshot */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attach a Screenshot
            </label>
            <input
              type="file"
              name="screenshot"
              accept="image/*"
              onChange={handleChange}
              disabled={loading}
              className="w-full text-sm text-gray-500 border border-gray-300 rounded-lg px-3 py-2 disabled:opacity-50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l-3.5 3.5L12 24v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedBackForm;
