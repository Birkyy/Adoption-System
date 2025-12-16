import React, { useState, useEffect } from "react";
import { getPets } from "../API/PetAPI";
import Card from "../components/Card";
import LoadingScreen from "../components/LoadingScreen";

// Debounce Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function PetList() {
  // --- STATE ---
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  // Filters
  const [filters, setFilters] = useState({
    species: "All",
    breed: "",
    gender: "All",
    age: "",
    search: "",
  });

  const debouncedBreed = useDebounce(filters.breed, 500);
  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedAge = useDebounce(filters.age, 500);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const apiParams = {
          page: page,
          pageSize: pageSize,
        };

        if (filters.species !== "All") apiParams.species = filters.species;
        if (filters.gender !== "All") apiParams.gender = filters.gender;
        if (debouncedBreed) apiParams.breed = debouncedBreed;
        if (debouncedSearch) apiParams.name = debouncedSearch;
        if (debouncedAge) apiParams.age = debouncedAge;

        const response = await getPets(apiParams);

        // Handle both simple list and paginated response
        const body = response && response.data ? response.data : response;

        if (Array.isArray(body)) {
          setPets(body);
          setTotalPages(1);
        } else if (body.Data || body.data) {
          setPets(body.Data || body.data || []);
          setTotalPages(body.TotalPages || body.totalPages || 1);
        } else {
          setPets([]);
        }
      } catch (error) {
        console.error("Failed to fetch pets", error);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [
    page,
    filters.species,
    filters.gender,
    debouncedBreed,
    debouncedSearch,
    debouncedAge,
  ]);

  // --- HANDLERS ---
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      species: "All",
      breed: "",
      gender: "All",
      age: "",
      search: "",
    });
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}

      {/* Outer Wrapper: Matches Event.jsx padding and alignment */}
      <div className="min-h-screen bg-[#d5a07d] px-4 flex justify-center items-start">
        {/* Main Card: Uses 'fredoka' class instead of 'font-fredoka' */}
        <div className="flex flex-col lg:flex-row w-full max-w-7xl bg-white shadow-xl rounded-2xl overflow-hidden fredoka min-h-[80vh]">
          {/* SIDEBAR */}
          <div className="w-full lg:w-[280px] shrink-0 py-6 border-r border-gray-100 bg-white">
            <div className="flex items-center border-b border-gray-200 pb-4 px-6">
              <h3 className="text-slate-900 text-lg font-bold">Filter Pets</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-red-500 font-semibold ml-auto cursor-pointer hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Name Search */}
              <div>
                <h6 className="text-slate-900 text-sm font-bold mb-2">
                  Search Name
                </h6>
                <input
                  type="text"
                  placeholder="Keywords..."
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              {/* Breed Search */}
              <div>
                <h6 className="text-slate-900 text-sm font-bold mb-2">Breed</h6>
                <input
                  type="text"
                  placeholder="e.g. Retriever"
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  value={filters.breed}
                  onChange={(e) => handleFilterChange("breed", e.target.value)}
                />
              </div>

              {/* Age Filter */}
              <div>
                <h6 className="text-slate-900 text-sm font-bold mb-2">Age</h6>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 2"
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  value={filters.age}
                  onChange={(e) => handleFilterChange("age", e.target.value)}
                />
              </div>

              {/* Species Filter */}
              <div>
                <h6 className="text-slate-900 text-sm font-bold mb-2">
                  Animal Type
                </h6>
                <div className="space-y-2">
                  {["All", "Dog", "Cat", "Other"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="species"
                        // Changed accent to Teal (#009e8c)
                        className="w-4 h-4 cursor-pointer accent-[#009e8c]"
                        checked={filters.species === type}
                        onChange={() => handleFilterChange("species", type)}
                      />
                      <span className="text-slate-700 font-medium text-sm">
                        {type === "All" ? "All Animals" : type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div>
                <h6 className="text-slate-900 text-sm font-bold mb-2">
                  Gender
                </h6>
                <div className="space-y-2">
                  {["All", "Male", "Female"].map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="gender"
                        // Changed accent to Teal (#009e8c)
                        className="w-4 h-4 cursor-pointer accent-[#009e8c]"
                        checked={filters.gender === g}
                        onChange={() => handleFilterChange("gender", g)}
                      />
                      <span className="text-slate-700 font-medium text-sm">
                        {g}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 p-6 bg-gray-50 flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-800 font-gloria">
                Adopt a Buddy
              </h1>
              <p className="text-gray-500 mt-1">
                Find your perfect companion and give them a forever home.
              </p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {!loading &&
                pets.map((pet) => (
                  <Card
                    key={pet.petId || pet.id}
                    content={{
                      ...pet,
                      image:
                        pet.photos && pet.photos.length > 0
                          ? pet.photos[0]
                          : pet.imageUrl,
                    }}
                  />
                ))}

              {pets.length === 0 && !loading && (
                <div className="col-span-full text-center py-20 text-gray-500">
                  <p className="text-xl">
                    No pets found matching your filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    // Changed text color to Teal
                    className="text-[#009e8c] hover:underline mt-2 font-bold"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* PAGINATION CONTROLS */}
            {!loading && pets.length > 0 && (
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
                  // Changed background to Teal
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
