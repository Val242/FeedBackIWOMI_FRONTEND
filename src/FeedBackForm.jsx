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
    criticity: "moyenne", // Ajout du niveau de criticité
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
      const wantsEmail = window.confirm("would you like to add your email for follow-up?");

      if (wantsEmail) {
         // yes -> afficher le champ email
        setShowEmail(true);
      return;
      }
      // No -> continue without email
    }


    // only check email if showEmail is true
    if (showEmail && (!formData.email || !validateEmail(formData.email))) {
      setEmailError("please enter a valid email.");
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
      data.append("criticity", formData.criticity); // Ajout criticité
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
        criticity: "moyenne", // Réinitialiser le niveau de criticité
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

                    {/* Criticity with icons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Criticality *
            </label>
            <div className="flex gap-3 justify-between">
              {[
                {
                  value: "faible",
                  bg: "bg-green-100",
                  border: "border-green-400",
                  ring: "ring-green-300",
                  hover: "hover:bg-green-50",
                  icon: (
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="#bbf7d0" />
                      <path d="M9 15s1.5-2 3-2 3 2 3 2" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="9" cy="10" r="1" fill="#22c55e" />
                      <circle cx="15" cy="10" r="1" fill="#22c55e" />
                    </svg>
                  ),
                  label: <span className="text-xs text-green-700 mt-1">Low</span>,
                },
                {
                  value: "moyenne",
                  bg: "bg-yellow-100",
                  border: "border-yellow-400",
                  ring: "ring-yellow-200",
                  hover: "hover:bg-yellow-50",
                  icon: (
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="#fef9c3" />
                      <path d="M9 15h6" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="9" cy="10" r="1" fill="#eab308" />
                      <circle cx="15" cy="10" r="1" fill="#eab308" />
                    </svg>
                  ),
                  label: <span className="text-xs text-yellow-700 mt-1">Medium</span>,
                },
                {
                  value: "haute",
                  bg: "bg-orange-100",
                  border: "border-orange-400",
                  ring: "ring-orange-200",
                  hover: "hover:bg-orange-50",
                  icon: (
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="#ffedd5" />
                      <path d="M9 16s1.5-2 3-2 3 2 3 2" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="9" cy="10" r="1" fill="#f97316" />
                      <circle cx="15" cy="10" r="1" fill="#f97316" />
                    </svg>
                  ),
                  label: <span className="text-xs text-orange-700 mt-1">High</span>,
                },
                {
                  value: "bloquante",
                  bg: "bg-red-100",
                  border: "border-red-400",
                  ring: "ring-red-200",
                  hover: "hover:bg-red-50",
                  icon: (
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="#fee2e2" />
                      <path d="M9 16s1.5-2 3-2 3 2 3 2" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="9" cy="10" r="1" fill="#dc2626" />
                      <circle cx="15" cy="10" r="1" fill="#dc2626" />
                      <rect x="10.5" y="6.5" width="3" height="7" rx="1.5" fill="#dc2626" />
                    </svg>
                  ),
                  label: <span className="text-xs text-red-700 mt-1">critical</span>,
                },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`
                    flex flex-col items-center justify-center w-24 h-20 px-2 py-2 rounded-lg border transition
                    ${formData.criticity === item.value
                      ? `${item.bg} ${item.border} ring-2 ${item.ring}`
                      : `bg-white border-gray-300 ${item.hover}`}`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, criticity: item.value }))
                  }
                  disabled={loading}
                  aria-label={`Criticité ${item.label.props.children}`}
                >
                  {item.icon}
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
              Add up to 5 images
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
                Add images
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
              Supported formats: jpg, png, gif, webp. Max size: 5 Mo/image.
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
