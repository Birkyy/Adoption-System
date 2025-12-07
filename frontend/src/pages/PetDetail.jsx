import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetById } from "../API/PetAPI";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import toast, { Toaster } from "react-hot-toast";

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const data = await getPetById(id);
        setPet(data);
        // Set initial active image
        const firstImg =
          data.photos && data.photos.length > 0
            ? data.photos[0]
            : data.imageUrl || "https://via.placeholder.com/400";
        setActiveImage(firstImg);
      } catch (error) {
        toast.error("Failed to load pet details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  const handleAdoptClick = () => {
    if (!user) {
      toast.error("Please sign in to apply.");
      setTimeout(() => navigate("/signin"), 1500);
      return;
    }
    if (user.userRole === "NGO") {
      toast.error("NGO accounts cannot adopt pets.");
      return;
    }

    // Navigate to the new form!
    navigate(`/adopt/apply/${pet.petId || pet.id}`);
  };

  if (loading) return <LoadingScreen />;
  if (!pet)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Pet not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8 fredoka">
      <Toaster position="top-center" />

      {/* Breadcrumb / Back */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-[#009e8c] font-medium flex items-center gap-2 transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-3xl shadow-xl">
        {/* LEFT: Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
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

          {/* Thumbnails (Only if multiple photos exist) */}
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
              {pet.breed} • {pet.age} years old
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <InfoBadge label="Gender" value={pet.gender} icon="⚤" />
            <InfoBadge label="Species" value={pet.species} icon="🐾" />
            <InfoBadge label="Age" value={`${pet.age} yrs`} icon="🎂" />
            <InfoBadge
              label="ID"
              value={`#${pet.petId?.substring(pet.petId.length - 6)}`}
              icon="🆔"
            />
          </div>

          <div className="prose text-slate-600 leading-relaxed mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              About {pet.name}
            </h3>
            <p>
              {pet.description || "No description provided by the shelter yet."}
            </p>
          </div>

          {/* NGO Info (Optional) */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-[#009e8c] rounded-full flex items-center justify-center text-white font-bold">
              NGO
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">
                Managed by
              </p>
              <p className="text-slate-800 font-medium">
                Partner NGO #{pet.ngoId?.substring(0, 8)}
              </p>
            </div>
          </div>

          {/* Action Button */}
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
        </div>
      </div>
    </div>
  );
}

// Simple Helper Component
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
