import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// 🟢 1. Import Admin functions
import {
  getPendingArticles,
  getAllArticles,
  updateArticleStatus,
  getPendingNgos,
  updateUserStatus,
  getAllEvents,
  updateEventStatus,
} from "../API/AdminAPI";

// 🟢 2. Import the User Fetcher from ProfileAPI (Since it works in ArticleDetail)
import { getUserById } from "../API/ProfileAPI";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.userRole !== "Admin") {
      toast.error("Access Denied");
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const [activeTab, setActiveTab] = useState("requests");
  const [subTab, setSubTab] = useState("articles");

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 fredoka">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-indigo-900">
              Admin Dashboard
            </h1>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Super Admin
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 border-b border-gray-200 mb-6">
          <TabButton
            label="Pending Approvals"
            isActive={activeTab === "requests"}
            onClick={() => {
              setActiveTab("requests");
              setSubTab("articles");
            }}
          />
          <TabButton
            label="Content Moderation"
            isActive={activeTab === "moderation"}
            onClick={() => {
              setActiveTab("moderation");
              setSubTab("all_articles");
            }}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
          {activeTab === "requests" && (
            <>
              <div className="flex space-x-2 mb-6">
                <SubTabButton
                  label="Pending Articles"
                  isActive={subTab === "articles"}
                  onClick={() => setSubTab("articles")}
                />
                <SubTabButton
                  label="NGO Requests"
                  isActive={subTab === "ngos"}
                  onClick={() => setSubTab("ngos")}
                />
              </div>
              {subTab === "articles" && <PendingArticlesTable />}
              {subTab === "ngos" && <PendingNgosTable />}
            </>
          )}

          {activeTab === "moderation" && (
            <>
              <div className="flex space-x-2 mb-6">
                <SubTabButton
                  label="All Articles"
                  isActive={subTab === "all_articles"}
                  onClick={() => setSubTab("all_articles")}
                />
                <SubTabButton
                  label="All Events"
                  isActive={subTab === "all_events"}
                  onClick={() => setSubTab("all_events")}
                />
              </div>
              {subTab === "all_articles" && <AllArticlesTable />}
              {subTab === "all_events" && <AllEventsTable />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 px-4 font-medium text-sm transition-colors relative ${
        isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>
      )}
    </button>
  );
}

function SubTabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        isActive
          ? "bg-indigo-100 text-indigo-700"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }) {
  const colors = {
    Published: "bg-green-100 text-green-800",
    Approved: "bg-green-100 text-green-800",
    Active: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-800",
    Completed: "bg-gray-200 text-gray-600",
  };
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-bold ${
        colors[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
      <p>{message}</p>
    </div>
  );
}

// --- PENDING ARTICLES ---
function PendingArticlesTable() {
  const [articles, setArticles] = useState([]);
  const [authorNames, setAuthorNames] = useState({});
  const [reviewArticle, setReviewArticle] = useState(null);

  useEffect(() => {
    getPendingArticles().then(async (data) => {
      setArticles(data);
      // Collect IDs
      const uniqueIds = [...new Set(data.map((a) => a.authorId))];

      const names = {};
      await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            // 🟢 Fetch using ProfileAPI
            const u = await getUserById(id);
            // 🟢 Fallback Logic: Name -> Username -> "Unknown"
            names[id] = u.name || u.username || "Unknown User";
          } catch (err) {
            console.error(`Failed to fetch user ${id}`, err);
            names[id] = "Unknown ID";
          }
        })
      );
      setAuthorNames(names);
    });
  }, []);

  const handleDecision = async (id, status) => {
    await updateArticleStatus(id, status);
    toast.success(`Article ${status}`);
    setArticles(articles.filter((a) => a.articleId !== id));
    setReviewArticle(null);
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  if (articles.length === 0)
    return <EmptyState message="No pending articles." />;

  return (
    <>
      <div className="grid gap-4">
        {articles.map((article) => (
          <div
            key={article.articleId}
            className="border rounded-lg p-4 flex justify-between items-start hover:bg-gray-50 transition-colors"
          >
            <div>
              <h3 className="font-bold text-lg text-indigo-900">
                {article.title}
              </h3>
              <p className="text-xs text-gray-500 mb-2">
                Submitted by:{" "}
                <strong>{authorNames[article.authorId] || "Loading..."}</strong>{" "}
                • {new Date(article.publishDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm line-clamp-2">
                {stripHtml(article.content)}
              </p>
            </div>
            <div className="flex gap-2 shrink-0 ml-4 items-center">
              <button
                onClick={() => setReviewArticle(article)}
                className="px-4 py-2 border border-indigo-200 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-50"
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {reviewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Review</h2>
              <button
                onClick={() => setReviewArticle(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              <div className="prose prose-indigo max-w-none">
                <h1>{reviewArticle.title}</h1>
                <div
                  dangerouslySetInnerHTML={{ __html: reviewArticle.content }}
                />
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setReviewArticle(null)}
                className="px-5 py-2.5 rounded-lg text-gray-600 font-bold bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleDecision(reviewArticle.articleId, "Rejected")
                }
                className="px-5 py-2.5 rounded-lg border border-red-200 text-red-600 font-bold hover:bg-red-50"
              >
                Reject
              </button>
              <button
                onClick={() =>
                  handleDecision(reviewArticle.articleId, "Published")
                }
                className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700"
              >
                Approve & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- PENDING NGO TABLE ---
function PendingNgosTable() {
  const [ngos, setNgos] = useState([]);
  useEffect(() => {
    getPendingNgos().then(setNgos).catch(console.error);
  }, []);

  const handleDecision = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      if (status === "Active") toast.success("NGO Approved!");
      else if (status === "Rejected") toast.success("NGO Rejected.");
      setNgos(ngos.filter((n) => n.id !== id));
    } catch (error) {
      toast.error("Failed.");
    }
  };

  if (ngos.length === 0)
    return <EmptyState message="No pending NGO requests." />;

  return (
    <div className="grid gap-4">
      {ngos.map((ngo) => (
        <div
          key={ngo.id}
          className="border rounded-lg p-4 flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600 text-lg">
              {/* 🟢 Fallback to Username */}
              {(ngo.name || ngo.username)?.[0] || "N"}
            </div>
            <div>
              <h3 className="font-bold text-lg text-indigo-900">
                {ngo.name || ngo.username}
              </h3>
              <p className="text-sm text-gray-500">{ngo.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleDecision(ngo.id, "Active")}
              className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleDecision(ngo.id, "Rejected")}
              className="px-4 py-2 bg-red-100 text-red-600 text-sm font-bold rounded-lg hover:bg-red-200 border border-red-200"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- ALL ARTICLES ---
function AllArticlesTable() {
  const [articles, setArticles] = useState([]);
  const [authorNames, setAuthorNames] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    getAllArticles().then(async (data) => {
      setArticles(data);
      const uniqueIds = [...new Set(data.map((a) => a.authorId))];
      const names = {};
      await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            // 🟢 Fetch using ProfileAPI
            const u = await getUserById(id);
            names[id] = u.name || u.username || "Unknown User";
          } catch {
            names[id] = "Unknown ID";
          }
        })
      );
      setAuthorNames(names);
    });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Take down article?")) return;
    await updateArticleStatus(id, "Rejected");
    toast.success("Article taken down");
    setArticles(
      articles.map((a) =>
        a.articleId === id ? { ...a, status: "Rejected" } : a
      )
    );
    setSelectedArticle(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.articleId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3 text-gray-500">
                  {authorNames[a.authorId] || "Loading..."}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedArticle(a)}
                    className="text-indigo-600 hover:underline font-bold mr-3"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Article Details
                </h2>
                <StatusBadge status={selectedArticle.status} />
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              <div className="prose prose-indigo max-w-none">
                <h1>{selectedArticle.title}</h1>
                <p className="text-sm text-gray-500 mb-6">
                  By {authorNames[selectedArticle.authorId]}
                </p>
                {selectedArticle.coverImageUrl && (
                  <img
                    src={selectedArticle.coverImageUrl}
                    alt="Cover"
                    className="w-full h-64 object-cover rounded-xl mb-6 shadow-md"
                  />
                )}
                <div
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 rounded-lg text-gray-600 font-bold bg-gray-200"
              >
                Close
              </button>
              {selectedArticle.status !== "Rejected" && (
                <button
                  onClick={() => handleDelete(selectedArticle.articleId)}
                  className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700"
                >
                  Take Down
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- ALL EVENTS TABLE ---
function AllEventsTable() {
  const [events, setEvents] = useState([]);
  const [organizerNames, setOrganizerNames] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await getAllEvents();
        setEvents(eventData);

        const allUserIds = [];
        eventData.forEach((e) => {
          if (e.ngoId) allUserIds.push(e.ngoId);
          if (e.createdById) allUserIds.push(e.createdById);
        });

        const uniqueIds = [...new Set(allUserIds)];

        const names = {};
        await Promise.all(
          uniqueIds.map(async (id) => {
            try {
              // 🟢 Fetch using ProfileAPI
              const u = await getUserById(id);
              // 🟢 Fix: Username fallback
              names[id] = u.name || u.username || "Unknown User";
            } catch {
              names[id] = "Unknown User";
            }
          })
        );

        setOrganizerNames(names);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  const getOrgName = (e) => {
    const idToLookup = e.ngoId || e.createdById;
    return organizerNames[idToLookup] || "Loading...";
  };

  const handleFlag = async (id) => {
    if (!window.confirm("Take down event?")) return;
    try {
      await updateEventStatus(id, "Rejected");
      toast.success("Event taken down");
      setEvents(
        events.map((e) => (e.id === id ? { ...e, status: "Rejected" } : e))
      );
      setSelectedEvent(null);
    } catch {
      toast.error("Failed.");
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3">Event Title</th>
              <th className="px-4 py-3">Organizer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{e.title}</td>
                <td className="px-4 py-3 text-gray-500">{getOrgName(e)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={e.status} />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedEvent(e)}
                    className="text-indigo-600 hover:underline font-bold mr-3"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Event Details
                </h2>
                <StatusBadge status={selectedEvent.status} />
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              <h1 className="text-3xl font-bold text-indigo-900 mb-2">
                {selectedEvent.title}
              </h1>
              <div className="flex flex-col gap-4 text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-bold">Date:</span>
                  <span>
                    {new Date(selectedEvent.eventDate).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-bold">Location:</span>
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Organizer:</span>
                  <span>{getOrgName(selectedEvent)}</span>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {selectedEvent.description}
              </p>
              {selectedEvent.documents &&
                selectedEvent.documents.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-bold text-sm text-gray-500 uppercase mb-2">
                      Attached Documents
                    </h4>
                    <ul className="list-disc pl-5 text-indigo-600">
                      {selectedEvent.documents.map((doc, idx) => (
                        <li key={idx}>
                          <a
                            href={doc}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            Document {idx + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2.5 rounded-lg text-gray-600 font-bold bg-gray-200"
              >
                Close
              </button>
              {selectedEvent.status !== "Rejected" && (
                <button
                  onClick={() => handleFlag(selectedEvent.id)}
                  className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700"
                >
                  Take Down Event
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
