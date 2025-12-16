import React, { useState, useEffect } from "react";
import { getPets } from "../API/PetAPI";
import Card from "../components/Card";

// Use a debounce hook to prevent API calls on every single keystroke
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

  // Filters matching your Domain Model
  const [filters, setFilters] = useState({
    species: "All", // "Dog", "Cat", "Other" or "All"
    breed: "", // String search
    gender: "All", // "Male", "Female"
    age: "", // Number
    search: "", // Name search
  });

  const debouncedBreed = useDebounce(filters.breed, 500);
  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedAge = useDebounce(filters.age, 500);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        // 1. Prepare params for API
        const apiParams = {};
        if (filters.species !== "All") apiParams.species = filters.species;
        if (debouncedBreed) apiParams.breed = debouncedBreed;
        if (debouncedSearch) apiParams.name = debouncedSearch;
        if (debouncedAge) apiParams.age = debouncedAge;

        // 2. Call API
        const data = await getPets(apiParams);

        // 3. Client-side filtering for fields NOT in the Controller's Get() method
        // (Your provided controller didn't have [FromQuery] string? gender)
        let filteredData = data;

        if (filters.gender !== "All") {
          filteredData = filteredData.filter(
            (pet) => pet.gender === filters.gender
          );
        }

        setPets(filteredData);
      } catch (error) {
        console.error("Failed to fetch pets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [
    filters.species,
    filters.gender,
    debouncedBreed,
    debouncedSearch,
    debouncedAge,
  ]);

  // --- HANDLERS ---
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      species: "All",
      breed: "",
      gender: "All",
      age: "",
      search: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#d5a07d] pb-8 px-4">
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row bg-gray-200 min-h-screen max-w-7xl mx-auto border-1 rounded-md border-gray-200 shadow-sm">
        {/* --- SIDEBAR FILTERS --- */}
        <div className="w-full lg:w-[280px] shrink-0 py-6 border-r border-gray-100">
          <div className="flex items-center border-b border-gray-200 pb-4 px-6">
            <h3 className="text-slate-900 text-lg font-bold font-fredoka">
              Filters
            </h3>
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-red-500 font-semibold ml-auto cursor-pointer hover:underline"
            >
              Clear all
            </button>
          </div>

          <div className="divide-y divide-gray-200 font-fredoka">
            {/* 1. SPECIES FILTER */}
            <div className="p-6">
              <h6 className="text-slate-900 text-sm font-bold mb-3">Animal</h6>
              <ul className="space-y-3">
                {["All", "Dog", "Cat", "Other"].map((type) => (
                  <li key={type} className="flex items-center gap-3">
                    <input
                      type="radio"
                      id={type}
                      name="species"
                      className="w-4 h-4 cursor-pointer accent-[#009e8c]"
                      checked={filters.species === type}
                      onChange={() => handleFilterChange("species", type)}
                    />
                    <label
                      htmlFor={type}
                      className="text-slate-700 font-medium text-sm cursor-pointer"
                    >
                      {type === "All" ? "All Animals" : type}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. BREED SEARCH */}
            <div className="p-6">
              <h6 className="text-slate-900 text-sm font-bold mb-2">Breed</h6>
              <div className="flex px-3 py-2 rounded-md border border-gray-300 bg-gray-50 overflow-hidden">
                <input
                  type="text"
                  placeholder="Search breed..."
                  className="w-full bg-transparent outline-none text-gray-900 text-sm"
                  value={filters.breed}
                  onChange={(e) => handleFilterChange("breed", e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-500"
                >
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* 3. GENDER FILTER (Replaces Color) */}
            <div className="p-6">
              <h6 className="text-slate-900 text-sm font-bold mb-3">Gender</h6>
              <ul className="space-y-3">
                {["All", "Male", "Female"].map((g) => (
                  <li key={g} className="flex items-center gap-3">
                    <input
                      type="radio"
                      id={g}
                      name="gender"
                      className="w-4 h-4 cursor-pointer accent-[#009e8c]"
                      checked={filters.gender === g}
                      onChange={() => handleFilterChange("gender", g)}
                    />
                    <label
                      htmlFor={g}
                      className="text-slate-700 font-medium text-sm cursor-pointer"
                    >
                      {g}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. AGE FILTER (Replaces Discount) */}
            <div className="p-6">
              <h6 className="text-slate-900 text-sm font-bold mb-2">Age</h6>
              <input
                type="number"
                min="0"
                placeholder="e.g. 2"
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-sm focus:ring-2 focus:ring-[#009e8c] outline-none"
                value={filters.age}
                onChange={(e) => handleFilterChange("age", e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-2">
                Enter exact age to filter
              </p>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT: PET GRID --- */}
        <div className="flex-1 p-6 bg-gray-100">
          {/* Top Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by pet name..."
              className="w-full p-4 rounded-xl border border-gray-200 shadow-sm text-lg focus:ring-2 focus:ring-[#009e8c] outline-none"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* Grid */}
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009e8c]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  // Format pet object for Card component (handle single vs multi photo)
                  <Card
                    key={pet.petId || pet.id}
                    content={{
                      ...pet,
                      // Ensure Card gets a valid image source string
                      image:
                        pet.photos && pet.photos.length > 0
                          ? pet.photos[0]
                          : pet.imageUrl,
                    }}
                  />
                ))}
              </div>

              {pets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <p className="text-lg font-medium">
                    No pets found matching your filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-[#009e8c] hover:underline mt-2"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
