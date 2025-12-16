import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestNgoAccount } from "../API/AuthAPI";
import toast from "react-hot-toast";

export default function Partner() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    // At least 8 chars, 1 number, 1 symbol
    const passwordRegex = /^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      toast.error(
        "Password must be at least 8 characters long, contain at least one number and one symbol."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    // Prepare payload matching the new NgoRegistrationDto
    const payload = {
      Name: formData.name,
      Username: formData.username,
      Email: formData.email,
      Password: formData.password,
      ContactInfo: formData.phone, // Send Phone as ContactInfo
      Address: formData.address, // Send Address separately
      Bio: formData.bio,
    };

    try {
      await requestNgoAccount(payload);

      toast.success("Application submitted successfully!");

      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        bio: "",
      });

      setTimeout(() => navigate("/signin"), 3000);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response && error.response.data) {
        // Safely handle error message objects if backend returns validation errors
        const errorMsg =
          typeof error.response.data === "string"
            ? error.response.data
            : JSON.stringify(error.response.data); // Stringify object errors
        toast.error(`Error: ${errorMsg}`);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#d5a07d] flex items-center justify-center pb-12 px-4 sm:pb-6 lg:px-8 fredoka">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* LEFT: Info & Visuals */}
        <div className="bg-[#009e8c] text-white p-10 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-amber-300 opacity-20 rounded-full blur-3xl"></div>

          <h2 className="text-4xl font-bold mb-6 relative z-10">
            Let's Save Lives Together!
          </h2>
          <p className="text-lg mb-8 text-teal-50 relative z-10">
            Join our network of trusted shelters and NGOs. By partnering with
            us, you get:
          </p>

          <ul className="space-y-4 text-teal-50 relative z-10">
            <li className="flex items-center gap-3">
              <span className="bg-white text-[#009e8c] p-1 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </span>
              Access to thousands of potential adopters.
            </li>
            <li className="flex items-center gap-3">
              <span className="bg-white text-[#009e8c] p-1 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </span>
              Tools to manage your pet listings and events.
            </li>
            <li className="flex items-center gap-3">
              <span className="bg-white text-[#009e8c] p-1 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </span>
              A dedicated profile page to share your mission.
            </li>
          </ul>

          <div className="mt-12">
            <p className="text-sm opacity-80">Already a partner?</p>
            <button
              onClick={() => navigate("/signin")}
              className="text-white font-bold hover:underline text-lg"
            >
              Sign in here &rarr;
            </button>
          </div>
        </div>

        {/* RIGHT: Application Form */}
        <div className="p-10 lg:p-12">
          <div className="text-center lg:text-left mb-8">
            <h3 className="text-3xl font-bold text-slate-800">
              Become a Partner
            </h3>
            <p className="text-slate-500 mt-2">
              Fill out the form below. Our team will review your application
              within 24-48 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Organization Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Happy Paws Shelter"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#009e8c] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Username & Email Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="admin_happypaws"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#009e8c] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@happypaws.org"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#009e8c] outline-none"
                />
              </div>
            </div>

            {/* Password Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#009e8c] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#009e8c] outline-none"
                />
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+60 12-345 6789"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#009e8c] outline-none"
              />
            </div>

            {/* Address Field (Separate) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Registered Address
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="123, Pet Lane, Kuala Lumpur"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#009e8c] outline-none"
              />
            </div>

            {/* Mission / Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mission / Bio
              </label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us briefly about your organization..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#009e8c] outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-lg font-bold text-white text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-400 hover:bg-amber-500 hover:shadow-amber-200"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Application"
              )}
            </button>

            <p className="text-xs text-center text-slate-400 mt-4">
              By submitting, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
