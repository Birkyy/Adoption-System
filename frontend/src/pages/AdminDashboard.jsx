import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  getPendingArticles,
  getAllArticles,
  updateArticleStatus,
  getPendingNgos,
  updateUserStatus,
  getAllEvents,
  updateEventStatus, // <--- ADDED THIS IMPORT
} from "../API/AdminAPI";

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
      <Toaster position="top-right" />

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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* MAIN TABS */}
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

        {/* CONTENT AREA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
          {/* REQUESTS VIEW */}
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

          {/* MODERATION VIEW */}
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

function PendingArticlesTable() {
  const [articles, setArticles] = useState([]);
  const [reviewArticle, setReviewArticle] = useState(null);

  useEffect(() => {
    getPendingArticles().then(setArticles).catch(console.error);
  }, []);

  const handleDecision = async (id, status) => {
    await updateArticleStatus(id, status);
    toast.success(`Article ${status}`);
    setArticles(articles.filter((a) => a.articleId !== id));
    setReviewArticle(null);
  };

  if (articles.length === 0)
    return <EmptyState message="No pending articles." />;

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

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
                Submitted by: {article.authorId} •{" "}
                {new Date(article.publishDate).toLocaleDateString()}
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
                Review Content
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REVIEW MODAL */}
      {reviewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Review Article
                </h2>
                <p className="text-sm text-gray-500">
                  Review formatting and content before approving.
                </p>
              </div>
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
                {reviewArticle.coverImageUrl && (
                  <img
                    src={reviewArticle.coverImageUrl}
                    alt="Cover"
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                )}
                <div
                  dangerouslySetInnerHTML={{ __html: reviewArticle.content }}
                />
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setReviewArticle(null)}
                className="px-5 py-2.5 rounded-lg text-red-600 font-bold bg-red-50 hover:bg-red-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleDecision(reviewArticle.articleId, "Rejected")
                }
                className="px-5 py-2.5 rounded-lg border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() =>
                  handleDecision(reviewArticle.articleId, "Published")
                }
                className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-sm transition-transform hover:-translate-y-0.5"
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

function PendingNgosTable() {
  const [ngos, setNgos] = useState([]);
  useEffect(() => {
    getPendingNgos().then(setNgos).catch(console.error);
  }, []);

  const handleDecision = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      if (status === "Active") toast.success("NGO Approved!");
      else if (status === "Rejected") toast.success("NGO Rejected & Deleted.");
      setNgos(ngos.filter((n) => n.id !== id));
    } catch (error) {
      toast.error("Failed to update status.");
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
              {ngo.name?.[0] || "N"}
            </div>
            <div>
              <h3 className="font-bold text-lg text-indigo-900">{ngo.name}</h3>
              <p className="text-sm text-gray-500">{ngo.email}</p>
              <p className="text-xs text-gray-400 mt-1">{ngo.contactInfo}</p>
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

function AllArticlesTable() {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    getAllArticles().then(setArticles).catch(console.error);
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
  };
  return (
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
              <td className="px-4 py-3 text-gray-500">{a.authorId}</td>
              <td className="px-4 py-3">
                <StatusBadge status={a.status} />
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleDelete(a.articleId)}
                  className="text-red-600 hover:underline font-medium"
                >
                  Take Down
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- ALL EVENTS TABLE (Uses getAllEvents + updateEventStatus) ---
function AllEventsTable() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    getAllEvents().then(setEvents).catch(console.error);
  }, []);

  const handleFlag = async (id) => {
    if (!window.confirm("Take down event?")) return;
    try {
      await updateEventStatus(id, "Rejected");
      toast.success("Event taken down");
      setEvents(
        events.map((e) => (e.id === id ? { ...e, status: "Rejected" } : e))
      );
    } catch (err) {
      toast.error("Failed.");
    }
  };

  return (
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
              <td className="px-4 py-3 text-gray-500">
                {e.ngoId || e.createdById}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={e.status} />
              </td>
              <td className="px-4 py-3">
                {e.status !== "Rejected" ? (
                  <button
                    onClick={() => handleFlag(e.id)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Flag
                  </button>
                ) : (
                  <span className="text-gray-400">Taken Down</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
      <p>{message}</p>
    </div>
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
