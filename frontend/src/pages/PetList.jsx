import React, { useState, useEffect } from "react";
import { getPets } from "../API/PetAPI";
import Card from "../components/Card";
import LoadingScreen from "../components/LoadingScreen";
import { Toaster } from "react-hot-toast";

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
  const [allPets, setAllPets] = useState([]); // 1. Store MASTER list of pets here
  const [pets, setPets] = useState([]); // 2. Store FILTERED list here for display
  const [loading, setLoading] = useState(true);

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

  // --- EFFECT 1: FETCH DATA (Only runs on mount or Species change) ---
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true); // Show loading ONLY when fetching new data from server
      try {
        const apiParams = {};
        if (filters.species !== "All") apiParams.species = filters.species;

        const data = await getPets(apiParams);
        setAllPets(data); // Save to Master List
      } catch (error) {
        console.error("Failed to fetch pets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [filters.species]); // 🟢 Dependency: Only runs when Species changes

  // --- EFFECT 2: FILTER DATA (Runs on client-side filter changes) ---
  useEffect(() => {
    // Filter the MASTER list (allPets) into the DISPLAY list (pets)
    // No setLoading(true) here, so no flashing!

    let result = allPets;

    // A. Gender Filter
    if (filters.gender !== "All") {
      result = result.filter((pet) => pet.gender === filters.gender);
    }

    // B. Breed Filter
    if (debouncedBreed) {
      const searchBreed = debouncedBreed.toLowerCase();
      result = result.filter((pet) =>
        pet.breed?.toLowerCase().includes(searchBreed)
      );
    }

    // C. Name Search
    if (debouncedSearch) {
      const searchTerm = debouncedSearch.toLowerCase();
      result = result.filter((pet) =>
        pet.name?.toLowerCase().includes(searchTerm)
      );
    }

    // D. Age Filter
    if (debouncedAge) {
      const filterAgeNum = parseInt(debouncedAge);
      result = result.filter((pet) => {
        const petAgeStr = pet.age ? String(pet.age) : "";
        const petAgeNum = parseInt(petAgeStr);

        if (!isNaN(petAgeNum) && !isNaN(filterAgeNum)) {
          return petAgeNum === filterAgeNum;
        }
        return petAgeStr.toLowerCase().includes(debouncedAge.toLowerCase());
      });
    }

    setPets(result);
  }, [allPets, filters.gender, debouncedBreed, debouncedSearch, debouncedAge]); // 🟢 Dependency: Runs when any filter changes

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
    <>
      {loading && <LoadingScreen />}

      <div className="min-h-screen bg-[#d5a07d] pb-20 px-4 flex justify-center items-start">
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
                        className="w-4 h-4 cursor-pointer accent-indigo-600"
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
                        className="w-4 h-4 cursor-pointer accent-indigo-600"
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
          <div className="flex-1 p-6 bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 font-gloria">
                  Adopt a Buddy
                </h1>
                <p className="text-gray-500 mt-1">
                  Find your perfect companion and give them a forever home.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    className="text-indigo-600 hover:underline mt-2 font-bold"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
