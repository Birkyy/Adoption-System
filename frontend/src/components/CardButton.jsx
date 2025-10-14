const CardButton = ({ contents }) => {
  return (
    <>
      <div className="flex justify-center gap-3 sm:gap-7 lg:gap-15 xl:gap-40">
        {contents.map((content) => (
          <div
            className="flex flex-col items-center text-center w-[90px] sm:w-[110px] md:w-[130px]"
            key={content.id}
          >
            <button className="flex items-center justify-center rounded-full overflow-hidden p-3 bg-amber-200 w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[90px] md:h-[90px] lg:(w-[120px] h-[120px]) xl:(w-[160px] h-[160px])">
              <a href="#">
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              </a>
            </button>
            <h2 className="fredoka font-semibold text-sm sm:text-lg mt-2 leading-tight tracking-wide">
              {content.title}
            </h2>
          </div>
        ))}
      </div>
    </>
  );
};
export default CardButton;
