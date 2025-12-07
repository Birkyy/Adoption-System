import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetById } from "../API/PetAPI";
import { submitAdoptionApplication } from "../API/AdoptionAPI";
import { useAuth } from "../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import LoadingScreen from "../components/LoadingScreen";

export default function AdoptionForm() {
  const { id } = useParams(); // Pet ID from URL
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);

  // 1. Fetch Pet Details on Mount
  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to adopt.");
      navigate("/signin");
      return;
    }

    const fetchPet = async () => {
      try {
        const data = await getPetById(id);
        setPet(data);
      } catch (error) {
        toast.error("Could not load pet details.");
        navigate("/adopt");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id, user, navigate]);

  // 2. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the terms.");
      return;
    }

    setSubmitting(true);

    const payload = {
      petId: pet.petId || pet.id,
      applicantId: user.id,
      // --- FIX: Send the NgoId ---
      // Even though backend can find it, the model validation requires it to be present in the request
      ngoId: pet.ngoId,
      message: message,
    };

    try {
      await submitAdoptionApplication(payload);
      toast.success("Application submitted successfully!");

      // Redirect to home or a success page after a delay
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.errors) {
        // If backend returns validation errors (like Missing NgoId), show them
        const errorMsg = JSON.stringify(error.response.data.errors);
        toast.error(`Validation Error: ${errorMsg}`);
      } else if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data}`);
      } else {
        toast.error("Failed to submit application.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!pet) return null;

  // Fallback image logic
  const petImage =
    pet.photos && pet.photos.length > 0
      ? pet.photos[0]
      : pet.imageUrl || "https://via.placeholder.com/150";

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8 fredoka">
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-5">
        {/* LEFT: Pet Preview */}
        <div className="md:col-span-2 bg-indigo-50 relative">
          <img
            src={petImage}
            alt={pet.name}
            className="w-full h-64 md:h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
            <h2 className="text-3xl font-bold text-white font-gloria">
              {pet.name}
            </h2>
            <p className="text-white/90 font-medium">
              {pet.breed} • {pet.age} yrs
            </p>
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className="md:col-span-3 p-8 md:p-12">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Adoption Application
            </h1>
            <p className="text-slate-500 text-sm">
              You are applying to adopt <strong>{pet.name}</strong> from our
              partner NGO. Please review your details and add a note.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Read-Only Applicant Info */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                Applicant
              </label>
              <div className="font-medium text-slate-700">{user.name}</div>
              <div className="text-sm text-slate-500">{user.email}</div>
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Why do you want to adopt {pet.name}?
              </label>
              <textarea
                required
                rows="4"
                placeholder="Tell us about your home, experience with pets, and why you are a great match..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009e8c] focus:border-transparent outline-none transition-all resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-5 h-5 text-[#009e8c] rounded focus:ring-[#009e8c] cursor-pointer"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label
                htmlFor="terms"
                className="text-sm text-slate-600 cursor-pointer leading-relaxed"
              >
                I certify that the information provided is accurate. I
                understand that submitting this application does not guarantee
                adoption.
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !agreed}
                className={`flex-[2] px-6 py-3 rounded-xl text-white font-bold shadow-lg transition-all transform hover:-translate-y-1 ${
                  submitting || !agreed
                    ? "bg-gray-300 cursor-not-allowed shadow-none transform-none"
                    : "bg-[#009e8c] hover:bg-teal-700 hover:shadow-teal-200"
                }`}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
