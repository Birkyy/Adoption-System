import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ content }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const petId = content.petId || content.id;
    if (petId) {
      navigate(`/pet/${petId}`);
    }
  };

  const imageSrc =
    content.image ||
    (content.photos && content.photos.length > 0 ? content.photos[0] : null) ||
    content.imageUrl ||
    "https://via.placeholder.com/150";

  return (
    <button
      type="button"
      onClick={handleClick}
      // 🟢 COMPACT HEIGHTS: Roughly 20% smaller than the previous version
      // 🟢 REFINED ROUNDING: from [2rem] to [1.5rem] (3xl) to match the smaller scale
      className="rounded-3xl overflow-hidden w-full h-40 sm:h-52 md:h-64 lg:h-72 xl:h-80 relative shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer bg-white group text-left border border-transparent hover:border-indigo-100"
    >
      {/* Image Section (Keep 75-80% height) */}
      <div className="h-[78%] w-full overflow-hidden relative">
        <img
          src={imageSrc}
          alt={content.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gender Badge - Minimalist padding */}
        <span className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 text-[8px] md:text-[10px] font-bold rounded-lg shadow-sm text-slate-700 uppercase tracking-wider hidden sm:block">
          {content.gender || "Pet"}
        </span>
      </div>

      {/* Content Section (22% height) */}
      <div className="h-[22%] flex flex-col items-center justify-center fredoka bg-white px-2">
        {/* Adjusted Font: text-xs to text-xl */}
        <h1 className="text-xs sm:text-sm md:text-lg lg:text-xl font-bold tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors truncate w-full text-center">
          {content.name}
        </h1>

        <div className="flex flex-row justify-center gap-1 md:gap-2 items-center leading-none">
          <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-400 font-medium truncate max-w-[40px] md:max-w-none">
            {content.breed}
          </p>
          <span className="text-gray-300 font-black hidden sm:inline text-[10px]">
            ·
          </span>
          <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-400 font-medium">
            {content.age}
          </p>
        </div>
      </div>
    </button>
  );
};

export default Card;
