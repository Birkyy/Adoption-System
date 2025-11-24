import Dog from "../assets/images/welcoming-dog.png";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f8d6c4] transition-opacity duration-500">
      <div className="relative flex flex-col items-center">
        {/* Bouncing Dog Animation */}
        <img
          src={Dog}
          alt="Loading..."
          className="w-32 md:w-48 animate-bounce object-contain"
        />
        <h2 className="mt-4 text-2xl font-bold text-amber-800 fredoka animate-pulse">
          Loading Cuteness...
        </h2>

        {/* Optional: Loading Bar */}
        <div className="mt-4 h-2 w-48 overflow-hidden rounded-full bg-white/50">
          <div className="h-full w-full origin-left animate-[shimmer_1.5s_infinite] bg-amber-600/80"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
