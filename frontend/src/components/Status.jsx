import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { getMyApplications, withdrawApplication } from "../API/AdoptionAPI";
import { getMyEvents, deleteEvent } from "../API/EventAPI";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function StatusBadge({ status }) {
  const map = {
    Pending: "bg-yellow-50 text-yellow-800",
    "Under Review": "bg-yellow-50 text-yellow-800",
    Approved: "bg-green-50 text-green-800",
    Rejected: "bg-red-50 text-red-800",
    Withdrawn: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
        map[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

export default function Status({ isAdmin = false, onBack } = {}) {
  const { user } = useAuth();
  const navigate = useNavigate(); // 2. Initialize navigate
  const [adoptions, setAdoptions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [tab, setTab] = useState("adoptions");

  // Fetch Data on Mount
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [myApps, myEvts] = await Promise.all([
          getMyApplications(user.id),
          getMyEvents(user.id),
        ]);
        setAdoptions(myApps);
        setEvents(myEvts);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load status data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Actions
  const handleWithdrawApp = async (id) => {
    if (!window.confirm("Are you sure you want to withdraw this application?"))
      return;
    try {
      await withdrawApplication(id, user.id);
      toast.success("Application withdrawn.");
      setAdoptions((prev) => prev.filter((a) => a.applicationId !== id));
    } catch (err) {
      toast.error("Failed to withdraw.");
    }
  };

  const handleCancelEvent = async (e, id) => {
    e.stopPropagation(); // Prevent navigating to detail page when clicking cancel
    if (!window.confirm("Cancel this proposal?")) return;
    try {
      await deleteEvent(id, user.id);
      toast.success("Proposal cancelled.");
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      toast.error("Failed to cancel.");
    }
  };

  // Filter Logic
  const filteredAdoptions = useMemo(() => {
    return adoptions.filter((a) => {
      const q = search.trim().toLowerCase();
      if (filter !== "All" && a.status !== filter) return false;
      if (!q) return true;
      return (
        a.petName?.toLowerCase().includes(q) ||
        a.applicationId.toLowerCase().includes(q)
      );
    });
  }, [adoptions, search, filter]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const q = search.trim().toLowerCase();
      if (filter !== "All" && e.status !== filter) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)
      );
    });
  }, [events, search, filter]);

  return (
    <div className="py-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#202142]">
          My Activity Status
        </h2>

        {onBack && (
          <button
            onClick={onBack}
            className="text-sm text-indigo-600 hover:text-indigo-800 md:hidden"
          >
            &larr; Back
          </button>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setTab("adoptions")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === "adoptions"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Adoptions
          </button>
          <button
            onClick={() => setTab("events")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === "events"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Proposals
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-gray-50 p-3 rounded-lg">
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 p-2 rounded border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 rounded border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Loading your data...
        </div>
      ) : (
        <div className="space-y-4">
          {/* ADOPTIONS LIST */}
          {tab === "adoptions" && (
            <>
              {filteredAdoptions.length === 0 ? (
                <p className="text-center text-gray-400 py-10">
                  No adoption applications found.
                </p>
              ) : (
                filteredAdoptions.map((a) => (
                  <div
                    key={a.applicationId}
                    className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-100 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🐾</span>
                        <div>
                          <h4 className="font-bold text-slate-800">
                            {a.petName}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Applied on:{" "}
                            {new Date(a.submissionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={a.status} />
                      {a.status === "Pending" && (
                        <button
                          onClick={() => handleWithdrawApp(a.applicationId)}
                          className="text-xs font-bold text-red-500 border border-red-100 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* EVENTS LIST (UPDATED) */}
          {tab === "events" && (
            <>
              {filteredEvents.length === 0 ? (
                <p className="text-center text-gray-400 py-10">
                  No event proposals found.
                </p>
              ) : (
                filteredEvents.map((e) => (
                  <div
                    key={e.id}
                    // 3. Make clickable
                    onClick={() => navigate(`/event/${e.id}`)}
                    className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📅</span>
                        <div>
                          <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {e.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Event Date:{" "}
                            {new Date(e.eventDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={e.status} />
                      {e.status === "Pending" && (
                        <button
                          onClick={(ev) => handleCancelEvent(ev, e.id)} // Pass event to stop propagation
                          className="text-xs font-bold text-red-500 border border-red-100 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors z-10 relative"
                        >
                          Cancel
                        </button>
                      )}
                      {e.status === "Approved" && (
                        <span className="text-gray-400 text-sm">›</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
