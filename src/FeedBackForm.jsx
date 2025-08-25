import React, { useState } from "react";
import axios from "axios";

function FeedBackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedbackType: "bug",
    customType: "",
    message: "",
    screenshots: [],
  });

  const [showEmail, setShowEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [imgError, setImgError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "screenshot") {
      let selectedFiles = Array.from(files);
      let currentFiles = formData.screenshots || [];
      let allFiles = [...currentFiles, ...selectedFiles];

      if (allFiles.length > 5) {
        setImgError("Vous pouvez sélectionner jusqu'à 5 images maximum.");
        allFiles = allFiles.slice(0, 5);
      } else {
        setImgError("");
      }

      setFormData((prev) => ({ ...prev, screenshots: allFiles }));
      setPreviews(allFiles.map((file) => URL.createObjectURL(file)));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "email") setEmailError("");
    }
  };

  const validateEmail = (email) => {
    // Simple regex for email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si l'email n'est pas affiché, on alerte puis on l'affiche et on bloque la soumission
    if (!showEmail) {
      alert("Veuillez renseigner votre email pour valider votre feedback.");
      setShowEmail(true);
      return;
    }

    // Si l'email est affiché mais vide or invalide, on bloque la soumission
    if (!formData.email || !validateEmail(formData.email)) {
      setEmailError("Veuillez entrer un email valide.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append(
        "feedbackType",
        formData.feedbackType === "other"
          ? formData.customType
          : formData.feedbackType
      );
      data.append("message", formData.message);
      formData.screenshots.forEach((file) => {
        data.append("screenshots", file);
      });

      await axios.post(
        "http://localhost:3000/api/auth/registerFeedback",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Feedback submitted successfully!");
      setFormData({
        name: "",
        email: "",
        feedbackType: "bug",
        customType: "",
        message: "",
        screenshots: [],
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
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none resize-none transition h-28 disabled:opacity-50"
            />
          </div>

          {/* Email (affiché seulement après clic sur submit) */}
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
                placeholder="Votre.email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none transition disabled:opacity-50"
              />
              {emailError && (
                <div className="text-red-500 text-sm mt-1">{emailError}</div>
              )}
            </div>
          )}

          {/* Screenshots */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ajouter jusqu'à 5 images
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="screenshot-upload"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 hover:scale-105 transition-all shadow-sm"
                tabIndex={0}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
                Ajouter des images
              </label>
              <input
                id="screenshot-upload"
                type="file"
                name="screenshot"
                accept="image/*"
                multiple
                onChange={handleChange}
                disabled={loading}
                className="hidden"
              />
              <span className="text-xs text-gray-500">
                {formData.screenshots.length}/5 sélectionnées
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Formats acceptés: jpg, png, gif, webp. Taille max: 5 Mo/image.
            </div>
            {imgError && (
              <div className="text-red-500 text-sm mt-2">{imgError}</div>
            )}
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 justify-center bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${idx + 1}`}
                      className="h-16 w-16 object-cover rounded-lg border border-gray-300 shadow"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newScreenshots = [...formData.screenshots];
                        const newPreviews = [...previews];
                        newScreenshots.splice(idx, 1);
                        newPreviews.splice(idx, 1);
                        setFormData((prev) => ({ ...prev, screenshots: newScreenshots }));
                        setPreviews(newPreviews);
                      }}
                      className="absolute -top-2 -right-2 bg-gray-200 text-black rounded-full w-6 h-6 flex items-center justify-center text-base p-0 hover:bg-red-500 hover:text-white transition"
                      aria-label="Supprimer cette image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl shadow transition disabled:opacity-60 flex items-center justify-center gap-2"
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
