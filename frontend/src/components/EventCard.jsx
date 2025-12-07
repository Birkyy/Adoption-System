import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://placehold.co/800x600/e2e8f0/475569?text=Event+Image&font=montserrat";

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const date = new Date(event.eventDate);
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();

  const [imgSrc, setImgSrc] = useState(event.imageUrl || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(event.imageUrl || FALLBACK_IMAGE);
  }, [event.imageUrl]);

  const handleNavigate = () => {
    // Use event.id or event.EventId depending on your model serialization
    navigate(`/event/${event.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 group cursor-pointer"
    >
      {/* Image Area */}
      <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
        <img
          src={imgSrc}
          alt={event.title}
          onError={(e) => {
            e.target.onerror = null;
            setImgSrc(FALLBACK_IMAGE);
          }}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imgSrc === FALLBACK_IMAGE ? "opacity-80 p-8" : ""
          }`}
        />
        {/* Date Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-2 text-center shadow-sm min-w-[60px]">
          <span className="block text-xs font-bold text-indigo-600 uppercase">
            {month}
          </span>
          <span className="block text-2xl font-extrabold text-slate-800 leading-none">
            {day}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors"
          title={event.title}
        >
          {event.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {event.location || "TBD"}
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
          {event.description}
        </p>

        <button className="w-full py-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}
