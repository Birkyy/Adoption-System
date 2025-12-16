import React, { useState, useEffect } from "react";
import { getVolunteerListings, applyForVolunteer } from "../API/VolunteerAPI";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Volunteer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVolunteerListings()
      .then(setListings)
      .catch(() => toast.error("Failed to load listings"))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (id) => {
    if (!user) {
      toast.error("Please login to apply.");
      setTimeout(() => navigate("/signin"), 1500);
      return;
    }

    try {
      await applyForVolunteer(id, user.id);
      toast.success("Application sent! The NGO will contact you directly.");
    } catch (error) {
      toast.error("Failed to apply or already applied.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 fredoka pb-12">
      <Toaster position="top-right" />
      {loading && <LoadingScreen />}

      {/* Hero */}
      <div className="bg-[#009e8c] py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-gloria">
          Become a Volunteer
        </h1>
        <p className="text-teal-50 text-lg max-w-2xl mx-auto">
          Lend a hand, change a paw-sitive life. Browse opportunities below and
          apply to help out at local shelters.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="grid gap-6">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-800">
                    {item.title}
                  </h3>
                  <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {item.location || "On-site"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="text-xs text-gray-400 font-medium">
                  Requirements:{" "}
                  <span className="text-slate-600">
                    {item.skillsRequired || "None specified"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleApply(item.id)}
                disabled={user && item.applicantIds?.includes(user.id)}
                className={`px-6 py-3 rounded-xl font-bold text-white transition-all transform hover:-translate-y-1 shadow-md ${
                  user && item.applicantIds?.includes(user.id)
                    ? "bg-green-500 cursor-default"
                    : "bg-[#009e8c] hover:bg-teal-700"
                }`}
              >
                {user && item.applicantIds?.includes(user.id)
                  ? "Applied ✓"
                  : "Apply Now"}
              </button>
            </div>
          ))}

          {!loading && listings.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl text-gray-500">
              No volunteer opportunities available right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
