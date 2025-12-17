import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, joinEvent, updateEvent } from "../API/EventAPI";
import { getPublicProfile } from "../API/ProfileAPI";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import toast from "react-hot-toast";

// Reusing the same Spinner for UI consistency across your portal
function Spinner({ size = "md" }) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-2 border-white/30 border-t-white`}
      ></div>
    </div>
  );
}

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
  const [isSubmitting, setIsSubmitting] = useState(false); // 🟢 Track update progress
  const [imgSrc, setImgSrc] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    imageUrl: "",
  });

  const fetchEvent = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data);
      setImgSrc(data.imageUrl || FALLBACK_IMAGE);

      setEditForm({
        title: data.title,
        description: data.description,
        eventDate: data.eventDate,
        location: data.location,
        imageUrl: data.imageUrl,
      });

      if (data.createdById) {
        try {
          const organizerData = await getPublicProfile(data.createdById);
          setOrganizer(organizerData);
        } catch (err) {
          console.warn("Organizer info missing");
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
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // 🟢 Prevent multiple clicks
    try {
      await updateEvent(id, editForm, user.id);
      toast.success("Event updated!");
      setShowEdit(false);
      fetchEvent(); // Refresh to show new data and new image
    } catch (error) {
      toast.error("Update failed. " + (error.response?.data || ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Max 2MB per image.");

    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditForm({ ...editForm, imageUrl: ev.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleJoinClick = async () => {
    if (!user) {
      toast.error("Please sign in.");
      setTimeout(() => navigate("/signin"), 1500);
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

  const isCreator = user && event && user.id === event.createdById;

  if (loading) return <LoadingScreen />;
  if (!event) return null;

  const eventDate = new Date(event.eventDate);

  return (
    <div className="min-h-screen bg-[#d5a07d] pb-12 fredoka">
      {/* HERO SECTION */}
      <div className="w-full h-64 md:h-96 bg-gray-200 relative">
        <img
          src={imgSrc}
          alt={event.title}
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
              <div className="flex gap-6 mt-2 opacity-90">
                <span>📅 {eventDate.toLocaleDateString()}</span>
                <span>📍 {event.location}</span>
              </div>
            </div>
            {isCreator && (
              <button
                onClick={() => setShowEdit(true)}
                className="bg-white text-indigo-900 px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-indigo-50 transition-transform hidden md:block"
              >
                Edit Event
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
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
                {organizer ? organizer.name || organizer.username : "NGO Admin"}
              </span>
            </p>
          </div>
        </div>

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
              className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all ${
                event.status === "Approved"
                  ? "bg-[#009e8c] hover:bg-teal-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {joining ? (
                <Spinner size="sm" />
              ) : event.status === "Approved" ? (
                "Join Event"
              ) : (
                "Registration Closed"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Edit Event</h2>
              <button
                onClick={() => setShowEdit(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* 🟢 Image Preview in Modal */}
              <div className="relative w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-4 border border-dashed border-gray-300">
                {editForm.imageUrl ? (
                  <img
                    src={editForm.imageUrl}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image Selected
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Change Event Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm block w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <input
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  required
                />
                <input
                  className="p-3 border rounded-lg"
                  placeholder="Location"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  required
                />
              </div>

              <textarea
                className="w-full p-3 border rounded-lg h-32"
                placeholder="Description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                required
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="px-5 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBadge({ label, value, icon }) {
  return (
    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs text-slate-400 uppercase font-bold">{label}</p>
        <p className="text-slate-700 font-semibold">{value}</p>
      </div>
    </div>
  );
}
