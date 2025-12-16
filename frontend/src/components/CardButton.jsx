const CardButton = ({ contents, activeCategory, onCategoryChange }) => {
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
        {contents.map((content) => {
          const IconComponent = content.image;
          const isActive = activeCategory === content.title;

          return (
            <button
              key={content.id}
              onClick={() => onCategoryChange(content.title)}
              className={`rounded-xl flex-1 transition-all duration-300 pt-4 pb-2 md:py-3`}
            >
              <div className="flex flex-col md:flex-row gap-1 md:gap-4 items-center justify-center text-[hsl(228,14%,50%)] hover:text-[#bc9da7] transition-all duration-500 ease-in-out">
                <IconComponent
                  className={`w-8 h-8 md:(w-12 h-12) transition-all duration-300 text-shadow-lg ${
                    isActive ? "scale-110 text-[#2f4858]" : "scale-100"
                  }`}
                />
                <h1
                  className={`fredoka font-semibold text-lg md:text-2xl text-center transition-all duration-300 ${
                    isActive
                      ? "font-bold scale-120 text-[#2f4858] text-shadow-lg"
                      : "font-semibold scale-100 text-shadow-sm"
                  }`}
                >
                  {content.title}
                </h1>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default CardButton;
