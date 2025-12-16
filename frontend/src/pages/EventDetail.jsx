import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, joinEvent, updateEvent } from "../API/EventAPI";
import { getPublicProfile } from "../API/ProfileAPI"; // <--- Updated Import
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import toast from "react-hot-toast";

const FALLBACK_IMAGE =
  "https://placehold.co/1200x600/e2e8f0/475569?text=Event+Image&font=montserrat";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  // Edit Mode State
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({});

  const fetchEvent = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data);
      setImgSrc(data.imageUrl || FALLBACK_IMAGE);

      // Initialize edit form
      setEditForm({
        title: data.title,
        description: data.description,
        eventDate: data.eventDate,
        location: data.location,
        imageUrl: data.imageUrl,
      });

      // Get Organizer Details (Safely)
      const organizerId = data.createdById;
      if (organizerId) {
        try {
          const organizerData = await getPublicProfile(organizerId);
          setOrganizer(organizerData);
        } catch (err) {
          console.warn("Organizer info missing or private");
        }
      }
    } catch (error) {
      toast.error("Failed to load event.");
      navigate("/event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id, navigate]);

  const handleJoinClick = async () => {
    if (!user) {
      toast.error("Please sign in.");
      setTimeout(() => navigate("/signin"), 1500);
      return;
    }
    if (event.participantIds && event.participantIds.includes(user.id)) {
      toast.success("Already joined!");
      return;
    }
    setJoining(true);
    try {
      await joinEvent(event.id, user.id);
      toast.success("Joined successfully!");
      fetchEvent();
    } catch (error) {
      toast.error("Failed to join.");
    } finally {
      setJoining(false);
    }
  };

  // --- EDIT HANDLERS ---
  const isCreator = user && event && user.id === event.createdById;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(id, editForm, user.id);
      toast.success("Event updated!");
      setShowEdit(false);
      fetchEvent();
    } catch (error) {
      toast.error("Update failed. " + (error.response?.data || ""));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setEditForm({ ...editForm, imageUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  if (loading) return <LoadingScreen />;
  if (!event) return null;

  const eventDate = new Date(event.eventDate);

  return (
    <div className="min-h-screen bg-[#d5a07d] pb-12 fredoka">
      {/* HEADER / HERO */}
      <div className="w-full h-64 md:h-96 bg-gray-200 relative">
        <img
          src={imgSrc}
          alt={event.title}
          onError={(e) => {
            e.target.onerror = null;
            setImgSrc(FALLBACK_IMAGE);
          }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold hover:bg-white/30 transition"
        >
          ← Back
        </button>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
          <div className="max-w-7xl mx-auto flex justify-between items-end">
            <div>
              <span className="bg-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase mb-2 inline-block">
                {event.status}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold font-gloria">
                {event.title}
              </h1>
              <div className="flex gap-6 mt-2 text-sm md:text-base font-medium opacity-90">
                <span>📅 {eventDate.toLocaleDateString()}</span>
                <span>
                  ⏰{" "}
                  {eventDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>📍 {event.location}</span>
              </div>
            </div>

            {/* EDIT BUTTON (Only for Creator) */}
            {isCreator && (
              <button
                onClick={() => setShowEdit(true)}
                className="bg-white text-indigo-900 px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-indigo-50 transition-transform hover:-translate-y-1 hidden md:block"
              >
                Edit Event
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mobile Edit Button */}
          {isCreator && (
            <button
              onClick={() => setShowEdit(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold md:hidden"
            >
              Edit Event
            </button>
          )}

          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">About</h2>
            <p className="text-slate-600 whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-900 mb-2">
              Organizer
            </h3>
            <p className="text-indigo-700">
              Organized by{" "}
              <span className="font-bold">
                {organizer ? organizer.name || organizer.username : "Unknown"}
              </span>
            </p>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-lg sticky top-24">
            <div className="text-center mb-6">
              <p className="text-sm font-bold text-slate-400 uppercase">
                Going
              </p>
              <p className="text-4xl font-extrabold text-slate-800">
                {event.participantIds?.length || 0}
              </p>
            </div>
            <button
              onClick={handleJoinClick}
              disabled={joining || event.status !== "Approved"}
              className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${
                event.status === "Approved"
                  ? "bg-[#009e8c] hover:bg-teal-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {joining
                ? "Joining..."
                : event.status === "Approved"
                ? "Join Event"
                : "Event Ended"}
            </button>

            {user && event.participantIds?.includes(user.id) && (
              <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-xl text-center font-bold text-sm border border-green-100">
                ✅ You are going!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Edit Event
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                className="w-full p-3 border rounded-lg"
                placeholder="Title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  className="p-3 border rounded-lg"
                  value={
                    editForm.eventDate
                      ? new Date(editForm.eventDate).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditForm({ ...editForm, eventDate: e.target.value })
                  }
                />
                <input
                  className="p-3 border rounded-lg"
                  placeholder="Location"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-slate-500"
              />
              <textarea
                className="w-full p-3 border rounded-lg h-32"
                placeholder="Description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="px-5 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
