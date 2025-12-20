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
      className="rounded-[2.5rem] overflow-hidden w-full h-48 sm:h-72 md:h-96 lg:h-[28rem] xl:h-[32rem] relative shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 ease-in-out cursor-pointer bg-white group text-left border-4 border-transparent hover:border-white"
    >
      <div className="h-[80%] w-full overflow-hidden relative">
        <img
          src={imageSrc}
          alt={content.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gender Badge - Hidden on very small screens to save space, visible on sm+ */}
        <span className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 text-[10px] md:text-sm font-bold rounded-2xl shadow-md text-slate-700 uppercase tracking-widest hidden sm:block">
          {content.gender || "Pet"}
        </span>
      </div>

      {/* Content Section (20% height) */}
      <div className="h-[20%] flex flex-col items-center justify-center fredoka bg-white px-4">
        {/* Responsive Text Scaling */}
        <h1 className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors truncate w-full text-center">
          {content.name}
        </h1>

        <div className="flex flex-row justify-center gap-1 md:gap-3 items-center leading-none mt-1">
          <p className="text-[10px] sm:text-xs md:text-base text-gray-400 font-semibold truncate max-w-[60px] md:max-w-none">
            {content.breed}
          </p>
          <span className="text-gray-300 font-black hidden sm:inline">·</span>
          <p className="text-[10px] sm:text-xs md:text-base text-gray-400 font-semibold">
            {content.age}
          </p>
        </div>
      </div>
    </button>
  );
};

export default Card;
