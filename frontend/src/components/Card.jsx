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
      className="rounded-3xl overflow-hidden h-40 w-full md:h-56 relative shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer bg-white group text-left"
    >
      {/* Image Section (70% height) */}
      <div className="h-[70%] w-full overflow-hidden relative">
        <img
          src={imageSrc}
          alt={content.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gender Badge */}
        <span className="absolute bottom-2 right-2 bg-white/90 px-2 py-0.5 text-[10px] font-bold rounded-full shadow-sm text-slate-700 uppercase tracking-wider">
          {content.gender || "Pet"}
        </span>
      </div>

      {/* Content Section (30% height) */}
      <div className="h-[30%] flex flex-col items-center justify-center fredoka bg-white gap-1">
        <h1 className="text-base font-bold tracking-wide text-slate-800">
          {content.name}
        </h1>

        <div className="flex flex-row justify-center gap-2 items-center leading-none">
          <p className="text-xs text-gray-500 font-medium truncate max-w-[80px]">
            {content.breed}
          </p>
          <span className="text-xs text-gray-300 font-bold">·</span>
          <p className="text-xs text-gray-500 font-medium">{content.age} yrs</p>
        </div>
      </div>
    </button>
  );
};

export default Card;
