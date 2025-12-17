import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetById, updatePet } from "../API/PetAPI";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import toast from "react-hot-toast";

// --- SHARED SPINNER ---
function Spinner({ size = "md" }) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div className="flex justify-center items-center p-2">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-teal-100 border-t-[#009e8c]`}
      ></div>
    </div>
  );
}

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  // Edit State
  const [showEdit, setShowEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🟢 For button feedback
  const [editForm, setEditForm] = useState({
    name: "",
    species: "Dog",
    breed: "",
    age: "",
    gender: "Male",
    description: "",
    status: "Available",
    photos: [], // 🟢 Track the array for editing
    imageUrl: "",
  });

  const fetchPet = async () => {
    try {
      const data = await getPetById(id);
      setPet(data);

      const firstImg =
        data.photos && data.photos.length > 0
          ? data.photos[0]
          : data.imageUrl || "https://via.placeholder.com/400";

      setActiveImage(firstImg);

      // Initialize Edit Form with existing data
      setEditForm({
        name: data.name,
        species: data.species,
        breed: data.breed,
        age: data.age,
        gender: data.gender,
        description: data.description,
        status: data.status,
        photos: data.photos || [], // 🟢 Sync full photo list
        imageUrl: data.imageUrl,
      });
    } catch (error) {
      toast.error("Failed to load pet details.");
      navigate("/adopt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPet();
  }, [id]);

  // 🟢 Image Management for Edit Modal
  const handleEditImages = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 2 * 1024 * 1024);

    if (validFiles.length < files.length) {
      toast.error("Some images were skipped (Max 2MB).");
    }

    const promises = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((newImages) => {
      setEditForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newImages], // Append new photos to the list
      }));
    });
  };

  const removePhotoFromEdit = (indexToRemove) => {
    setEditForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 🟢 Synchronize thumbnail (imageUrl) with the first photo in the array
    const updatedPayload = {
      ...editForm,
      imageUrl:
        editForm.photos.length > 0 ? editForm.photos[0] : editForm.imageUrl,
    };

    try {
      // Calling updatePet as defined in your PetAPI.js
      await updatePet(id, updatedPayload, user.id);
      toast.success("Pet details updated!");
      setShowEdit(false);
      fetchPet(); // Refresh the main view
    } catch (error) {
      toast.error("Failed to update pet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdoptClick = () => {
    if (!user) {
      toast.error("Please sign in to apply for adoption.");
      setTimeout(() => navigate("/signin"), 1500);
      return;
    }
    if (user.userRole === "NGO") {
      toast.error("NGO accounts cannot adopt pets.");
      return;
    }
    navigate(`/adopt/apply/${pet.petId || pet.id}`);
  };

  const isOwner = user && pet && user.id === pet.ngoId;

  if (loading) return <LoadingScreen />;
  if (!pet)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Pet not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#d5a07d] pb-12 px-4 sm:px-6 lg:px-8 fredoka">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 md:p-10 rounded-3xl shadow-xl">
        {/* HEADER SECTION INSIDE CARD */}
        <div className="col-span-full flex justify-between items-center border-b border-gray-100 mb-4 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-[#009e8c] font-bold text-lg flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>

          {isOwner && (
            <button
              onClick={() => setShowEdit(true)}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-colors text-sm"
            >
              Edit Pet Profile
            </button>
          )}
        </div>

        {/* LEFT: Image Gallery */}
        <div className="space-y-4">
          <div className="w-full h-96 md:h-[500px] rounded-2xl overflow-hidden bg-gray-100 relative shadow-inner">
            <img
              src={activeImage}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-4 left-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                pet.status === "Available"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {pet.status}
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {pet.photos?.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(photo)}
                className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === photo
                    ? "border-[#009e8c] scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={photo}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2 font-gloria">
            {pet.name}
          </h1>
          <p className="text-xl text-slate-500 font-medium mb-6">
            {pet.breed} • {pet.age}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <InfoBadge label="Gender" value={pet.gender} icon="⚤" />
            <InfoBadge label="Species" value={pet.species} icon="🐾" />
          </div>

          <div className="prose text-slate-600 leading-relaxed mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              About {pet.name}
            </h3>
            <p className="whitespace-pre-line">
              {pet.description || "No description provided."}
            </p>
          </div>

          {!isOwner && (
            <button
              onClick={handleAdoptClick}
              disabled={pet.status !== "Available"}
              className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${
                pet.status === "Available"
                  ? "bg-[#009e8c] hover:bg-teal-700 shadow-teal-200 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {pet.status === "Available" ? "Apply to Adopt" : "Not Available"}
            </button>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Edit Pet Profile
              </h2>
              <button
                onClick={() => setShowEdit(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Photo Management Section */}
              <div className="bg-slate-50 p-4 rounded-xl border">
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Gallery Management
                </label>
                <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                  {editForm.photos?.map((p, idx) => (
                    <div key={idx} className="relative shrink-0">
                      <img
                        src={p}
                        className="w-20 h-20 object-cover rounded-lg border bg-white"
                        alt=""
                      />
                      <button
                        type="button"
                        onClick={() => removePhotoFromEdit(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow-lg border-2 border-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleEditImages}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="p-3 border rounded-lg"
                  placeholder="Name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  required
                />
                <input
                  className="p-3 border rounded-lg"
                  placeholder="Breed"
                  value={editForm.breed}
                  onChange={(e) =>
                    setEditForm({ ...editForm, breed: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="p-3 border rounded-lg"
                  placeholder="Age"
                  value={editForm.age}
                  onChange={(e) =>
                    setEditForm({ ...editForm, age: e.target.value })
                  }
                  required
                />
                <select
                  className="p-3 border rounded-lg"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                >
                  <option value="Available">Available</option>
                  <option value="Adopted">Adopted</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <textarea
                className="w-full p-3 border rounded-lg h-32"
                placeholder="Tell us more about this pet..."
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <Spinner size="sm" /> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBadge({ label, value, icon }) {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
      <span className="text-3xl bg-white w-12 h-12 flex items-center justify-center rounded-xl shadow-sm">
        {icon}
      </span>
      <div>
        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
          {label}
        </p>
        <p className="text-slate-700 font-bold text-lg">{value}</p>
      </div>
    </div>
  );
}
