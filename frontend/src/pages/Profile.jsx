import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Status from "../components/Status.jsx";

// Import the separated API functions
import { getUserById, updateUser } from "../API/ProfileAPI";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [bio, setBio] = useState("");
  // Default placeholder image
  const [avatar, setAvatar] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("profile");

  // 1. GET: Fetch User Data on Mount
  useEffect(() => {
    if (user?.id) {
      loadUserProfile(user.id);
    }
  }, [user]);

  const loadUserProfile = async (userId) => {
    try {
      const data = await getUserById(userId);

      setName(data.name || "");
      setEmail(data.email || "");
      setContactInfo(data.contactInfo || "");
      setBio(data.bio || "");
      if (data.avatar) setAvatar(data.avatar); // Load avatar if exists
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data.");
    }
  };

  // 2. PUT: Update User Data
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updateData = {
      id: user.id,
      name,
      email,
      contactInfo,
      bio,
      avatar, // Send the base64 string to backend
    };

    try {
      await updateUser(user.id, updateData);

      toast.success("Profile updated successfully!");

      // Update local storage to keep Header in sync
      const updatedUserForStorage = {
        ...user,
        name: name,
      };
      localStorage.setItem("user", JSON.stringify(updatedUserForStorage));
      if (sessionStorage.getItem("user")) {
        sessionStorage.setItem("user", JSON.stringify(updatedUserForStorage));
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      // Check for specific "Email taken" error from backend (409 Conflict)
      if (error.response && error.response.status === 409) {
        toast.error("This email is already taken by another user.");
      } else {
        toast.error("Failed to update profile.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Image Handling (Local File Only)
  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit file size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large. Please select an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Logout Logic
  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  // NEW: Back to Home Logic
  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden fredoka">
        <div className="py-5 max-lg:px-6 lg:(pl-10 pr-10) w-full">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-1">
            <div className="flex lg:flex-row items-start justify-center w-full z-10 shadow-2xl rounded-2xl bg-white overflow-hidden">
              {/* ASIDE Sidebar */}
              <aside className="h-full hidden md:block py-6 md:w-1/3 lg:w-1/4 bg-white border-r border-indigo-50 min-h-[600px]">
                <div className="sticky top-12 text-sm">
                  {/* --- NEW: Back to Home Button (Desktop) --- */}
                  <button
                    onClick={handleBackToHome}
                    className="mb-8 px-10 flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to Home
                  </button>

                  <h2 className="px-10 mb-6 text-4xl font-semibold tracking-wide text-[#161931]">
                    Settings
                  </h2>

                  <button
                    type="button"
                    onClick={() => setSelectedTab("profile")}
                    className={`w-full text-left px-10 flex items-center text-lg py-3 font-bold transition-all ${
                      selectedTab === "profile"
                        ? "text-indigo-900 bg-indigo-50 shadow-sm"
                        : "text-indigo-700 hover:text-indigo-900"
                    }`}
                  >
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTab("status")}
                    className={`w-full text-left mt-2 px-10 flex items-center text-lg py-3 font-semibold transition-all ${
                      selectedTab === "status"
                        ? "text-indigo-900 bg-indigo-50 shadow-sm"
                        : "text-indigo-700 hover:text-indigo-900"
                    }`}
                  >
                    Status
                  </button>

                  {/* LOGOUT BUTTON */}
                  <div className="mt-10 border-t border-indigo-50 pt-4">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-10 flex items-center text-lg py-3 font-semibold text-red-500 hover:bg-red-50 transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </aside>

              {/* MAIN CONTENT */}
              <main className="w-full py-6 md:w-2/3 lg:w-3/4">
                <div className="px-6 md:px-8">
                  {/* --- NEW: Back to Home Button (Mobile) --- */}
                  <div className="md:hidden mb-6">
                    <button
                      onClick={handleBackToHome}
                      className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back to Home
                    </button>
                  </div>

                  {/* Mobile Nav */}
                  <div className="md:hidden mb-4 flex justify-between items-center">
                    <nav className="flex gap-3">
                      <button
                        onClick={() => setSelectedTab("profile")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-shadow ${
                          selectedTab === "profile"
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-50 text-indigo-900"
                        }`}
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => setSelectedTab("status")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-shadow ${
                          selectedTab === "status"
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-50 text-indigo-900"
                        }`}
                      >
                        Status
                      </button>
                    </nav>
                    <button
                      onClick={handleLogout}
                      className="text-red-500 p-2 bg-red-50 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* PROFILE FORM */}
                  {selectedTab === "profile" && (
                    <form
                      onSubmit={handleProfileSave}
                      className="max-w-2xl mx-auto mt-6 space-y-6"
                    >
                      {/* AVATAR UPLOAD SECTION */}
                      <div className="text-center mb-6">
                        <img
                          className="object-cover w-32 h-32 p-1 rounded-full ring-2 ring-indigo-300 m-auto"
                          src={
                            avatar ||
                            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=60"
                          }
                          alt="avatar"
                        />
                        <div className="mt-4">
                          <label className="cursor-pointer inline-block py-2 px-4 rounded-lg bg-indigo-50 text-indigo-900 text-sm font-medium hover:bg-indigo-100 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarFile}
                              className="hidden"
                            />
                            Change Photo
                          </label>
                        </div>
                      </div>

                      <div className="mt-2 text-[#202142]">
                        {/* Full Name */}
                        <div className="w-full">
                          <label className="block mb-2 text-sm font-medium text-indigo-900">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>

                        {/* Email */}
                        <div className="mt-4">
                          <label className="block mb-2 text-sm font-medium text-indigo-900">
                            Email
                          </label>
                          <input
                            type="email"
                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>

                        {/* Contact Info */}
                        <div className="mt-4">
                          <label className="block mb-2 text-sm font-medium text-indigo-900">
                            Contact Info
                          </label>
                          <input
                            type="text"
                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            placeholder="+6012-3456789"
                          />
                        </div>

                        {/* Bio */}
                        <div className="mt-4">
                          <label className="block mb-2 text-sm font-medium text-indigo-900">
                            Bio
                          </label>
                          <textarea
                            rows="4"
                            className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                          ></textarea>
                        </div>

                        <div className="flex justify-end mt-6">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className={`text-white bg-[hsl(239,100%,70%)] hover:bg-[hsl(239,100%,55%)] focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-colors ${
                              isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            {isLoading ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* STATUS CONTENT */}
                  {selectedTab === "status" && (
                    <div className="max-w-3xl mx-auto mt-6">
                      <Status
                        isAdmin={false}
                        onBack={() => setSelectedTab("profile")}
                      />
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
