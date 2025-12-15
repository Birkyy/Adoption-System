import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import mammoth from "mammoth";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  createPet,
  getAllPets,
  deletePet,
  getNgoApplications,
  updateAdoptionStatus,
  getMyEvents,
  getPendingProposals,
  createEvent,
  approveProposal,
  getMyArticles,
  createArticle,
  deleteEvent,
} from "../API/NgoAPI";
import {
  getMyVolunteerListings,
  createVolunteerListing,
  deleteVolunteerListing,
  getApplicants,
  getStarTalent,
} from "../API/VolunteerAPI";

export default function NgoDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.userRole !== "NGO") {
      toast.error("Access Denied: NGO Area Only");
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const [activeTab, setActiveTab] = useState("pets");

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 fredoka">
      <Toaster position="top-right" />
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#009e8c]">NGO Portal</h1>
            <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {user?.name}
            </span>
          </div>
          <button
            onClick={logout}
            className="text-red-600 font-medium text-sm px-4 py-2 bg-red-50 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex overflow-x-auto space-x-4 border-b border-gray-200 mb-8 pb-1">
          <TabButton
            label="Manage Pets"
            isActive={activeTab === "pets"}
            onClick={() => setActiveTab("pets")}
          />
          <TabButton
            label="Adoptions"
            isActive={activeTab === "adoptions"}
            onClick={() => setActiveTab("adoptions")}
          />
          <TabButton
            label="Events"
            isActive={activeTab === "events"}
            onClick={() => setActiveTab("events")}
          />
          <TabButton
            label="Articles"
            isActive={activeTab === "articles"}
            onClick={() => setActiveTab("articles")}
          />
          {/* NEW TAB */}
          <TabButton
            label="Volunteers"
            isActive={activeTab === "volunteers"}
            onClick={() => setActiveTab("volunteers")}
          />
          <TabButton
            label="Reports & Analytics"
            isActive={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
          {activeTab === "pets" && <PetsManager user={user} />}
          {activeTab === "adoptions" && <AdoptionsManager user={user} />}
          {activeTab === "events" && <EventsManager user={user} />}
          {activeTab === "articles" && <ArticlesManager user={user} />}
          {activeTab === "volunteers" && <VolunteerManager user={user} />}
          {activeTab === "reports" && <ReportsManager user={user} />}
        </div>
      </main>
    </div>
  );
}

// --- REUSABLE HEADER COMPONENT ---
function SectionHeader({ title, actionButton }) {
  return (
    <div className="flex justify-between items-center mb-6 h-10">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      <div>{actionButton}</div>
    </div>
  );
}

// --- 1. PETS MANAGER ---
function PetsManager({ user }) {
  const navigate = useNavigate(); // 1. Hook for navigation
  const [pets, setPets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "",
    species: "Dog",
    breed: "",
    age: "",
    gender: "Male",
    description: "",
    status: "Available",
    photos: [],
  });

  const fetchPets = async () => {
    try {
      const allPets = await getAllPets();
      const myPets = allPets.filter((p) => p.ngoId === user.id);
      setPets(myPets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => file.size <= 2 * 1024 * 1024);
    if (validFiles.length < files.length) {
      toast.error("Some images were skipped (Max 2MB each).");
    }

    const promises = validFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((base64Images) => {
        setNewPet((prev) => ({
          ...prev,
          photos: [...prev.photos, ...base64Images],
        }));
      })
      .catch((err) => toast.error("Error reading image files"));
  };

  const removePhoto = (indexToRemove) => {
    setNewPet((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPet.photos.length === 0) {
      toast.error("Please upload at least one photo.");
      return;
    }

    try {
      const payload = {
        ...newPet,
        age: newPet.age,
        ngoId: user.id,
        imageUrl: newPet.photos[0],
      };

      await createPet(payload);
      toast.success("Pet listed successfully!");
      setShowForm(false);
      fetchPets();
      setNewPet({
        name: "",
        species: "Dog",
        breed: "",
        age: "",
        gender: "Male",
        description: "",
        status: "Available",
        photos: [],
      });
    } catch (error) {
      toast.error("Failed to create listing.");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // 2. Stop click from navigating to detail page
    if (!window.confirm("Delete this listing?")) return;
    try {
      await deletePet(id, user.id);
      toast.success("Listing removed.");
      fetchPets();
    } catch (error) {
      toast.error("Failed to delete listing.");
    }
  };

  return (
    <div>
      <SectionHeader
        title="Your Pet Listings"
        actionButton={
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              showForm
                ? "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
                : "bg-[#009e8c] text-white hover:bg-teal-700"
            }`}
          >
            {showForm ? "Cancel" : "+ New Listing"}
          </button>
        }
      />

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            placeholder="Pet Name"
            required
            className="p-2 border rounded"
            value={newPet.name}
            onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
          />
          <select
            className="p-2 border rounded"
            value={newPet.species}
            onChange={(e) => setNewPet({ ...newPet, species: e.target.value })}
          >
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Other">Other</option>
          </select>
          <input
            placeholder="Breed"
            className="p-2 border rounded"
            value={newPet.breed}
            onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
          />
          <input
            placeholder="Age (e.g. '2 years')"
            type="text"
            required
            className="p-2 border rounded"
            value={newPet.age}
            onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
          />
          <select
            className="p-2 border rounded"
            value={newPet.gender}
            onChange={(e) => setNewPet({ ...newPet, gender: e.target.value })}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* MULTI-PHOTO UPLOAD */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Pet Photos (Select multiple)
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              <label className="cursor-pointer bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                + Add Photos
              </label>
              <span className="text-xs text-gray-400">Max 2MB per image</span>
            </div>

            {newPet.photos.length > 0 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {newPet.photos.map((photo, index) => (
                  <div key={index} className="relative shrink-0 group">
                    <img
                      src={photo}
                      alt={`Preview ${index}`}
                      className="h-24 w-24 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <textarea
            placeholder="Description"
            className="p-2 border rounded md:col-span-2"
            rows="3"
            value={newPet.description}
            onChange={(e) =>
              setNewPet({ ...newPet, description: e.target.value })
            }
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded md:col-span-2 hover:bg-indigo-700 font-medium"
          >
            Create Listing
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <div
            key={pet.petId}
            // 3. Make card clickable to navigate
            onClick={() => navigate(`/pet/${pet.petId}`)}
            className="border rounded-lg p-4 flex flex-col gap-2 bg-white shadow-sm relative cursor-pointer hover:shadow-md transition-shadow group"
          >
            <img
              src={
                (pet.photos && pet.photos.length > 0
                  ? pet.photos[0]
                  : pet.imageUrl) || "https://via.placeholder.com/150"
              }
              alt={pet.name}
              className="w-full h-40 object-cover rounded-md bg-gray-200 transition-transform group-hover:scale-[1.02] duration-300"
            />
            <h3 className="font-bold text-lg">
              {pet.name}{" "}
              <span className="text-sm font-normal text-gray-500">
                ({pet.species})
              </span>
            </h3>
            <p className="text-sm text-gray-600">
              {pet.breed} • {pet.age} • {pet.gender}
            </p>
            {pet.photos && pet.photos.length > 1 && (
              <div className="text-xs text-indigo-600 font-semibold">
                +{pet.photos.length - 1} more photos
              </div>
            )}
            <div className="mt-auto pt-4 flex justify-between items-center">
              <span
                className={`px-2 py-1 text-xs rounded ${
                  pet.status === "Available"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {pet.status}
              </span>
              <button
                onClick={(e) => handleDelete(e, pet.petId)}
                className="text-red-600 text-sm hover:underline z-10"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {pets.length === 0 && !showForm && (
          <p className="col-span-full text-center text-gray-500 py-10">
            No pets listed yet.
          </p>
        )}
      </div>
    </div>
  );
}

// --- 2. ADOPTIONS MANAGER ---
function AdoptionsManager({ user }) {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    getNgoApplications(user.id).then(setApps).catch(console.error);
  }, [user.id]);

  const handleStatus = async (id, status) => {
    try {
      await updateAdoptionStatus(id, status, user.id);
      toast.success(`Application ${status}`);
      setApps(
        apps.map((a) => (a.applicationId === id ? { ...a, status: status } : a))
      );
    } catch (error) {
      toast.error("Action failed.");
    }
  };

  return (
    <div>
      <SectionHeader title="Adoption Applications" actionButton={null} />

      <div className="space-y-4">
        {apps.map((app) => (
          <div
            key={app.applicationId}
            className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white"
          >
            <div>
              <h3 className="font-bold text-indigo-900">Pet ID: {app.petId}</h3>
              <p className="text-sm text-gray-600">
                Applicant ID: {app.applicantId}
              </p>
              <p className="text-sm mt-1 bg-gray-50 p-2 rounded">
                "{app.message}"
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  app.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : app.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {app.status}
              </span>
              {app.status === "Pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatus(app.applicationId, "Approved")}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatus(app.applicationId, "Rejected")}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {apps.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No applications received yet.
          </p>
        )}
      </div>
    </div>
  );
}

// --- 3. EVENTS MANAGER ---
function EventsManager({ user }) {
  const navigate = useNavigate(); // 1. Initialize navigation hook
  const [subTab, setSubTab] = useState("my_events");
  const [myEvents, setMyEvents] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Initialize state with empty strings to avoid uncontrolled input warnings
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (subTab === "my_events") {
      getMyEvents(user.id).then(setMyEvents).catch(console.error);
    } else {
      getPendingProposals(user.id).then(setProposals).catch(console.error);
    }
  }, [subTab, user.id]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large. Max 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) =>
      setNewEvent((prev) => ({ ...prev, imageUrl: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await createEvent({ ...newEvent, createdById: user.id });
      toast.success("Event created successfully!");

      // Reset and Refresh
      setShowForm(false);
      setNewEvent({
        title: "",
        description: "",
        eventDate: "",
        location: "",
        imageUrl: "",
      });
      getMyEvents(user.id).then(setMyEvents);
    } catch (error) {
      toast.error("Failed to create event.");
    }
  };

  const handleProposalDecision = async (eventId, status) => {
    try {
      await approveProposal(eventId, user.id, status);
      toast.success(`Proposal ${status}`);
      setProposals((prev) => prev.filter((p) => p.id !== eventId));
    } catch (error) {
      toast.error("Failed to update proposal.");
    }
  };

  const handleDownloadDocument = (base64Data, fileName) => {
    const link = document.createElement("a");
    link.href = base64Data;
    link.download = fileName || "proposal-document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Sub-Navigation Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 min-h-[40px] gap-4 border-b border-gray-100 pb-4">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setSubTab("my_events");
              setShowForm(false); // Close form if switching tabs
            }}
            className={`text-xl font-bold transition-colors ${
              subTab === "my_events"
                ? "text-slate-800 border-b-2 border-indigo-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            My Events
          </button>
          <span className="text-gray-300 text-xl">|</span>
          <button
            onClick={() => setSubTab("proposals")}
            className={`text-xl font-bold transition-colors ${
              subTab === "proposals"
                ? "text-slate-800 border-b-2 border-indigo-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Proposals
          </button>
        </div>

        {/* Action Button - Only visible on My Events tab */}
        {subTab === "my_events" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 rounded-lg transition-colors font-medium shadow-sm ${
              showForm
                ? "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
                : "bg-[#009e8c] text-white hover:bg-teal-700"
            }`}
          >
            {showForm ? "Cancel" : "+ Create Event"}
          </button>
        )}
      </div>

      {/* CONTENT: MY EVENTS */}
      {subTab === "my_events" && (
        <div className="space-y-6">
          {/* Create Event Form - Conditionally Rendered */}
          {showForm && (
            <div className="bg-gray-50 p-6 rounded-xl border border-indigo-100 shadow-inner animate-fadeIn">
              <h3 className="text-lg font-bold text-slate-700 mb-4">
                Create New Event
              </h3>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <input
                  placeholder="Event Title"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="datetime-local"
                    required
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newEvent.eventDate}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, eventDate: e.target.value })
                    }
                  />
                  <input
                    placeholder="Location"
                    required
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newEvent.location}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, location: e.target.value })
                    }
                  />
                </div>

                {/* File Upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">
                    Event Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {newEvent.imageUrl && (
                    <img
                      src={newEvent.imageUrl}
                      alt="Preview"
                      className="mt-2 h-32 w-full object-cover rounded-lg border border-gray-300"
                    />
                  )}
                </div>

                <textarea
                  placeholder="Description"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md"
                >
                  Publish Event
                </button>
              </form>
            </div>
          )}

          {/* List of Existing Events */}
          <div className="grid gap-4">
            {myEvents.map((ev) => (
              <div
                key={ev.id}
                // 2. CLICKABLE: Navigate to Event Detail
                onClick={() => navigate(`/event/${ev.id}`)}
                className="border p-4 rounded-lg flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex gap-4 items-center">
                  {ev.imageUrl ? (
                    <img
                      src={ev.imageUrl}
                      alt=""
                      className="w-20 h-20 rounded-lg object-cover bg-gray-100 border group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                      No Img
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {ev.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(ev.eventDate).toLocaleDateString()} @{" "}
                      {ev.location}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {ev.participantIds?.length || 0} participants
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ev.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : ev.status === "Completed"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {ev.status === "Approved" ? "Active" : ev.status}
                </span>
              </div>
            ))}
            {myEvents.length === 0 && !showForm && (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No events created yet.</p>
                <p className="text-sm text-gray-400">
                  Click "+ Create Event" to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTENT: PROPOSALS */}
      {subTab === "proposals" && (
        <div className="space-y-4">
          {proposals.map((prop) => (
            <div
              key={prop.id}
              className="border p-5 rounded-xl bg-yellow-50 border-yellow-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-lg text-slate-800">
                    {prop.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Proposed by User ID:{" "}
                    <span className="font-mono bg-white px-1 rounded border">
                      {prop.createdById}
                    </span>
                  </p>
                </div>
                <span className="text-xs font-bold text-yellow-800 bg-yellow-200 px-3 py-1 rounded-full">
                  Pending Approval
                </span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-yellow-100 text-sm text-slate-700 mb-4">
                {prop.description}
              </div>

              {/* Documents Section */}
              {prop.proposalDocuments && prop.proposalDocuments.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">
                    Attached Documents
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {prop.proposalDocuments.map((doc, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          handleDownloadDocument(
                            doc,
                            `Proposal_Doc_${idx + 1}.pdf`
                          )
                        }
                        className="flex items-center gap-2 bg-white border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-50 transition-colors font-medium"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download Doc {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-yellow-200">
                <button
                  onClick={() => handleProposalDecision(prop.id, "Approved")}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-700 shadow-sm transition-transform active:scale-95"
                >
                  Approve Proposal
                </button>
                <button
                  onClick={() => handleProposalDecision(prop.id, "Rejected")}
                  className="bg-white border border-red-200 text-red-600 px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-50 shadow-sm transition-transform active:scale-95"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {proposals.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No pending proposals.</p>
              <p className="text-sm text-gray-400">
                Check back later for user submissions.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- 4. ARTICLES MANAGER ---
function ArticlesManager({ user }) {
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    coverImageUrl: "",
  });

  useEffect(() => {
    getMyArticles(user.id).then(setArticles).catch(console.error);
  }, [user.id]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large. Max 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) =>
      setNewArticle({ ...newArticle, coverImageUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  // --- NEW: Handle DOCX Upload ---
  const handleDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      toast.error("Only .docx Word files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        // Convert DOCX -> HTML using mammoth
        const result = await mammoth.convertToHtml({
          arrayBuffer: arrayBuffer,
        });

        setNewArticle((prev) => ({ ...prev, content: result.value }));
        toast.success("Document imported successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to read document.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createArticle({ ...newArticle, authorId: user.id });
      toast.success("Article submitted for approval!");
      setShowForm(false);
      setNewArticle({ title: "", content: "", coverImageUrl: "" });
      getMyArticles(user.id).then(setArticles);
    } catch (error) {
      toast.error("Failed to submit article.");
    }
  };

  return (
    <div>
      <SectionHeader
        title="My Articles"
        actionButton={
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              showForm
                ? "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
                : "bg-[#009e8c] text-white hover:bg-teal-700"
            }`}
          >
            {showForm ? "Cancel" : "+ Write Article"}
          </button>
        }
      />

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4 border border-gray-200"
        >
          <input
            placeholder="Article Title"
            required
            className="w-full p-2 border rounded"
            value={newArticle.title}
            onChange={(e) =>
              setNewArticle({ ...newArticle, title: e.target.value })
            }
          />

          {/* COVER IMAGE UPLOAD */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {newArticle.coverImageUrl && (
              <img
                src={newArticle.coverImageUrl}
                alt="Preview"
                className="h-20 w-20 object-cover rounded mt-2 border"
              />
            )}
          </div>

          {/* --- DOCX IMPORT BUTTON --- */}
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
            <label className="block text-sm font-bold text-indigo-900 mb-1">
              Import from Word (.docx)
            </label>
            <input
              type="file"
              accept=".docx"
              onChange={handleDocUpload}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-indigo-700 hover:file:bg-indigo-50"
            />
          </div>

          <textarea
            placeholder="Write your content here or import a doc..."
            required
            className="w-full p-2 border rounded h-32 font-mono text-sm"
            value={newArticle.content}
            onChange={(e) =>
              setNewArticle({ ...newArticle, content: e.target.value })
            }
          />
          <p className="text-xs text-gray-500">
            Note: New articles are set to "Pending" until approved by an Admin.
          </p>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700"
          >
            Submit for Review
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {articles.map((art) => (
          <div
            key={art.articleId}
            className="border p-4 rounded-lg flex justify-between items-center bg-white shadow-sm"
          >
            <div className="flex gap-4 items-center">
              {art.coverImageUrl && (
                <img
                  src={art.coverImageUrl}
                  alt=""
                  className="w-16 h-16 rounded object-cover bg-gray-100"
                />
              )}
              <div>
                <h4 className="font-bold text-lg">{art.title}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(art.publishDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-bold ${
                art.status === "Published"
                  ? "bg-green-100 text-green-800"
                  : art.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {art.status}
            </span>
          </div>
        ))}
        {articles.length === 0 && !showForm && (
          <p className="text-gray-500 text-center py-10">
            You haven't written any articles yet.
          </p>
        )}
      </div>
    </div>
  );
}

function VolunteerManager({ user }) {
  const [listings, setListings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    location: "",
    skillsRequired: "",
  });

  // State for viewing applicants modal
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetchListings();
  }, [user.id]);

  const fetchListings = () => {
    getMyVolunteerListings(user.id).then(setListings).catch(console.error);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createVolunteerListing({ ...newListing, ngoId: user.id });
      toast.success("Listing created!");
      setShowForm(false);
      setNewListing({
        title: "",
        description: "",
        location: "",
        skillsRequired: "",
      });
      fetchListings();
    } catch (error) {
      toast.error("Failed to create listing.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this listing?")) return;
    try {
      await deleteVolunteerListing(id, user.id);
      toast.success("Removed.");
      fetchListings();
    } catch (error) {
      toast.error("Failed.");
    }
  };

  const handleViewApplicants = async (listingId) => {
    setSelectedListingId(listingId);
    setApplicants([]); // Clear previous
    try {
      const data = await getApplicants(listingId, user.id);
      setApplicants(data);
    } catch (error) {
      toast.error("Could not load applicants.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Volunteer Recruitment
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showForm ? "text-red-600 bg-red-50" : "bg-[#009e8c] text-white"
          }`}
        >
          {showForm ? "Cancel" : "+ Recruit Volunteers"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4 border border-gray-200"
        >
          <input
            placeholder="Role Title (e.g. Dog Walker)"
            required
            className="w-full p-2 border rounded"
            value={newListing.title}
            onChange={(e) =>
              setNewListing({ ...newListing, title: e.target.value })
            }
          />
          <input
            placeholder="Location"
            className="w-full p-2 border rounded"
            value={newListing.location}
            onChange={(e) =>
              setNewListing({ ...newListing, location: e.target.value })
            }
          />
          <input
            placeholder="Skills Required (comma separated)"
            className="w-full p-2 border rounded"
            value={newListing.skillsRequired}
            onChange={(e) =>
              setNewListing({ ...newListing, skillsRequired: e.target.value })
            }
          />
          <textarea
            placeholder="Description of duties..."
            required
            className="w-full p-2 border rounded h-24"
            value={newListing.description}
            onChange={(e) =>
              setNewListing({ ...newListing, description: e.target.value })
            }
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded font-medium"
          >
            Post Listing
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {listings.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded-lg bg-white flex justify-between items-center shadow-sm"
          >
            <div>
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.location}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">
                  {item.applicantIds?.length || 0} Applicants
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleViewApplicants(item.id)}
                className="text-indigo-600 font-medium hover:underline text-sm"
              >
                View Applicants
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600 font-medium hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {listings.length === 0 && !showForm && (
          <p className="text-center text-gray-500 py-10">
            No active recruitment listings.
          </p>
        )}
      </div>

      {/* APPLICANTS MODAL */}
      {selectedListingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Applicants List</h3>
              <button
                onClick={() => setSelectedListingId(null)}
                className="text-2xl hover:text-indigo-200"
              >
                &times;
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {applicants.length === 0 ? (
                <p className="text-center text-gray-500">
                  No one has applied yet.
                </p>
              ) : (
                <ul className="space-y-4">
                  {applicants.map((applicant) => (
                    <li
                      key={applicant.id}
                      className="border-b pb-3 last:border-0"
                    >
                      <p className="font-bold text-slate-800">
                        {applicant.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        📧 {applicant.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        📞 {applicant.contactInfo || "No contact info"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-3 text-right">
              <button
                onClick={() => setSelectedListingId(null)}
                className="text-sm font-bold text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportsManager({ user }) {
  const [adoptions, setAdoptions] = useState([]);
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for detailed views
  const [detailType, setDetailType] = useState(null); // 'adoptions' | 'events' | 'volunteers'
  const [detailData, setDetailData] = useState([]); // Stores fetched user details

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsData, eventsData, volData] = await Promise.all([
          getNgoApplications(user.id),
          getMyEvents(user.id),
          getMyVolunteerListings(user.id),
        ]);
        setAdoptions(appsData);
        setEvents(eventsData);
        setVolunteers(volData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load report data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  // --- Helper to get real participants (excluding NGO itself) ---
  const getRealParticipants = (ev) => {
    return ev.participantIds?.filter((id) => id !== user.id) || [];
  };

  // --- Calculations ---
  const approvedAdoptions = adoptions.filter((a) => a.status === "Approved");
  const totalAdoptions = approvedAdoptions.length;

  const totalParticipants = events.reduce(
    (acc, curr) => acc + getRealParticipants(curr).length,
    0
  );

  const totalVolunteers = volunteers.reduce(
    (acc, curr) => acc + (curr.applicantIds?.length || 0),
    0
  );

  // --- Graph Data ---
  const chartData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data = months.map((m) => ({
      name: m,
      Adoptions: 0,
      Participants: 0,
    }));

    approvedAdoptions.forEach((app) => {
      const date = new Date(app.submissionDate || Date.now());
      if (!isNaN(date)) data[date.getMonth()].Adoptions += 1;
    });

    events.forEach((ev) => {
      const date = new Date(ev.eventDate);
      if (!isNaN(date))
        data[date.getMonth()].Participants += getRealParticipants(ev).length;
    });

    return data;
  }, [adoptions, events]);

  // --- Click Handlers for Details ---
  const handleShowAdoptionDetails = async () => {
    setDetailType("loading");
    try {
      // Fetch user details for all approved applications
      const details = await Promise.all(
        approvedAdoptions.map(async (app) => {
          try {
            const userData = await getUserById(app.applicantId);
            return {
              ...app,
              applicantName: userData.name,
              applicantEmail: userData.email,
              applicantPhone: userData.contactInfo,
            };
          } catch (e) {
            return { ...app, applicantName: "Unknown", applicantEmail: "N/A" };
          }
        })
      );
      setDetailData(details);
      setDetailType("adoptions");
    } catch (e) {
      toast.error("Failed to load details");
      setDetailType(null);
    }
  };

  const handleShowEventDetails = () => {
    // Just show the list of events first, user clicks specific event to see people
    setDetailData(events);
    setDetailType("events");
  };

  const handleShowVolunteerDetails = () => {
    // Debugging: Check if volunteers has data
    console.log("Volunteers Data:", volunteers);
    setDetailData([...volunteers]); // Spread to create a new array reference
    setDetailType("volunteers");
  };

  // --- Render Modal ---
  const renderDetailModal = () => {
    if (!detailType) return null;

    if (detailType === "loading")
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
          </div>
        </div>
      );

    // 1. SELECT DATA SOURCE DIRECTLY (Fixes the sync issue)
    let currentData = [];
    if (detailType === "adoptions") currentData = detailData; // Adoptions fetched on demand, keep as is
    if (detailType === "events") currentData = events; // Use 'events' state directly
    if (detailType === "volunteers") currentData = volunteers; // Use 'volunteers' state directly

    // 2. DETERMINE IF EMPTY
    const hasData = currentData && currentData.length > 0;
    const isTalent = detailType === "talent";
    const showContent = hasData || isTalent;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
          {/* HEADER */}
          <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
            <h3 className="text-xl font-bold text-slate-800 capitalize">
              {isTalent
                ? "⭐ Star Volunteer Discovery"
                : `${detailType} Details`}
            </h3>
            <button
              onClick={() => setDetailType(null)}
              className="text-gray-400 hover:text-red-500 transition-colors text-2xl"
            >
              &times;
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
            {/* 🟢 EMPTY STATE LOGIC 🟢 */}
            {!showContent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-slate-100 p-6 rounded-full mb-4 text-4xl">
                  {detailType === "adoptions" && "🏠"}
                  {detailType === "events" && "📅"}
                  {detailType === "volunteers" && "👐"}
                </div>
                <h4 className="text-lg font-bold text-slate-700 capitalize">
                  No {detailType} Found
                </h4>
                <p className="text-slate-500 mt-1 max-w-xs mx-auto">
                  {detailType === "adoptions" &&
                    "No pending adoption requests."}
                  {detailType === "events" && "No active participants."}
                  {detailType === "volunteers" &&
                    "No volunteer listings created yet."}
                </p>
              </div>
            ) : (
              // 🔴 DATA EXISTS - RENDER TABLES 🔴
              <>
                {/* ADOPTIONS TABLE */}
                {detailType === "adoptions" && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                        <tr>
                          <th className="p-4">Applicant</th>
                          <th className="p-4">Pet</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {currentData.map((d) => (
                          <tr
                            key={d.id || Math.random()}
                            className="hover:bg-gray-50"
                          >
                            <td className="p-4 font-bold text-slate-700">
                              {d.applicantName || "Unknown"}
                            </td>
                            <td className="p-4 text-indigo-600">
                              {d.petName || d.petId}
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">
                                Pending
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* EVENTS LIST */}
                {detailType === "events" && (
                  <div className="space-y-4">
                    {currentData.map((ev) => (
                      <EventParticipantsCard
                        key={ev.id}
                        event={ev}
                        user={user}
                      />
                    ))}
                  </div>
                )}

                {/* VOLUNTEERS LIST */}
                {detailType === "volunteers" && (
                  <div className="space-y-4">
                    {currentData.map((vol) => (
                      <VolunteerApplicantsCard
                        key={vol.id}
                        listing={vol}
                        user={user}
                      />
                    ))}
                  </div>
                )}

                {isTalent && (
                  <TalentDiscoveryTool
                    events={events}
                    volunteers={volunteers}
                    user={user}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Loading analytics...</div>
    );

  return (
    <div className="space-y-8 animate-fadeIn">
      {renderDetailModal()}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Performance Overview
        </h2>
        <p className="text-sm text-gray-500">Click cards for details</p>
      </div>

      {/* CLICKABLE STAT CARDS - NOW WITH 4 COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Existing Card 1 */}
        <StatCard
          title="Total Pets Adopted"
          value={totalAdoptions}
          color="bg-gradient-to-br from-indigo-500 to-purple-600"
          icon="🏠"
          textColor="text-white"
          onClick={() => setDetailType("adoptions")}
        />

        {/* Existing Card 2 */}
        <StatCard
          title="Event Participants"
          value={totalParticipants}
          color="bg-gradient-to-br from-teal-400 to-teal-600"
          icon="🎉"
          textColor="text-white"
          onClick={() => setDetailType("events")}
        />

        {/* Existing Card 3 */}
        <StatCard
          title="Volunteer Applicants"
          value={totalVolunteers}
          color="bg-gradient-to-br from-amber-400 to-orange-500"
          icon="🤝"
          textColor="text-white"
          onClick={() => setDetailType("volunteers")}
        />

        {/* 🟢 NEW 4TH CARD: STAR TALENT DISCOVERY 🟢 */}
        <StatCard
          title="Star Volunteers"
          value="Find"
          color="bg-gradient-to-br from-pink-500 to-rose-600"
          icon="⭐"
          textColor="text-white"
          onClick={() => setDetailType("talent")} // Opens the new tool
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-700 mb-6">
            Monthly Adoptions
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Bar
                  dataKey="Adoptions"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-700 mb-6">
            Community Engagement
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="Participants"
                  stroke="#009e8c"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Fetch & Show Event Participants ---
function EventParticipantsCard({ event, user }) {
  const [participants, setParticipants] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Filter NGO itself out
  const realParticipantIds =
    event.participantIds?.filter((id) => id !== user.id) || [];

  const handleExpand = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (participants) return; // Already fetched

    setLoading(true);
    try {
      const data = await Promise.all(
        realParticipantIds.map((id) => getUserById(id))
      );
      setParticipants(data);
    } catch (e) {
      toast.error("Error loading participants");
    }
    setLoading(false);
  };

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <div
        className="p-4 flex justify-between items-center bg-gray-50 cursor-pointer"
        onClick={handleExpand}
      >
        <div>
          <h4 className="font-bold text-slate-800">{event.title}</h4>
          <p className="text-xs text-gray-500">
            {new Date(event.eventDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-indigo-600">
            {realParticipantIds.length} Joined
          </span>
          <span className="text-gray-400">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>
      {expanded && (
        <div className="p-4 border-t">
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : participants && participants.length > 0 ? (
            <ul className="space-y-2">
              {participants.map((p) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <span className="font-bold">{p.name || p.username}</span>
                  <span className="text-gray-600">{p.email}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">
              No external participants yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT: Fetch & Show Volunteer Applicants ---
function VolunteerApplicantsCard({ listing, user }) {
  const [apps, setApps] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleExpand = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (apps) return;

    try {
      // Using existing API that fetches applicants for a listing
      const data = await getApplicants(listing.id, user.id);
      setApps(data);
    } catch (e) {
      toast.error("Error loading applicants");
    }
  };

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <div
        className="p-4 flex justify-between items-center bg-gray-50 cursor-pointer"
        onClick={handleExpand}
      >
        <div>
          <h4 className="font-bold text-slate-800">{listing.title}</h4>
          <p className="text-xs text-gray-500">{listing.location}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-amber-600">
            {listing.applicantIds?.length || 0} Applied
          </span>
          <span className="text-gray-400">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>
      {expanded && (
        <div className="p-4 border-t">
          {apps && apps.length > 0 ? (
            <ul className="space-y-3">
              {apps.map((p) => (
                <li key={p.id} className="text-sm border-b pb-2 last:border-0">
                  <p className="font-bold">{p.name}</p>
                  <p className="text-gray-600">📧 {p.email}</p>
                  <p className="text-gray-600">📞 {p.contactInfo || "N/A"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No applicants yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

// --- NEW: STAR VOLUNTEER DISCOVERY TOOL ---
function TalentDiscoveryTool({ user }) {
  const [topVolunteers, setTopVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        setLoading(true);
        // 🟢 CALL THE NEW API
        const data = await getStarTalent(user.id);
        setTopVolunteers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTalent();
    }
  }, [user.id]);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Discovering stars...</div>
    );

  if (!topVolunteers || topVolunteers.length === 0)
    return (
      <div className="p-8 text-center flex flex-col items-center">
        <span className="text-4xl mb-2">🌟</span>
        <h4 className="text-lg font-bold text-slate-700">No Stars Yet</h4>
        <p className="text-slate-500 text-sm">
          Once users participate in events or apply for roles, your top stars
          will appear here.
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex gap-4 items-start">
        <div className="text-3xl">💡</div>
        <div>
          <h4 className="font-bold text-indigo-900">
            Star Volunteer Discovery
          </h4>
          <p className="text-sm text-indigo-700">
            Top engaged users based on event participation and volunteer
            applications.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {topVolunteers.map((person, index) => (
          <div
            key={person.id}
            className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white shrink-0 ${
                  index === 0
                    ? "bg-yellow-400 ring-4 ring-yellow-100"
                    : index === 1
                    ? "bg-slate-400"
                    : index === 2
                    ? "bg-orange-400"
                    : "bg-indigo-400"
                }`}
              >
                #{index + 1}
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  {person.name}
                  {index === 0 && <span>👑</span>}
                </h4>
                <div className="text-xs text-white bg-indigo-500 px-2 py-0.5 rounded-full inline-block">
                  {person.score} Engagements
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1 mt-4 md:mt-0 w-full md:w-auto text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-lg">📧</span>
                <span>{person.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-lg">📞</span>
                <span>{person.contactInfo || "N/A"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: USER CARD ---
function TalentUserCard({ stats }) {
  // Mock User Data (Replace with getUserById(stats.id) in real app)
  // For demo, we just show generic data + stats
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3 hover:border-indigo-300 transition-colors">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
        {stats.count}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h5 className="font-bold text-slate-800">
            User ID: {stats.id.substring(0, 5)}...
          </h5>
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">
            Active
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1 truncate">
          Recent: {stats.sources[0]}
        </p>
        <div className="mt-3 flex gap-2">
          {/* Fake Actions for Demo */}
          <button className="text-xs bg-slate-50 hover:bg-slate-100 px-3 py-1 rounded border border-slate-200 font-semibold">
            Email
          </button>
          <button className="text-xs bg-slate-50 hover:bg-slate-100 px-3 py-1 rounded border border-slate-200 font-semibold">
            Call
          </button>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function StatCard({ title, value, color, icon, textColor, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl shadow-lg flex items-center justify-between ${color} ${textColor} cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all`}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">
          {title}
        </p>
        <p className="text-4xl font-extrabold">{value}</p>
      </div>
      <div className="text-4xl bg-white/20 w-14 h-14 flex items-center justify-center rounded-2xl backdrop-blur-sm">
        {icon}
      </div>
    </div>
  );
}

function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 px-6 font-medium text-sm whitespace-nowrap transition-colors relative ${
        isActive ? "text-[#009e8c]" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#009e8c] rounded-t-full"></div>
      )}
    </button>
  );
}
