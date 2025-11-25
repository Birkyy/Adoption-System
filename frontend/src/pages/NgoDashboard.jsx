import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
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
} from "../API/NgoAPI";

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

      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#009e8c]">NGO Portal</h1>
            <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {user?.name || "Partner"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
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
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* TABS */}
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
            label="Events & Proposals"
            isActive={activeTab === "events"}
            onClick={() => setActiveTab("events")}
          />
          <TabButton
            label="News / Articles"
            isActive={activeTab === "articles"}
            onClick={() => setActiveTab("articles")}
          />
        </div>

        {/* TAB CONTENT CONTAINER */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
          {activeTab === "pets" && <PetsManager user={user} />}
          {activeTab === "adoptions" && <AdoptionsManager user={user} />}
          {activeTab === "events" && <EventsManager user={user} />}
          {activeTab === "articles" && <ArticlesManager user={user} />}
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

// --- 1. PETS MANAGER (UPDATED FOR MULTI-PHOTO) ---
function PetsManager({ user }) {
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
    photos: [], // Changed from single imageUrl to array
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

  // Handle Multiple Image Uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Filter large files
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
          photos: [...prev.photos, ...base64Images], // Append new photos
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
      // Send photos array. Backend Pet model maps this to List<string> Photos
      const payload = {
        ...newPet,
        age: parseInt(newPet.age),
        ngoId: user.id,
        // For backward compatibility, set ImageUrl to first photo
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

  const handleDelete = async (id) => {
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
            placeholder="Age"
            type="number"
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

          {/* MULTI-PHOTO UPLOAD SECTION */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Pet Photos (Select multiple)
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              <label className="cursor-pointer bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <input
                  type="file"
                  multiple // Allow multiple selection
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                + Add Photos
              </label>
              <span className="text-xs text-gray-400">Max 2MB per image</span>
            </div>

            {/* Image Previews */}
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
            className="border rounded-lg p-4 flex flex-col gap-2 bg-white shadow-sm relative"
          >
            {/* Display Main Image (First in list or ImageUrl) */}
            <img
              src={
                (pet.photos && pet.photos.length > 0
                  ? pet.photos[0]
                  : pet.imageUrl) || "https://via.placeholder.com/150"
              }
              alt={pet.name}
              className="w-full h-40 object-cover rounded-md bg-gray-200"
            />
            <h3 className="font-bold text-lg">
              {pet.name}{" "}
              <span className="text-sm font-normal text-gray-500">
                ({pet.species})
              </span>
            </h3>
            <p className="text-sm text-gray-600">
              {pet.breed} • {pet.age} yrs • {pet.gender}
            </p>
            {/* Photo Count Indicator */}
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
                onClick={() => handleDelete(pet.petId)}
                className="text-red-600 text-sm hover:underline"
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
  const [subTab, setSubTab] = useState("my_events");
  const [myEvents, setMyEvents] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [showForm, setShowForm] = useState(false);

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
      setNewEvent({ ...newEvent, imageUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await createEvent({ ...newEvent, createdById: user.id });
      toast.success("Event created successfully!");
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
      setProposals(proposals.filter((p) => p.id !== eventId));
    } catch (error) {
      toast.error("Failed to update proposal.");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 min-h-[40px] gap-4">
        <div className="flex gap-4">
          <button
            onClick={() => setSubTab("my_events")}
            className={`text-xl font-bold transition-colors ${
              subTab === "my_events"
                ? "text-slate-800"
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
                ? "text-slate-800"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Proposals
          </button>
        </div>

        {subTab === "my_events" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              showForm
                ? "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
                : "bg-[#009e8c] text-white hover:bg-teal-700"
            }`}
          >
            {showForm ? "Cancel" : "+ Create Event"}
          </button>
        )}
      </div>

      {subTab === "my_events" && (
        <>
          {showForm && (
            <form
              onSubmit={handleCreateEvent}
              className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4 border border-gray-200"
            >
              <input
                placeholder="Event Title"
                required
                className="w-full p-2 border rounded"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  required
                  className="p-2 border rounded"
                  value={newEvent.eventDate}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, eventDate: e.target.value })
                  }
                />
                <input
                  placeholder="Location"
                  required
                  className="p-2 border rounded"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                />
              </div>

              {/* FILE UPLOAD */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Event Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {newEvent.imageUrl && (
                  <img
                    src={newEvent.imageUrl}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded mt-2 border"
                  />
                )}
              </div>

              <textarea
                placeholder="Description"
                required
                className="w-full p-2 border rounded"
                rows="3"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700"
              >
                Publish Event
              </button>
            </form>
          )}

          <div className="grid gap-4">
            {myEvents.map((ev) => (
              <div
                key={ev.id}
                className="border p-4 rounded-lg flex justify-between items-center bg-white shadow-sm"
              >
                <div className="flex gap-4 items-center">
                  {ev.imageUrl && (
                    <img
                      src={ev.imageUrl}
                      alt=""
                      className="w-16 h-16 rounded object-cover bg-gray-100"
                    />
                  )}
                  <div>
                    <h4 className="font-bold">{ev.title}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(ev.eventDate).toLocaleDateString()} @{" "}
                      {ev.location}
                    </p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Active
                </span>
              </div>
            ))}
            {myEvents.length === 0 && !showForm && (
              <p className="text-gray-500 text-center py-10">
                No events created yet.
              </p>
            )}
          </div>
        </>
      )}

      {subTab === "proposals" && (
        <div className="space-y-4">
          {proposals.map((prop) => (
            <div key={prop.id} className="border p-4 rounded-lg bg-yellow-50">
              <h4 className="font-bold">{prop.title}</h4>
              <p className="text-sm text-gray-600 mb-2">
                Proposed by User ID: {prop.createdById}
              </p>
              <p className="text-sm mb-4">{prop.description}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleProposalDecision(prop.id, "Approved")}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleProposalDecision(prop.id, "Rejected")}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {proposals.length === 0 && (
            <p className="text-gray-500 text-center py-10">
              No pending proposals.
            </p>
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

          {/* FILE UPLOAD */}
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

          <textarea
            placeholder="Write your content here..."
            required
            className="w-full p-2 border rounded h-32"
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
