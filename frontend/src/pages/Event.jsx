import React, { useState, useEffect } from "react";
import {
  getPublicEvents,
  createEventProposal,
  getAllNgos,
} from "../API/EventAPI";
import { useAuth } from "../contexts/AuthContext";
import EventCard from "../components/EventCard";
import toast from "react-hot-toast";
import LoadingScreen from "../components/LoadingScreen";

// Debounce Hook to prevent API spam while typing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Event() {
  const { user } = useAuth();

  // --- STATE ---
  const [events, setEvents] = useState([]); // Only one list needed now
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  // Filters
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Debounce expensive text searches
  const debouncedSearch = useDebounce(search, 500);
  const debouncedLocation = useDebounce(locationFilter, 500);

  // Proposal Form
  const [proposal, setProposal] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    ngoId: "",
    imageUrl: "",
    documents: [],
  });

  // --- EFFECT 1: Load NGOs (Runs once) ---
  useEffect(() => {
    const loadNgos = async () => {
      try {
        const data = await getAllNgos();
        setNgos(data);
      } catch (err) {
        console.error("Failed to load NGOs", err);
      }
    };
    loadNgos();
  }, []);

  // --- EFFECT 2: Fetch Events (Runs on Filter/Page Change) ---
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          pageSize,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (debouncedLocation) params.location = debouncedLocation;
        if (dateFilter) params.date = dateFilter;

        const response = await getPublicEvents(params);

        // Handle the new Pagination Response format
        // Check for 'Data' (PascalCase) or 'data' (camelCase)
        const body = response && response.data ? response.data : response;
        const list = body.Data || body.data;

        if (list) {
          setEvents(list);
          setTotalPages(body.TotalPages || body.totalPages || 1);
        } else if (Array.isArray(body)) {
          // Fallback if backend is still sending a simple array
          setEvents(body);
          setTotalPages(1);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
        toast.error("Failed to load events.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, debouncedSearch, debouncedLocation, dateFilter]);

  // --- HANDLERS ---
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setLocationFilter("");
    setDateFilter("");
    setPage(1);
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);
    if (validFiles.length < files.length)
      toast.error("Some files skipped. Max size is 5MB.");

    const promises = validFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((base64Docs) => {
        setProposal((prev) => ({
          ...prev,
          documents: [...prev.documents, ...base64Docs],
        }));
        toast.success(`${base64Docs.length} document(s) attached.`);
      })
      .catch((err) => toast.error("Error reading documents."));
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to submit a proposal.");
      return;
    }

    if (user.userRole !== "NGO" && !proposal.ngoId) {
      toast.error("Please select a Partner NGO.");
      return;
    }

    const selectedDate = new Date(proposal.eventDate);
    const now = new Date();
    if (selectedDate <= now) {
      toast.error("Event date must be in the future.");
      return;
    }

    try {
      const payload = {
        ...proposal,
        createdById: user.id,
        ngoId: user.userRole === "NGO" ? user.id : proposal.ngoId,
        ProposalDocuments: proposal.documents,
      };

      await createEventProposal(payload);
      toast.success("Proposal submitted successfully!");
      setShowProposalForm(false);
      setProposal({
        title: "",
        description: "",
        eventDate: "",
        location: "",
        ngoId: "",
        imageUrl: "",
        documents: [],
      });

      // Refresh list by resetting page
      setPage(1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit proposal.");
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}

      <div className="min-h-screen bg-[#d5a07d] px-4 flex justify-center items-start pb-18 pt-10">
        <div className="flex flex-col lg:flex-row w-full max-w-7xl bg-white shadow-xl rounded-2xl overflow-hidden fredoka min-h-[80vh]">
          {/* FILTERS SIDEBAR */}
          <div className="w-full lg:w-[280px] shrink-0 py-6 border-r border-gray-100 bg-white">
            <div className="flex items-center border-b border-gray-200 pb-4 px-6">
              <h3 className="text-slate-900 text-lg font-bold">
                Filter Events
              </h3>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm text-red-500 font-semibold ml-auto cursor-pointer hover:underline"
              >
                Clear all
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h6 className="text-slate-900 text-sm font-bold mb-2">
                  Search
                </h6>
                <input
                  type="text"
                  placeholder="Keywords..."
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 outline-none focus:ring-2 focus:ring-teal-100"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1); // Reset to page 1 on filter
                  }}
                />
              </div>
              <div>
                <h6 className="text-slate-900 text-sm font-bold mb-2">
                  Location
                </h6>
                <input
                  type="text"
                  placeholder="City or Venue"
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 outline-none focus:ring-2 focus:ring-teal-100"
                  value={locationFilter}
                  onChange={(e) => {
                    setLocationFilter(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div>
                <h6 className="text-slate-900 text-sm font-bold mb-2">Date</h6>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 outline-none focus:ring-2 focus:ring-teal-100"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 p-6 bg-gray-50 flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 font-gloria">
                  Upcoming Events
                </h1>
                <p className="text-gray-500 mt-1">
                  Join our community events and help make a difference.
                </p>
              </div>
              <button
                onClick={() => setShowProposalForm(true)}
                className="mt-4 md:mt-0 px-6 py-3 bg-[#009e8c] text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 transition-transform transform hover:-translate-y-1"
              >
                + Propose Event
              </button>
            </div>

            {/* PROPOSAL MODAL */}
            {showProposalForm && (
              <div className="mb-8 bg-white p-6 rounded-2xl shadow-xl border border-teal-50 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    Submit Event Proposal
                  </h2>
                  <button
                    onClick={() => setShowProposalForm(false)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleProposalSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      placeholder="Event Title"
                      required
                      className="p-3 border rounded-lg bg-gray-50"
                      value={proposal.title}
                      onChange={(e) =>
                        setProposal({ ...proposal, title: e.target.value })
                      }
                    />
                    <input
                      type="datetime-local"
                      required
                      className="p-3 border rounded-lg bg-gray-50"
                      value={proposal.eventDate}
                      onChange={(e) =>
                        setProposal({ ...proposal, eventDate: e.target.value })
                      }
                    />
                  </div>

                  <input
                    placeholder="Location"
                    required
                    className="w-full p-3 border rounded-lg bg-gray-50"
                    value={proposal.location}
                    onChange={(e) =>
                      setProposal({ ...proposal, location: e.target.value })
                    }
                  />

                  {user?.userRole !== "NGO" && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                        Partner NGO
                      </label>
                      <select
                        required
                        className="w-full p-3 border rounded-lg bg-gray-50 text-slate-700"
                        value={proposal.ngoId}
                        onChange={(e) =>
                          setProposal({ ...proposal, ngoId: e.target.value })
                        }
                      >
                        <option value="">
                          -- Select an NGO to Partner With --
                        </option>
                        {ngos.length > 0 ? (
                          ngos.map((ngo) => (
                            <option key={ngo.id} value={ngo.id}>
                              {ngo.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Active NGOs found</option>
                        )}
                      </select>
                    </div>
                  )}

                  <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                    <label className="block text-sm font-bold text-gray-600 mb-1">
                      Attach Proposal Documents
                    </label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocumentUpload}
                      className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    {proposal.documents.length > 0 && (
                      <div className="mt-2 text-xs text-green-600 font-medium">
                        {proposal.documents.length} document(s) attached.
                      </div>
                    )}
                  </div>

                  <textarea
                    placeholder="Describe your event idea..."
                    required
                    rows="3"
                    className="w-full p-3 border rounded-lg bg-gray-50"
                    value={proposal.description}
                    onChange={(e) =>
                      setProposal({ ...proposal, description: e.target.value })
                    }
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowProposalForm(false)}
                      className="px-6 py-2 text-slate-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#009e8c] text-white rounded-lg hover:bg-teal-700 font-medium"
                    >
                      Submit Proposal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* EVENTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {!loading &&
                events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              {events.length === 0 && !loading && (
                <div className="col-span-full text-center py-20 text-gray-500">
                  <p className="text-xl">
                    No events found matching your filters.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-[#009e8c] hover:underline mt-2 font-bold"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* PAGINATION CONTROLS */}
            {!loading && events.length > 0 && (
              <div className="mt-auto flex justify-center items-center gap-4 pt-4 border-t border-gray-200">
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
      </div>
    </>
  );
}
