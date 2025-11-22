import React, { useState, useMemo } from "react";

const sampleAdoptions = [
  {
    id: "A-001",
    petName: "Buddy",
    applicantName: "Siti",
    appliedOn: "2025-10-05",
    status: "Pending",
    notes: "Has a fenced yard. Home visit pending.",
  },
  {
    id: "A-002",
    petName: "Luna",
    applicantName: "Rahim",
    appliedOn: "2025-09-20",
    status: "Approved",
    notes: "Approved by volunteer team.",
  },
  {
    id: "A-003",
    petName: "Milo",
    applicantName: "Aisha",
    appliedOn: "2025-10-22",
    status: "Rejected",
    notes: "Not enough experience with special-needs dogs.",
  },
];

const sampleEvents = [
  {
    id: "E-101",
    title: "Weekend Adoption Drive - Central Park",
    proposer: "NGO Happy Paws",
    submittedOn: "2025-10-18",
    status: "Under Review",
    attendeesEstimate: 150,
    notes: "Requesting tables, PA system",
  },
  {
    id: "E-102",
    title: "Fundraising Bake Sale",
    proposer: "Volunteer Group A",
    submittedOn: "2025-10-10",
    status: "Approved",
    attendeesEstimate: 60,
    notes: "",
  },
];

function StatusBadge({ status }) {
  const map = {
    Pending: "bg-yellow-50 text-yellow-800",
    "Under Review": "bg-yellow-50 text-yellow-800",
    Approved: "bg-green-50 text-green-800",
    Rejected: "bg-red-50 text-red-800",
    Withdrawn: "bg-gray-100 text-gray-700",
    "Needs Info": "bg-orange-50 text-orange-800",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        map[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

export default function Status({ isAdmin = false } = {}) {
  const [adoptions, setAdoptions] = useState(sampleAdoptions);
  const [events, setEvents] = useState(sampleEvents);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [tab, setTab] = useState("adoptions"); // 'adoptions' | 'events'

  const filteredAdoptions = useMemo(() => {
    return adoptions.filter((a) => {
      const q = search.trim().toLowerCase();
      if (filter !== "All" && a.status !== filter) return false;
      if (!q) return true;
      return (
        a.petName.toLowerCase().includes(q) ||
        a.applicantName.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      );
    });
  }, [adoptions, search, filter]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const q = search.trim().toLowerCase();
      if (filter !== "All" && e.status !== filter) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.proposer.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
      );
    });
  }, [events, search, filter]);

  const approveAdoption = (id) => {
    setAdoptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p))
    );
  };
  const rejectAdoption = (id) => {
    setAdoptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Rejected" } : p))
    );
  };
  const withdrawApplication = (id) => {
    setAdoptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Withdrawn" } : p))
    );
  };

  const approveEvent = (id) => {
    setEvents((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p))
    );
  };
  const rejectEvent = (id) => {
    setEvents((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Rejected" } : p))
    );
  };

  const viewAdoption = (id) => {
    alert("Open adoption details: " + id);
  };
  const viewEvent = (id) => {
    alert("Open event details: " + id);
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#202142]">My Status</h2>

        <div className="flex gap-2 items-center">
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setTab("adoptions")}
              className={`px-3 py-2 rounded-md text-sm ${
                tab === "adoptions"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-700 border border-indigo-100"
              }`}
            >
              Adoption Applications
            </button>
            <button
              onClick={() => setTab("events")}
              className={`px-3 py-2 rounded-md text-sm ${
                tab === "events"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-700 border border-indigo-100"
              }`}
            >
              Event Proposals
            </button>
          </div>
        </div>
      </div>

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by pet, applicant, title or ID..."
            className="w-full sm:w-80 p-2 rounded-lg border border-indigo-100 bg-white text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 rounded-lg border border-indigo-100 bg-white text-sm"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
            <option value="Under Review">Under Review</option>
            <option value="Needs Info">Needs Info</option>
          </select>
        </div>

        <div className="sm:hidden flex gap-2">
          <button
            onClick={() => setTab("adoptions")}
            className={`px-3 py-2 rounded-md text-sm ${
              tab === "adoptions"
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-700 border border-indigo-100"
            }`}
          >
            Adoptions
          </button>
          <button
            onClick={() => setTab("events")}
            className={`px-3 py-2 rounded-md text-sm ${
              tab === "events"
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-700 border border-indigo-100"
            }`}
          >
            Events
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {tab === "adoptions" && (
          <section>
            <h3 className="text-xl font-semibold mb-4">
              Adoption applications
            </h3>
            <div className="grid gap-4">
              {filteredAdoptions.length === 0 && (
                <div className="p-4 bg-white rounded-lg border border-indigo-50 text-sm text-gray-600">
                  No adoption applications match your search/filter.
                </div>
              )}

              {filteredAdoptions.map((a) => (
                <div
                  key={a.id}
                  className="p-4 bg-white rounded-lg border border-indigo-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                        {a.petName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {a.petName}{" "}
                          <span className="text-sm text-gray-500">
                            ({a.id})
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Applicant: {a.applicantName} — Applied: {a.appliedOn}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-700">{a.notes}</div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-3">
                    <StatusBadge status={a.status} />

                    <div className="flex gap-2">
                      <button
                        onClick={() => viewAdoption(a.id)}
                        className="px-3 py-1 rounded-md text-sm bg-indigo-50 text-indigo-700"
                      >
                        View
                      </button>

                      {a.status === "Pending" && (
                        <button
                          onClick={() => withdrawApplication(a.id)}
                          className="px-3 py-1 rounded-md text-sm bg-white border border-indigo-100 text-indigo-700"
                        >
                          Withdraw
                        </button>
                      )}

                      {isAdmin && a.status === "Pending" && (
                        <>
                          <button
                            onClick={() => approveAdoption(a.id)}
                            className="px-3 py-1 rounded-md text-sm bg-green-50 text-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectAdoption(a.id)}
                            className="px-3 py-1 rounded-md text-sm bg-red-50 text-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "events" && (
          <section>
            <h3 className="text-xl font-semibold mb-4">Event proposals</h3>
            <div className="grid gap-4">
              {filteredEvents.length === 0 && (
                <div className="p-4 bg-white rounded-lg border border-indigo-50 text-sm text-gray-600">
                  No event proposals match your search/filter.
                </div>
              )}

              {filteredEvents.map((e) => (
                <div
                  key={e.id}
                  className="p-4 bg-white rounded-lg border border-indigo-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                        E
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {e.title}{" "}
                          <span className="text-sm text-gray-500">
                            ({e.id})
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Proposer: {e.proposer} — Submitted: {e.submittedOn}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-700">
                      {e.notes || (
                        <span className="text-gray-400">No notes provided</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-3">
                    <StatusBadge status={e.status} />
                    <div className="text-sm text-gray-600">
                      Est. attendees: {e.attendeesEstimate}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => viewEvent(e.id)}
                        className="px-3 py-1 rounded-md text-sm bg-indigo-50 text-indigo-700"
                      >
                        View
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => approveEvent(e.id)}
                            className="px-3 py-1 rounded-md text-sm bg-green-50 text-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectEvent(e.id)}
                            className="px-3 py-1 rounded-md text-sm bg-red-50 text-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {!isAdmin &&
                        (e.status === "Under Review" ||
                          e.status === "Needs Info") && (
                          <button className="px-3 py-1 rounded-md text-sm bg-white border border-indigo-100 text-indigo-700">
                            Edit / Update
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-8 p-4 text-sm text-gray-600 bg-white rounded-lg border border-indigo-50">
        <strong>Legend:</strong> Pending/Under Review — waiting for staff.
        Approved — everything good. Rejected/Withdrawn — application closed.
      </div>
    </div>
  );
}
