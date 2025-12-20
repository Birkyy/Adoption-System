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
      // 🟢 REDUCED HEIGHTS: scaled down by roughly 10-15% across all breakpoints
      // 🟢 REDUCED ROUNDING: from [2.5rem] to [2rem] for a tighter look
      className="rounded-[2rem] overflow-hidden w-full h-44 sm:h-64 md:h-80 lg:h-[22rem] xl:h-[26rem] relative shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-in-out cursor-pointer bg-white group text-left border-2 border-transparent hover:border-indigo-50"
    >
      {/* Image Section (Keep 80% height for visual focus) */}
      <div className="h-[80%] w-full overflow-hidden relative">
        <img
          src={imageSrc}
          alt={content.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gender Badge - Slightly smaller padding and font */}
        <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 text-[9px] md:text-xs font-bold rounded-xl shadow-md text-slate-700 uppercase tracking-widest hidden sm:block">
          {content.gender || "Pet"}
        </span>
      </div>

      {/* Content Section (20% height) */}
      <div className="h-[20%] flex flex-col items-center justify-center fredoka bg-white px-3">
        {/* Adjusted Font Scaling: text-sm to text-2xl */}
        <h1 className="text-sm sm:text-base md:text-xl lg:text-2xl font-extrabold tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors truncate w-full text-center">
          {content.name}
        </h1>

        <div className="flex flex-row justify-center gap-1 md:gap-2 items-center leading-none mt-0.5">
          <p className="text-[9px] sm:text-[10px] md:text-sm text-gray-400 font-semibold truncate max-w-[50px] md:max-w-none">
            {content.breed}
          </p>
          <span className="text-gray-300 font-black hidden sm:inline text-xs">
            ·
          </span>
          <p className="text-[9px] sm:text-[10px] md:text-sm text-gray-400 font-semibold">
            {content.age}
          </p>
        </div>
      </div>
    </button>
  );
};

export default Card;
