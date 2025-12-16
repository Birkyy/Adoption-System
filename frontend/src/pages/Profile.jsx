import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import Status from "../components/Status.jsx"; // Ensure this component exists

// Import API
import { getUserById, updateUser } from "../API/ProfileAPI";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=60"
  );

  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("profile");

  // 1. GET: Fetch User Data
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
      if (data.avatar) setAvatar(data.avatar);
    } catch (error) {
      console.error("Error fetching profile:", error);

      // 🟢 FIX: Auto-logout if token is invalid (401)
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
        navigate("/signin");
      } else {
        toast.error("Failed to load profile data.");
      }
    }
  };

  // 2. PUT: Update User Data
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updateData = {
      id: user.id, // Good practice to include ID in DTO if needed
      name,
      email,
      contactInfo,
      bio,
      avatar,
    };

    try {
      await updateUser(user.id, updateData);

      toast.success("Profile updated successfully!");

      // Update local storage to keep Header in sync
      const updatedUserForStorage = {
        ...user,
        name: name,
        avatar: avatar, // Syncs the new image immediately
      };

      localStorage.setItem("user", JSON.stringify(updatedUserForStorage));

      // Also update session storage if used
      if (sessionStorage.getItem("user")) {
        sessionStorage.setItem("user", JSON.stringify(updatedUserForStorage));
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.response && error.response.status === 409) {
        toast.error("This email is already taken by another user.");
      } else {
        toast.error("Failed to update profile.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Image Handling
  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large. Max 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden fredoka">
        <div className="py-5 max-lg:px-6 lg:(pl-10 pr-10) w-full">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-1">
            <div className="flex lg:flex-row items-start justify-center w-full z-10 shadow-2xl rounded-2xl bg-white overflow-hidden">
              {/* SIDEBAR */}
              <aside className="h-full hidden md:block py-6 md:w-1/3 lg:w-1/4 bg-white border-r border-indigo-50 min-h-[600px]">
                <div className="sticky top-12 text-sm">
                  <button
                    onClick={handleBackToHome}
                    className="mb-8 px-10 flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium group"
                  >
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">
                      ←
                    </span>
                    Back to Home
                  </button>

                  <h2 className="px-10 mb-6 text-4xl font-semibold tracking-wide text-[#161931]">
                    Settings
                  </h2>

                  <nav className="space-y-2">
                    <button
                      onClick={() => setSelectedTab("profile")}
                      className={`w-full text-left px-10 py-3 font-bold transition-all ${
                        selectedTab === "profile"
                          ? "text-indigo-900 bg-indigo-50 border-r-4 border-indigo-600"
                          : "text-indigo-700 hover:text-indigo-900"
                      }`}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => setSelectedTab("status")}
                      className={`w-full text-left px-10 py-3 font-semibold transition-all ${
                        selectedTab === "status"
                          ? "text-indigo-900 bg-indigo-50 border-r-4 border-indigo-600"
                          : "text-indigo-700 hover:text-indigo-900"
                      }`}
                    >
                      Status
                    </button>
                  </nav>

                  <div className="mt-10 border-t border-indigo-50 pt-4 px-10">
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-lg font-semibold text-red-500 hover:text-red-600 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </aside>

              {/* MAIN CONTENT */}
              <main className="w-full py-6 md:w-2/3 lg:w-3/4">
                <div className="px-6 md:px-8">
                  {/* Mobile Header */}
                  <div className="md:hidden mb-6 flex justify-between items-center">
                    <button
                      onClick={handleBackToHome}
                      className="text-slate-500"
                    >
                      ← Home
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedTab("profile")}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTab === "profile"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => setSelectedTab("status")}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTab === "status"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        Status
                      </button>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-red-500 text-sm font-bold"
                    >
                      Logout
                    </button>
                  </div>

                  {selectedTab === "profile" && (
                    <form
                      onSubmit={handleProfileSave}
                      className="max-w-2xl mx-auto mt-6 space-y-6"
                    >
                      {/* Avatar */}
                      <div className="text-center mb-6">
                        <img
                          className="object-cover w-32 h-32 p-1 rounded-full ring-2 ring-indigo-300 m-auto"
                          src={avatar}
                          alt="avatar"
                        />
                        <div className="mt-4">
                          <label className="cursor-pointer inline-block py-2 px-4 rounded-lg bg-indigo-50 text-indigo-900 text-sm font-medium hover:bg-indigo-100">
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

                      {/* Fields */}
                      <div className="grid gap-6">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-indigo-900">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg block w-full p-2.5"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-indigo-900">
                            Email
                          </label>
                          <input
                            type="email"
                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg block w-full p-2.5"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-indigo-900">
                            Contact Info
                          </label>
                          <input
                            type="text"
                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg block w-full p-2.5"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            placeholder="+6012-3456789"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-indigo-900">
                            Bio
                          </label>
                          <textarea
                            rows="4"
                            className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                          ></textarea>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 ${
                            isLoading ? "opacity-50" : ""
                          }`}
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  )}

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
