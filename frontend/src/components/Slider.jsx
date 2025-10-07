import { useEffect, useState } from "react";
import Dog from "../assets/images/home-dog.png";
import LeftArrow from "../assets/icons/left-arrow.svg";
import RightArrow from "../assets/icons/right-arrow.svg";

function Slider() {
  const slides = [
    {
      id: 1,
      bg: "bg-amber-600",
      content: (
        <div className="max-w-2xl space-y-4">
          <h1 className="text-5xl font-bold">Adopt Love</h1>
          <p className="text-lg">Find your new best friend today.</p>
          <button className="px-4 py-2 bg-white text-black rounded">
            Browse
          </button>
        </div>
      ),
    },
    {
      id: 2,
      bg: "bg-amber-500",
      content: (
        <div className="grid grid-cols-2 gap-6 items-center">
          <img src={Dog} alt="Dog" className="rounded-lg" />
          <div>
            <h2 className="text-3xl font-semibold">Events Near You</h2>
            <ul className="list-disc pl-6">
              <li>Adoption Fair - Oct 12</li>
              <li>Volunteer Drive - Oct 20</li>
            </ul>
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

  function showPrev() {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }

  function showNext() {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }

  // Always-on autoplay
  useEffect(
    () => {
      //Change slide after 10 secs
      const id = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, intervalMs);

      //Clear the old timer
      return () => clearInterval(id);
    },
    //rerun if any of the value changes
    [intervalMs, slides.length]
  );

  return (
    <div className="carousel h-screen w-screen relative overflow-hidden">
      <div
        className="list absolute inset-0 flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`item ${slide.bg} min-w-full h-full relative`}
          >
            <div className="content absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
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
        <img src={LeftArrow} alt="" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={showNext}
        className="w-10 h-10 flex z-50 absolute right-2 top-1/2 -translate-y-1/2 justify-center items-center cursor-pointer"
      >
        <img src={RightArrow} alt="" />
      </button>

      {/* Dots indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setCurrentIndex(idx)}
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
