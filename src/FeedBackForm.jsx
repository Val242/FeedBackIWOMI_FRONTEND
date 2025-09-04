import React, { useState } from "react";
import axios from "axios";

function FeedBackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedbackType: "bug",
    customType: "",
    message: "",
    image: [], // changed from screenshots
    criticality: "low",
  });

  const [showEmail, setShowEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [imgError, setImgError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      let selectedFiles = Array.from(files);
      let allFiles = [...(formData.image || []), ...selectedFiles];

      if (allFiles.length > 5) {
        setImgError("You can select up to 5 images only.");
        allFiles = allFiles.slice(0, 5);
      } else setImgError("");

      setFormData((prev) => ({ ...prev, image: allFiles }));
      setPreviews(allFiles.map((file) => URL.createObjectURL(file)));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "email") setEmailError("");
    }
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!showEmail) {
      alert("Please enter your email to submit feedback.");
      setShowEmail(true);
      return;
    }

    if (!formData.email || !validateEmail(formData.email)) {
      setEmailError("Please enter a valid email.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append(
        "type",
        formData.feedbackType === "other" ? formData.customType : formData.feedbackType
      );
      data.append("message", formData.message);
      data.append("criticality", formData.criticality);

      // Append images
      formData.image.forEach((file) => {
        data.append("image", file);
      });

      await axios.post("http://localhost:3000/api/auth/registerFeedback", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Feedback submitted successfully!");
      setFormData({
        name: "",
        email: "",
        feedbackType: "bug",
        customType: "",
        message: "",
        image: [],
        criticality: "low",
      });
      setShowEmail(false);
      setPreviews([]);
      setImgError("");
      setEmailError("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("❌ Error submitting feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 p-6">
      <div className="relative w-full max-w-3xl bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Submit Your Feedback
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Help us improve by sharing your thoughts or reporting issues.
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none disabled:opacity-50"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none disabled:opacity-50"
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
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none disabled:opacity-50"
              />
            )}
          </div>

          {/* Criticality with emoji buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Criticality *
            </label>
            <div className="flex gap-3 justify-between">
              {[ 
                { value: "low", label: "Low 🟢" },
                { value: "average", label: "Medium 🟡" },
                { value: "high", label: "High 🟠" },
                { value: "blocking", label: "Blocking 🔴" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`flex-1 px-3 py-2 rounded-lg border transition font-medium ${
                    formData.criticality === item.value
                      ? "bg-indigo-200 border-indigo-400 ring-2 ring-indigo-300"
                      : "bg-white border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, criticality: item.value }))
                  }
                  disabled={loading}
                >
                  {item.label}
                </button>
              ))}
            </div>
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
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-400 outline-none disabled:opacity-50 h-28"
            />
          </div>

          {/* Email */}
          {showEmail && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Your.email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none disabled:opacity-50"
              />
              {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}
            </div>
          )}

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add up to 5 images
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              disabled={loading}
              multiple
              className="block"
            />
            {imgError && <div className="text-red-500 text-sm mt-1">{imgError}</div>}
            {previews.length > 0 && (
              <div className="flex gap-2 mt-2">
                {previews.map((src, idx) => (
                  <img key={idx} src={src} alt={`Preview ${idx}`} className="h-16 w-16 object-cover rounded" />
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedBackForm;
