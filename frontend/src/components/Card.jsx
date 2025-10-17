const Card = ({ contents }) => {
  return (
    <>
      {contents.map((content) => (
        <button
          className="rounded-4xl overflow-hidden max:sm(h-40 w-60) h-32 w-48 md:(h-44 w-66) relative shadow-lg hover:(shadow-2xl) transition-all duration-500 ease-in-out"
          key={content.id}
        >
          <img
            src={content.image}
            alt=""
            className="w-full h-7/10 md:h-75/100 bg-white object-cover"
          />

          <div className="flex flex-col items-center justify-center fredoka h-3/10 md:h-25/100 bg-white gap-2 pt-1.5">
            <h1 className="text-sm font-semibold leading-0 tracking-wider">
              {content.name}
            </h1>
            <div className="flex flex-row w-full justify-center gap-2 items-center leading-0">
              <p className="text-xs text-gray-500 font-medium">
                {content.breed}
              </p>
              <p className="text-xs text-gray-500 font-extrabold">·</p>
              <p className="text-xs text-gray-500 font-medium">{content.age}</p>
            </div>
          </div>
        </button>
      ))}
    </>
  );
};
export default Card;
