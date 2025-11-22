// Profile.jsx
import React, { useState } from "react";
import Status from "../components/Status.jsx"; // adjust path if needed

export default function Profile() {
  const [firstName, setFirstName] = useState("Jane");
  const [lastName, setLastName] = useState("Ferguson");
  const [email, setEmail] = useState("your.email@mail.com");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=60"
  );

  const [selectedTab, setSelectedTab] = useState("profile"); // "profile" | "status"

  const handleProfileSave = (e) => {
    e.preventDefault();
    console.log({ firstName, lastName, email, profession, bio, avatar });
    alert("Profile saved (demo) — check console");
  };

  const handleAvatarUrlChange = (e) => setAvatar(e.target.value);
  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden fredoka">
        <div className="py-5 max-lg:px-6 lg:(pl-10 pr-10) w-full">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-1">
            <div className="flex lg:flex-row items-start justify-center w-full z-10 shadow-2xl rounded-2xl bg-white overflow-hidden">
              {/* ASIDE (kept, visible md+) */}
              <aside className="h-full hidden md:block py-6 md:w-1/3 lg:w-1/4 bg-white border-r border-indigo-50">
                <div className="sticky top-12 text-sm">
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
                </div>
              </aside>

              {/* MAIN: show Profile or Status content inside same container */}
              <main className="w-full py-6 md:w-2/3 lg:w-3/4">
                <div className="px-6 md:px-8">
                  {/* Small-screen navbar (visible only under md) */}
                  <div className="md:hidden mb-4">
                    <nav className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedTab("profile")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-shadow ${
                          selectedTab === "profile"
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-indigo-50 text-indigo-900"
                        }`}
                      >
                        Profile
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTab("status")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-shadow ${
                          selectedTab === "status"
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-indigo-50 text-indigo-900"
                        }`}
                      >
                        Status
                      </button>
                    </nav>
                  </div>

                  {/* PROFILE FORM */}
                  {selectedTab === "profile" && (
                    <form
                      onSubmit={handleProfileSave}
                      className="max-w-2xl mx-auto mt-6 space-y-6"
                    >
                      <div className="text-center">
                        <img
                          className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 m-auto"
                          src={avatar}
                          alt="avatar"
                        />
                        <div className="mt-3 flex justify-center gap-3 items-center">
                          <label className="text-sm text-slate-700">
                            <span className="block text-xs mb-1">Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarFile}
                              className="hidden"
                              aria-label="Upload avatar"
                            />
                            <span className="inline-block cursor-pointer py-1 px-3 rounded-lg bg-indigo-50 text-indigo-900 text-sm">
                              Choose file
                            </span>
                          </label>

                          <div className="w-60">
                            <input
                              type="url"
                              placeholder="Or paste image URL"
                              className="w-full text-sm text-slate-900 border border-slate-300 pl-3 pr-3 py-2 rounded-lg outline-[hsl(239,100%,65%)] focus:ring-[hsl(239,100%,75%)] bg-white"
                              value={avatar}
                              onChange={handleAvatarUrlChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-[#202142]">
                        <div className="flex flex-col sm:flex-row gap-4 sm:space-x-2">
                          <div className="w-full">
                            <label
                              htmlFor="first_name"
                              className="block mb-2 text-sm font-medium text-indigo-900"
                            >
                              First name
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                              placeholder="Your first name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                            />
                          </div>

                          <div className="w-full">
                            <label
                              htmlFor="last_name"
                              className="block mb-2 text-sm font-medium text-indigo-900"
                            >
                              Last name
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                              placeholder="Your last name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-indigo-900"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            placeholder="your.email@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>

                        <div className="mt-4">
                          <label
                            htmlFor="profession"
                            className="block mb-2 text-sm font-medium text-indigo-900"
                          >
                            Profession
                          </label>
                          <input
                            type="text"
                            id="profession"
                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            placeholder="Your profession"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                          />
                        </div>

                        <div className="mt-4">
                          <label
                            htmlFor="message"
                            className="block mb-2 text-sm font-medium text-indigo-900"
                          >
                            Bio
                          </label>
                          <textarea
                            id="message"
                            rows="4"
                            className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Write your bio here..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                          ></textarea>
                        </div>

                        <div className="flex justify-end mt-6">
                          <button
                            type="submit"
                            className="text-white bg-[hsl(239,100%,70%)] hover:bg-[hsl(239,100%,55%)] focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* STATUS CONTENT rendered inside the same container */}
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
