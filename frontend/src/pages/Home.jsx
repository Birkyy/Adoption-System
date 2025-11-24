import { useState, useEffect } from "react";
import Slider from "../components/Slider.jsx";
import CardButton from "../components/CardButton.jsx";
import Card from "../components/Card.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";

import Dog from "../assets/images/home-dog.png";
import Cat from "../assets/images/cat.png";
import PeekingCat from "../assets/images/peeking-cat.png";
import PeekingCat2 from "../assets/images/peeking-cat-2.png";
import PeekingDog from "../assets/images/peeking-dog.png";
import SliderPets from "../assets/images/pets.png";
import SliderOwner from "../assets/images/pet-owner-1.png";
import SliderVolunteer1 from "../assets/images/volunteer-1.png";
import SliderVolunteer2 from "../assets/images/volunteer-2.png";

import DogIcon from "../assets/icons/dog.svg?react";
import CatIcon from "../assets/icons/cat.svg?react";
import Paw from "../assets/icons/paw1.svg?react";
import Volunteer from "../assets/icons/animal-shelter.svg";
import Event from "../assets/icons/event.svg";

// --- Static Data ---
const BUTTON_CONTENTS = [
  { id: 1, title: "Dog", image: DogIcon },
  { id: 2, title: "Cat", image: CatIcon },
  { id: 3, title: "Other", image: Paw },
];

let hasSeenLoader = false;

function useResponsiveCards(contents) {
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setVisibleCards(contents.slice(0, 6));
      } else if (window.innerWidth >= 640) {
        setVisibleCards(contents.slice(0, 4));
      } else {
        setVisibleCards(contents.slice(0, 3));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [contents]);

  return visibleCards;
}

const preloadImages = (imageArray) => {
  const promises = imageArray.map((src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = resolve;
    });
  });
  return Promise.all(promises);
};

function Home() {
  const [activeCategory, setActiveCategory] = useState("Dog");
  const [petData, setPetData] = useState([]);

  // Use the global flag for initial state
  const [isInitialLoad, setIsInitialLoad] = useState(!hasSeenLoader);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!isInitialLoad) setIsFetching(true);

      try {
        const response = await fetch(
          `https://localhost:7001/api/Pets?species=${activeCategory}&status=Available`
        );
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        setPetData(data);

        if (isInitialLoad) {
          const criticalImages = [
            PeekingCat,
            PeekingDog,
            PeekingCat2,
            SliderPets,
            SliderOwner,
            SliderVolunteer1,
            SliderVolunteer2,
            ...data.slice(0, 6).map((p) => (p.imageUrl === "Dog" ? Dog : Cat)),
          ];

          await preloadImages(criticalImages);

          hasSeenLoader = true;

          setTimeout(() => {
            setIsInitialLoad(false);
          }, 800);
        }
      } catch (error) {
        console.error(error);
        setPetData([]);
        setIsInitialLoad(false);
        hasSeenLoader = true;
      } finally {
        setIsFetching(false);
      }
    };

    loadData();
  }, [activeCategory]);

  const visibleCards = useResponsiveCards(petData);

  return (
    <>
      {/* Only show LoadingScreen if we are in the Initial Load phase */}
      {isInitialLoad && <LoadingScreen />}

      {/* Hide content overflow while loading to prevent scrollbar jumps */}
      <div className={isInitialLoad ? "h-screen w-screen overflow-hidden" : ""}>
        <section className="h-screen snap-start snap-always">
          <Slider />
        </section>

        <section className="relative min-h-screen snap-start bg-[#f8d6c4] flex flex-col items-center justify-center gap-5 sm:gap-7 lg:gap-5">
          <CardButton
            contents={BUTTON_CONTENTS}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <div className="max-sm:flex max-sm:flex-col max-sm:gap-y-10 grid grid-cols-2 gap-7 xl:(grid-cols-3 gap-10) relative z-10 min-h-[400px]">
            {isFetching ? (
              <div className="col-span-full flex flex-col items-center justify-center text-amber-900/50">
                <svg
                  className="w-10 h-10 animate-spin mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="fredoka font-medium">Finding friends...</p>
              </div>
            ) : (
              visibleCards.map((pet) => (
                <Card
                  key={pet.id}
                  content={{
                    ...pet,
                    image: pet.imageUrl === "Dog" ? Dog : Cat,
                  }}
                />
              ))
            )}
          </div>

          <button className="md:mt-5 fredoka font-semibold tracking-wide text-lg text-[hsl(228,14%,50%)] hover:(text-[#bc9da7] text-shadow-md) text-shadow-sm transition-all duration-500 ease-in-out cursor-pointer">
            Browse More
          </button>
          <img
            src={PeekingCat}
            alt=""
            className="absolute bottom-0 -right-3 max-md:h-50/100 md:max-xl:w-20/100 xl:w-18/100 z-0"
          />
        </section>

        <section className="relative min-h-screen snap-start snap-always bg-gray-100 flex items-center justify-center box-border w-full">
          <div className="flex flex-col items-center justify-center gap-3 lg:gap-8 relative z-10">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold gloria">
              Your Adoption Journey
            </h1>
            <ol className="adopt-list gloria text-sm md:(text-2xl min-w-lg) lg:(text-3xl min-w-2xl) p-1 min-w-2xs rounded-sm mb-2">
              <li>Browse.</li>
              <li>Choose a pet.</li>
              <li>Check the criteria.</li>
              <li>Fill in the form and submit.</li>
              <li>Wait for approval.</li>
              <li>Book a time with the NGO.</li>
              <li>You have a new friend!</li>
            </ol>
            <div className="flex flex-row gloria w-full gap-2">
              <button className="flex-4 text-sm font-medium py-3 bg-[#009e8c] hover:bg-amber-800 hover:transition-all duration-300 ease-in-out text-white rounded-3xl shadow-xl w-full cursor-pointer">
                Ready to Adopt?
              </button>
              <button className="flex-3 text-sm font-medium py-3 bg-amber-200 border-2 border-amber-800 hover:(bg-amber-500 border-amber-500 text-white) hover:transition-all duration-300 ease-in-out text-amber-800 rounded-3xl shadow-xl cursor-pointer">
                Learn More
              </button>
            </div>
          </div>
          <img
            src={PeekingDog}
            alt=""
            className="absolute -bottom-3 left-0 max-md:h-15/100 md:max-lg:w-38/100 lg:w-30/100 xl:w-25/100 z-0 overflow-hidden"
          />
        </section>

        <section className="relative min-h-screen snap-start snap-always bg-gray-100 flex items-center justify-center box-border w-full">
          <div className="relative flex flex-col items-center justify-center gap-5 md:gap-8 w-full h-screen z-10">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold gloria">
              Ready to be the Hero?
            </h1>
            <div className="flex flex-col lg:flex-row gap-10 gloria justify-center items-center w-full">
              <div className="flex flex-col gap-1 shadow-2xl rounded-2xl bg-red-300 px-10 py-5 w-3/4 md:(w-4/7 px-15) max-lg:min-h-1/2 lg:max-w-2/5 transition-transform hover:scale-105 duration-300">
                <img src={Event} alt="" className="h-25 md:h-40 self-center" />
                <h1 className="text-lg md:text-2xl xl:text-4xl font-extrabold">
                  Be the Hero in Event!
                </h1>
                <p className="text-xs md:text-sm">
                  There are various events for you to join including campaigns,
                  one-day volunteer, charity bazaar, etc.
                </p>
              </div>
              <div className="flex flex-col gap-1 shadow-2xl rounded-2xl bg-amber-200 px-10 py-5 w-3/4 md:(w-4/7 px-15) max-lg:min-h-1/2 lg:(max-w-2/5) transition-transform hover:scale-105 duration-300">
                <img
                  src={Volunteer}
                  alt=""
                  className="h-25 md:h-40 self-center"
                />
                <h1 className="text-lg md:text-2xl xl:text-4xl font-extrabold">
                  Be the Hero in Shelter!
                </h1>
                <p className="text-xs md:text-sm">
                  In here, you can feed, bath and play with the animal!
                </p>
              </div>
            </div>
          </div>
          <img
            src={PeekingCat2}
            alt=""
            className="absolute top-0 left-0 max-md:h-13/100 max-lg:h-20/100 lg:w-22/100 z-0 overflow-hidden"
          />
        </section>
      </div>
    </>
  );
}

export default Home;
