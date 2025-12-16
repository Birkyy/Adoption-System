import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicArticles, createArticle } from "../API/ArticleAPI";
import { useAuth } from "../contexts/AuthContext";
import ArticleCard from "../components/ArticleCard";
import LoadingScreen from "../components/LoadingScreen";
import toast from "react-hot-toast";
import mammoth from "mammoth";

// Debounce Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Article() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- STATE ---
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  const [search, setSearch] = useState("");
  // Removed Category State

  const debouncedSearch = useDebounce(search, 500);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    coverImageUrl: "",
  });

  // --- EFFECT: Fetch Data ---
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          pageSize,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        // Removed category param

        const response = await getPublicArticles(params);

        // Handle Tuple/Pagination Response
        const body = response && response.data ? response.data : response;

        if (body.Data || body.data) {
          setArticles(body.Data || body.data || []);
          setTotalPages(body.TotalPages || body.totalPages || 1);
        } else if (Array.isArray(body)) {
          setArticles(body);
          setTotalPages(1);
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load articles.");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, debouncedSearch]); // Removed category dependency

  // --- HANDLERS ---

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large. Max 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) =>
      setNewArticle({ ...newArticle, coverImageUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  const handleDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      toast.error("Only .docx Word files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const result = await mammoth.convertToHtml({
          arrayBuffer: arrayBuffer,
        });
        setNewArticle((prev) => ({ ...prev, content: result.value }));
        toast.success("Document converted to HTML!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to read document.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login.");

    try {
      await createArticle({
        ...newArticle,
        authorId: user.id,
      });
      toast.success("Article submitted for review!");
      setShowModal(false);
      setNewArticle({ title: "", content: "", coverImageUrl: "" });
    } catch (error) {
      toast.error("Failed to submit article.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 fredoka pb-12">
      {loading && <LoadingScreen />}

      {/* HERO SECTION */}
      <div className="bg-[#009e8c] pt-16 pb-32 px-4 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-gloria text-shadow-md">
            Furticle
          </h1>
          <p className="text-lg md:text-xl text-teal-50 mb-8 font-light tracking-wide">
            Expert advice, heartwarming stories, and tips for your furry
            friends.
          </p>

          <button
            onClick={() =>
              user ? setShowModal(true) : toast.error("Login required")
            }
            className="mb-10 bg-amber-300 text-teal-900 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-amber-200 hover:scale-105 transition-all flex items-center gap-2 mx-auto"
          >
            <span className="text-xl">✍️</span> Write an Article
          </button>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search for articles..."
              // Added bg-white
              className="w-full py-4 pl-6 pr-14 rounded-full shadow-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-300/40 transition-all"
              value={search}
              onChange={handleSearchChange}
            />
            <div className="absolute right-2 top-2 p-2 bg-[#009e8c] rounded-full text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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

          {/* Removed Category Tabs */}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300 opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-[calc(130%+1.3px)] h-[60px] fill-gray-50"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn my-8">
            <div className="bg-[#009e8c] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                Submit Your Story
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-teal-100 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    required
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#009e8c] outline-none"
                    value={newArticle.title}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-sm text-slate-500"
                  />
                  {newArticle.coverImageUrl && (
                    <img
                      src={newArticle.coverImageUrl}
                      className="h-20 mt-2 rounded"
                      alt="Preview"
                    />
                  )}
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <label className="block text-sm font-bold text-indigo-900 mb-1">
                    📄 Import from Word (.docx)
                  </label>
                  <p className="text-xs text-indigo-600 mb-2">
                    Auto-fill content from your document.
                  </p>
                  <input
                    type="file"
                    accept=".docx"
                    onChange={handleDocUpload}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-indigo-700 hover:file:bg-indigo-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Content{" "}
                    <span className="text-xs font-normal text-gray-400">
                      (HTML Supported)
                    </span>
                  </label>
                  <textarea
                    required
                    rows="10"
                    placeholder="Type here or import a .docx file..."
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#009e8c] outline-none font-mono text-sm"
                    value={newArticle.content}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, content: e.target.value })
                    }
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 rounded-lg text-slate-500 font-bold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 rounded-lg bg-[#009e8c] text-white font-bold shadow-md hover:bg-teal-700"
                  >
                    Submit Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ARTICLES GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading &&
            articles.map((article) => (
              <ArticleCard key={article.articleId} article={article} />
            ))}
        </div>

        {!loading && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-white p-6 rounded-full shadow-md mb-4 text-6xl">
              🧐
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">
              No articles found
            </h3>
            <p className="text-slate-500 max-w-md">
              We couldn't find any articles matching "{search}".
            </p>
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="mt-6 text-[#009e8c] font-bold hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {!loading && articles.length > 0 && (
          <div className="mt-12 flex justify-center items-center gap-4">
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
