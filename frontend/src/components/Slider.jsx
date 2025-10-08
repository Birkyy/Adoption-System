import { useEffect, useState } from "react";
import Dog1 from "../assets/images/dog_1.png";
import Dog from "../assets/images/home-dog.png";
import Cat1 from "../assets/images/cat_1.png";
import Cat2 from "../assets/images/cat_2.png";
import LeftArrow from "../assets/icons/left-arrow.svg";
import RightArrow from "../assets/icons/right-arrow.svg";
import Paw from "../assets/icons/paw.svg";
import { useSlide } from "../contexts/SlideContext";

function Slider() {
  const { setCurrentSlideIndex } = useSlide();
  const slides = [
    {
      id: 1,
      bg: "bg-amber-600",
      content: (
        <div className="space-y-1 flex flex-row justify-center items-center min-w-7xl h-full gap-10 relative">
          <div className="z-1">
            <img
              src={Paw}
              alt=""
              className="absolute fill-amber-800 top-0 left-0 -translate-1/3 opacity-10 w-1/2 -rotate-25"
            />
            <img
              src={Paw}
              alt=""
              className="absolute fill-amber-800 top-0 right-0 translate-1/4 opacity-12 w-1/3 rotate-40"
            />
            <img
              src={Paw}
              alt=""
              className="absolute fill-amber-800 bottom-0 left-100 opacity-8 w-1/5 rotate-12"
            />
            <img
              src={Paw}
              alt=""
              className="absolute fill-amber-800 bottom-0 left-0 translate-y-25 -translate-x-20 opacity-5 w-1/6 -rotate-60"
            />
          </div>

          <div className="flex flex-col justify-center fredoka max-w-lg z-2">
            <h1 className="heading text-8xl font-semibold mb-5 text-shadow-md text-shadow-amber-700">
              Meet{" "}
              <span className="text-[#ffbfbe] text-shadow-[hsl(1,100%,67%)]">
                Your
              </span>{" "}
              <br />
              New Buddy!
            </h1>
            <p className="text-2xl text-gray-200 mb-10">
              Bring home a friend who'll love you furever —<br /> no conditions,
              just paws and love.
            </p>
            <button className="px-6 py-2 bg-[hsl(173,100%,31%)] hover:bg-amber-800 hover:transition-all duration-300 ease-in-out text-white rounded-3xl shadow-lg">
              Learn More
            </button>
          </div>
          <div className="z-2 min-w-xl relative">
            <img
              src={Dog1}
              className="max-w-xs object-cover object-center mb-20 relative z-10"
              alt=""
            />
            {/* Cat */}
            <img
              src={Cat1}
              alt=""
              className="absolute right-0 bottom-8 translate-x-30 z-1 w-4/5"
            />
            <img
              src={Cat2}
              alt=""
              className="absolute right-0 bottom-8 -translate-y-36 z-0 -rotate-10"
            />
          </div>
        </div>
      ),
    },
    {
      id: 2,
      bg: "bg-[#ff8550]",
      content: (
        <div className="flex flex-row min-w-7xl h-full items-center">
          <div className="flex flex-col justify-center fredoka max-w-2xl z-2">
            <h1 className="heading text-8xl font-semibold mb-5 text-shadow-sm text-shadow-[hsl(18,100%,46%)]">
              Ready to be Super Owner?
            </h1>
            <p className="text-2xl text-gray-100 mb-10">
              Being a Super Owner isn’t about perfection — <br />
              it’s about love, patience, and the willingness to learn.
            </p>
            <button className="px-6 py-2 bg-[hsl(173,100%,31%)] hover:bg-amber-800 hover:transition-all duration-300 ease-in-out text-white rounded-3xl shadow-lg max-w-xl">
              Learn More
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      bg: "bg-amber-400",
      content: (
        <div className="max-w-xl">
          <h2 className="text-4xl font-semibold">Support Local NGOs</h2>
          <p className="mt-2">Donate or volunteer to make a difference.</p>
        </div>
      ),
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalMs = 10000; //autoplay duration

  // Define arrow colors for each slide
  const getArrowColor = () => {
    switch (currentIndex) {
      case 0: // amber-600 background
        return "filter brightness-0 invert"; // White arrows
      case 1: // amber-500 background
        return "filter brightness-0"; // Black arrows
      case 2: // amber-400 background
        return "filter brightness-0"; // Black arrows
      default:
        return "filter brightness-0"; // Default black arrows
    }
  };

  const arrowColor = getArrowColor();

  // Sync context with current index on mount and when currentIndex changes
  useEffect(() => {
    setCurrentSlideIndex(currentIndex);
  }, [currentIndex, setCurrentSlideIndex]);

  function showPrev() {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    setCurrentIndex(newIndex);
    setCurrentSlideIndex(newIndex);
  }

  function showNext() {
    const newIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(newIndex);
    setCurrentSlideIndex(newIndex);
  }

  // Always-on autoplay
  // useEffect(
  //   () => {
  //     //Change slide after 10 secs
  //     const id = setInterval(() => {
  //       setCurrentIndex((prev) => (prev + 1) % slides.length);
  //     }, intervalMs);

  //     //Clear the old timer
  //     return () => clearInterval(id);
  //   },
  //   //rerun if any of the value changes
  //   [intervalMs, slides.length]
  // );

  return (
    <div className="carousel h-screen w-screen relative overflow-hidden overscroll-contain">
      <div
        className="list absolute inset-0 flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`item ${slide.bg} min-w-full h-full relative`}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
              {slide.content}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={showPrev}
        className="w-10 h-10 flex z-50 absolute left-2 top-1/2 -translate-y-1/2 justify-center items-center cursor-pointer"
      >
        <img
          src={LeftArrow}
          alt=""
          className={`transition-all duration-500 ease-in-out ${arrowColor}`}
        />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={showNext}
        className="w-10 h-10 flex z-50 absolute right-2 top-1/2 -translate-y-1/2 justify-center items-center cursor-pointer"
      >
        <img
          src={RightArrow}
          alt=""
          className={`transition-all duration-500 ease-in-out ${arrowColor}`}
        />
      </button>

      {/* Dots indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => {
              setCurrentIndex(idx);
              setCurrentSlideIndex(idx);
            }}
            className={
              `h-2 w-2 rounded-full transition-colors duration-200 ` +
              (idx === currentIndex
                ? "bg-white"
                : "bg-white/50 hover:bg-white/80")
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
