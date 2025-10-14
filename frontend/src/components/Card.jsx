const Card = ({ contents }) => {
  return (
    <>
      {contents.map((content) => (
        <button
          className="rounded-xl overflow-hidden h-40 w-60 md:(h-50 w-90) lg:(h-60 w-60) xl:(h-80 w-80) relative shadow-xl"
          key={content.id}
        >
          <img
            src={content.image}
            alt=""
            className="w-full h-7/10 md:h-75/100 bg-amber-200 object-cover"
          />

          <div className="flex flex-col items-center justify-center fredoka h-3/10 md:h-25/100 gap-2">
            <h1 className="text-md font-semibold leading-0 pt-3">
              {content.name}
            </h1>
            <div className="flex flex-row w-full justify-center gap-2 items-center">
              <p className="text-sm text-gray-500 font-semibold">
                {content.breed}
              </p>
              <p className="text-sm text-gray-500 font-extrabold">·</p>
              <p className="text-sm text-gray-500 font-semibold">
                {content.age}
              </p>
            </div>
          </div>
        </button>
      ))}
    </>
  );
};
export default Card;
