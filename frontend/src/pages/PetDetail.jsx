import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetById, updatePet } from "../API/PetAPI";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import toast from "react-hot-toast";

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  // Edit State
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({});

  const fetchPet = async () => {
    try {
      const data = await getPetById(id);
      setPet(data);
      const firstImg =
        data.photos && data.photos.length > 0
          ? data.photos[0]
          : data.imageUrl || "https://via.placeholder.com/400";
      setActiveImage(firstImg);

      setEditForm({
        name: data.name,
        species: data.species,
        breed: data.breed,
        age: data.age,
        gender: data.gender,
        description: data.description,
        status: data.status,
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePet(id, editForm, user.id);
      toast.success("Pet details updated!");
      setShowEdit(false);
      fetchPet();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update pet.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Max 2MB.");
    const reader = new FileReader();
    reader.onload = (ev) =>
      setEditForm({ ...editForm, imageUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  if (loading) return <LoadingScreen />;
  if (!pet)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Pet not found.
      </div>
    );

  return (
    // Added pt-12 here to create space at the top since we moved the header inside
    <div className="min-h-screen bg-[#d5a07d] pb-12 px-4 sm:px-6 lg:px-8 fredoka">
      {/* 🟢 CARD CONTAINER */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 md:p-10 rounded-3xl shadow-xl">
        {/* 🟢 NEW HEADER SECTION INSIDE CARD (Back & Edit Buttons) */}
        {/* col-span-full makes it span the entire width of the grid */}
        <div className="col-span-full flex justify-between items-center border-b border-gray-100">
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
              Edit Details
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
          {pet.photos && pet.photos.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {pet.photos.map((photo, idx) => (
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
          )}
        </div>

        {/* RIGHT: Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2 font-gloria">
              {pet.name}
            </h1>
            <p className="text-xl text-slate-500 font-medium">
              {pet.breed} • {pet.age}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <InfoBadge label="Gender" value={pet.gender} icon="⚤" />
            <InfoBadge label="Species" value={pet.species} icon="🐾" />
            <InfoBadge label="Age" value={pet.age} icon="🎂" />
          </div>

          <div className="prose text-slate-600 leading-relaxed mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              About {pet.name}
            </h3>
            <p className="whitespace-pre-line">
              {pet.description || "No description provided."}
            </p>
          </div>

          {/* Action Button */}
          {!isOwner && (
            <button
              onClick={handleAdoptClick}
              disabled={pet.status !== "Available"}
              className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${
                pet.status === "Available"
                  ? "bg-[#009e8c] hover:bg-teal-700 hover:shadow-teal-200 cursor-pointer"
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
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">Edit Pet</h2>
              <button
                onClick={() => setShowEdit(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Update Main Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-slate-500"
                />
              </div>
              <textarea
                className="w-full p-3 border rounded-lg h-32"
                placeholder="Description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700"
              >
                Save Changes
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
    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs text-slate-400 uppercase font-bold">{label}</p>
        <p className="text-slate-700 font-semibold">{value}</p>
      </div>
    </div>
  );
}
