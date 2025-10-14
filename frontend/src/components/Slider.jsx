import { useEffect, useRef, useState } from "react";
import Pets from "../assets/images/pets.png";
import PetOwner1 from "../assets/images/pet-owner-1.png";
import Volunteer1 from "../assets/images/volunteer-1.png";
import Volunteer2 from "../assets/images/volunteer-2.png";
import Paw from "../assets/icons/paw.svg";
import DogFood from "../assets/icons/dog-food.svg";
import PetBowl from "../assets/icons/pet-bowl.svg";
import Collar from "../assets/icons/collar.svg";
import VolunteerIcon from "../assets/icons/animal-volunteer.svg";
import { useSlide } from "../contexts/SlideContext";

function Slider() {
  const { setCurrentSlideIndex } = useSlide();

  const slides = [
    // Slide 1
    {
      id: 1,
      bg: "bg-amber-600",
      content: (
        <div className="xl:space-y-1 flex lg:flex-row flex-col-reverse justify-center items-center md:min-w-5xl xl:min-w-7xl h-full md:gap-5 xl:gap-10 relative">
          <div className="z-1">
            <img
              src={Paw}
              alt=""
              className="absolute fill-amber-800 bottom-1/3 right-7/10 opacity-10 w-1/2 -rotate-30"
            />
            <img
              src={Paw}
              alt=""
              className="absolute fill-amber-800 bottom-1/4 right-3/100 opacity-10 w-1/3 rotate-45"
            />
            <img
              src={Paw}
              alt=""
              className="absolute fill-amber-800 top-7/10 left-27/100 opacity-10 w-1/4 rotate-15"
            />
            <img
              src={Paw}
              alt=""
              className="absolute fill-amber-800 top-19/20 left-8/10 opacity-10 w-1/5 -rotate-15"
            />
          </div>

          <div className="flex flex-col justify-center fredoka min-w-3xs md:max-w-md xl:max-w-lg z-2">
            <h1 className="heading text-5xl md:text-7xl xl:text-8xl font-semibold mb-5 text-shadow-md text-shadow-amber-700">
              Meet{" "}
              <span className="text-[#ffbfbe] text-shadow-[hsl(1,100%,67%)]">
                Your
              </span>{" "}
              <br />
              New Buddy!
            </h1>
            <p className="text-xs md:text-xl xl:text-2xl text-gray-200 mb-6 sm:mb-7 xl:mb-10">
              Bring home a friend who'll love you furever —<br /> no conditions,
              just paws and love.
            </p>
            <button className="text-lg font-medium px-6 py-2 bg-[hsl(173,100%,31%)] hover:bg-amber-800 hover:transition-all duration-300 ease-in-out text-white rounded-3xl shadow-lg">
              Learn More
            </button>
          </div>
          <div className="md:max-w-4/10 lg:max-w-30/100 xl:max-w-2/5">
            <img
              src={Pets}
              className="z-10 object-cover object-center relative"
              alt=""
            />
          </div>
        </div>
      ),
    },

    //Slide 2
    {
      id: 2,
      bg: "bg-[#ff8550]",
      content: (
        <div className="flex lg:flex-row flex-col justify-center items-center min-w-3xs md:min-w-5xl xl:min-w-7xl h-full md:gap-5 xl:gap-10 relative">
          {/* Decoration */}
          <div className="z-0">
            <img
              src={DogFood}
              alt=""
              className="absolute opacity-10 w-1/3 -rotate-15 left-10/100 top-87/100"
            />
            <img
              src={PetBowl}
              alt=""
              className="absolute opacity-10 w-1/4 left-67/100 top-57/100 -rotate-2"
            />
            <img
              src={Collar}
              alt=""
              className="absolute opacity-10 w-1/3 left-33/100 bottom-37/100 rotate-20"
            />
          </div>
          <div className="md:max-w-xs xl:max-w-md z-2 object-cover object-center">
            <img src={PetOwner1} alt="" />
          </div>
          <div className="flex flex-col justify-center fredoka md:max-w-lg xl:max-w-2xl z-2">
            <h1 className="text-4xl md:text-7xl xl:text-8xl font-semibold mb-5 text-shadow-sm text-shadow-[hsl(18,100%,46%)]">
              Ready to be{" "}
              <span className="text-[#eae5c8] text-shadow-[#cec27e]">
                <br />
                Super
              </span>{" "}
              Owner?
            </h1>
            <p className="text-xs md:text-xl xl:text-2xl text-gray-50 mb-6 sm:mb-7 xl:mb-10">
              Being a Super Owner isn’t about perfection — <br />
              it’s about love and the willingness to learn.
            </p>
            <button className="px-6 py-2 bg-[hsl(173,100%,31%)] hover:bg-amber-800 hover:transition-all duration-300 ease-in-out text-white rounded-3xl shadow-lg max-w-xl">
              Learn More
            </button>
          </div>
        </div>
      ),
    },

    //Slide 3
    {
      id: 3,
      bg: "bg-[#d5a07d]",
      content: (
        <div className="flex lg:flex-row flex-col-reverse justify-center items-center min-w-3xs md:min-w-5xl xl:min-w-7xl h-full xl:gap-10 relative">
          {/* Decoration */}
          <div className="z-0">
            <img
              src={VolunteerIcon}
              alt=""
              className="absolute opacity-10 w-1/3 -rotate-15 left-14/100 top-87/100"
            />
            <img
              src={VolunteerIcon}
              alt=""
              className="absolute opacity-10 w-1/3 -rotate-15 left-67/100 top-17/100"
            />
            <img
              src={VolunteerIcon}
              alt=""
              className="absolute opacity-10 w-1/3 -rotate-15 right-47/100 bottom-77/100"
            />
          </div>
          <div className="max-lg:invisible max-lg:w-0 max-w-7/10 md:max-w-3xs md:mr-8 xl:max-w-xs z-2 object-cover object-center">
            <img src={Volunteer1} alt="" />
          </div>
          <div className="flex flex-col justify-center fredoka md:max-w-sm xl:max-w-lg z-2">
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-semibold mb-5 text-shadow-sm text-shadow-[hsl(24,51%,46%)]">
              Let's Join the{" "}
              <span className="text-[hsl(19,100%,35%)] text-shadow-[hsl(19,100%,15%)]">
                Pawty!
              </span>{" "}
            </h1>
            <p className="md:text-xl xl:text-2xl text-gray-50 mb-6 sm:mb-7 xl:mb-10">
              Be part of the pawty! Come and join through volunteer or support
              at our upcoming paw-some events!
            </p>
            <button className="px-6 py-2 bg-[hsl(173,100%,31%)] hover:bg-amber-800 hover:transition-all duration-300 ease-in-out text-white rounded-3xl shadow-lg max-w-10/11">
              Learn More
            </button>
          </div>
          <div className="max-lg:mb-5 max-w-2/3 md:max-w-1/5 xl:max-w-3xs z-2 object-cover object-left">
            <img src={Volunteer2} alt="" />
          </div>
        </div>
      ),
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalMs = 10000; // autoplay duration
  const intervalRef = useRef(null);

  // Define arrow colors for each slide (adjust if needed)
  const getArrowColor = () => {
    switch (currentIndex) {
      case 0:
        return "text-white";
      case 1:
        return "text-white";
      case 2:
        return "text-white";
      default:
        return "filter brightness-0";
    }
  };
  const arrowColor = getArrowColor();

  // Sync context with current index
  useEffect(() => {
    setCurrentSlideIndex(currentIndex);
  }, [currentIndex, setCurrentSlideIndex]);

  // clear interval helper
  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // start the autoplay interval
  const startTimer = () => {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);
  };

  // reset timer after manual action
  const resetTimer = () => {
    startTimer();
  };

  // start timer on mount and whenever interval or slide count changes
  useEffect(() => {
    startTimer();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs, slides.length]);

  function showPrev() {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    setCurrentIndex(newIndex);
    setCurrentSlideIndex(newIndex);
    resetTimer();
  }

  function showNext() {
    const newIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(newIndex);
    setCurrentSlideIndex(newIndex);
    resetTimer();
  }

  // Keyboard accessibility: left/right arrows to navigate
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        showPrev();
      } else if (e.key === "ArrowRight") {
        showNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // We intentionally don't include showPrev/showNext in deps to avoid re-adding listener too often.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, slides.length]);

  return (
    <div className="carousel h-screen w-screen relative overflow-hidden overscroll-contain">
      <div
        className="list absolute inset-0 flex h-full w-full transition-transform duration-500 ease-out"
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
        className="w-10 h-10 flex z-50 absolute left-2 top-1/2 -translate-y-1/2 justify-center items-center cursor-pointer text-white hover:text-gray-300 transition delay-150 duration-300 ease-in-out"
      >
        {/* Left Arrow */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Next slide"
        onClick={showNext}
        className="w-10 h-10 flex z-50 absolute right-2 top-1/2 -translate-y-1/2 justify-center items-center cursor-pointer text-white hover:text-gray-300 transition delay-150 duration-300 ease-in-out"
      >
        {/* Right Arrow */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
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
              resetTimer();
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
