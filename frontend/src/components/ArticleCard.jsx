import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://placehold.co/800x600/e2e8f0/475569?text=Article+Image&font=montserrat";

export default function ArticleCard({ article }) {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(article.coverImageUrl || FALLBACK_IMAGE);

  const date = new Date(article.publishDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      onClick={() => navigate(`/article/${article.articleId}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer group flex flex-col h-full"
    >
      <div className="h-48 overflow-hidden bg-gray-100 relative">
        <img
          src={imgSrc}
          alt={article.title}
          onError={(e) => {
            e.target.onerror = null;
            setImgSrc(FALLBACK_IMAGE);
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category Badge (If you have categories in the future) */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
            Article
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">
          {date}
        </p>
        <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-[#009e8c] transition-colors">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#009e8c] group-hover:underline">
          Read More →
        </div>
      </div>
    </div>
  );
}
