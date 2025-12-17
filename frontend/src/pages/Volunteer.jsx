import React, { useState, useEffect } from "react";
import { getVolunteerListings, applyForVolunteer } from "../API/VolunteerAPI";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Debounce Hook (Recommendation: Move to src/hooks/useDebounce.js for better reusability)
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Volunteer() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- STATE ---
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // Track which item is expanded

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  // Search
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params = { page, pageSize };
        if (debouncedSearch) params.search = debouncedSearch;

        const response = await getVolunteerListings(params);
        const body = response && response.data ? response.data : response;

        if (body.Data || body.data) {
          setListings(body.Data || body.data || []);
          setTotalPages(body.TotalPages || body.totalPages || 1);
        } else if (Array.isArray(body)) {
          setListings(body);
          setTotalPages(1);
        } else {
          setListings([]);
        }
      } catch (error) {
        toast.error("Failed to load listings");
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [page, debouncedSearch]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleApply = async (e, id) => {
    e.stopPropagation(); // Prevent the card from collapsing/expanding when clicking the button

    if (!user) {
      toast.error("Please login to apply.");
      setTimeout(() => navigate("/signin"), 1500);
      return;
    }

    try {
      await applyForVolunteer(id, user.id);
      toast.success("Application sent! The NGO will contact you directly.");
      setListings((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, applicantIds: [...(item.applicantIds || []), user.id] }
            : item
        )
      );
    } catch (error) {
      toast.error("Failed to apply or already applied.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setExpandedId(null); // Reset expansion on page change
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 fredoka pb-12">
      {loading && <LoadingScreen />}

      {/* Hero */}
      <div className="bg-[#009e8c] py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-gloria">
          Become a Volunteer
        </h1>
        <p className="text-teal-50 text-lg max-w-2xl mx-auto mb-8">
          Lend a hand, change a paw-sitive life. Click an opportunity to see
          more details.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Search opportunities..."
            className="w-full py-3 pl-5 pr-12 rounded-full shadow-lg text-slate-700 outline-none focus:ring-4 focus:ring-teal-300/40 transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <div className="absolute right-2 top-1.5 p-1.5 bg-[#00897b] rounded-full text-white">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid gap-4">
          {listings.map((item) => {
            const isExpanded = expandedId === item.id;
            const hasApplied = user && item.applicantIds?.includes(user.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer overflow-hidden ${
                  isExpanded ? "ring-2 ring-teal-500 shadow-lg" : ""
                }`}
              >
                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-800">
                        {item.title}
                      </h3>
                      <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        {item.location || "On-site"}
                      </span>
                    </div>
                    {!isExpanded && (
                      <p className="text-gray-400 text-sm mt-1">
                        Click to view details...
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => handleApply(e, item.id)}
                      disabled={hasApplied}
                      className={`px-6 py-2 rounded-xl font-bold text-white transition-all transform hover:-translate-y-0.5 shadow-sm text-sm ${
                        hasApplied
                          ? "bg-green-500 cursor-default"
                          : "bg-[#009e8c] hover:bg-teal-700"
                      }`}
                    >
                      {hasApplied ? "Applied ✓" : "Apply Now"}
                    </button>
                    {/* Visual Indicator for Expansion */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Expanded Section */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-50 bg-gray-50/50 animate-fadeIn">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-1">
                          Description
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-1">
                          Requirements
                        </h4>
                        <p className="text-slate-600 text-sm bg-white p-3 rounded-lg border border-gray-100">
                          {item.skillsRequired ||
                            "No specific skills specified. Just a big heart!"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {!loading && listings.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl text-gray-500 shadow-sm">
              No volunteer opportunities found matching "{search}".
            </div>
          )}
        </div>

        {/* PAGINATION CONTROLS */}
        {!loading && listings.length > 0 && (
          <div className="mt-8 flex justify-center items-center gap-4 pb-8">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <span className="text-sm font-bold text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-md bg-[#009e8c] text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
