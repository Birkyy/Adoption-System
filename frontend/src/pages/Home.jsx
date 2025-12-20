import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Slider from "../components/Slider.jsx";
import CardButton from "../components/CardButton.jsx";
import Card from "../components/Card.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PetFood from "../assets/icons/dog-food.svg";
import PetBowl from "../assets/icons/pet-bowl.svg";
import Collar from "../assets/icons/collar.svg";

// Import the separated API function
import { getPetsBySpecies } from "../API/PetAPI";

// Local Assets
import Dog from "../assets/images/home-dog.png";
import Cat from "../assets/images/cat.png";
import PeekingCat from "../assets/images/peeking-cat.png";
import PeekingCat2 from "../assets/images/peeking-cat-2.png";
import PeekingDog from "../assets/images/peeking-dog.png";
import SliderPets from "../assets/images/pets.png";
import SliderOwner from "../assets/images/pet-owner-1.png";
import SliderVolunteer1 from "../assets/images/volunteer-1.png";
import SliderVolunteer2 from "../assets/images/volunteer-2.png";
import PawBackground from "../assets/icons/paw.svg";
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
      // Adjust card count based on screen size
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
  // Default category 'Dog' matches your API query
  const [activeCategory, setActiveCategory] = useState("Dog");
  const [petData, setPetData] = useState([]);

  const [isInitialLoad, setIsInitialLoad] = useState(!hasSeenLoader);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Only show loading spinner on category switch, not initial load (handled by splash)
      if (!isInitialLoad) setIsFetching(true);

      try {
        // API Call using Axios function
        const response = await getPetsBySpecies(activeCategory, "Available");

        // 🟢 FIX: Handle both Old (Array) and New (Paginated Object) backend responses
        // If 'response' has .Data (PascalCase) or .data (camelCase), use that. Otherwise use response itself.
        const rawList = response.Data || response.data || response;

        // Ensure it is an array before mapping
        const petArray = Array.isArray(rawList) ? rawList : [];

        // Transform API data to match Card component props
        const formattedData = petArray.map((pet) => ({
          ...pet,
          // Use the first photo from the array, or fallback to single imageUrl, or fallback to local default
          image:
            pet.photos && pet.photos.length > 0
              ? pet.photos[0]
              : pet.imageUrl || (pet.species === "Cat" ? Cat : Dog),
        }));

        setPetData(formattedData);

        // Initial Splash Screen Logic
        if (isInitialLoad) {
          const criticalImages = [
            PeekingCat,
            PeekingDog,
            PeekingCat2,
            SliderPets,
            SliderOwner,
            SliderVolunteer1,
            SliderVolunteer2,
            // Preload a few pet images if they exist
            ...formattedData
              .slice(0, 6)
              .map((p) => p.image)
              .filter(
                (img) => typeof img === "string" && img.startsWith("http")
              ),
          ];

          await preloadImages(criticalImages);
          hasSeenLoader = true;
          setTimeout(() => {
            setIsInitialLoad(false);
          }, 800);
        }
      } catch (error) {
        console.error(error);
        setPetData([]); // Clear data on error
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
      {isInitialLoad && <LoadingScreen />}

      <div className={isInitialLoad ? "h-screen w-screen overflow-hidden" : ""}>
        <section className="h-screen snap-start snap-always">
          <Slider />
        </section>

        {/* SECTION 2: Pet List with Paw Pattern */}
        <section
          id="pet-list-section"
          className="relative min-h-screen snap-start bg-[#f8d6c4] flex flex-col items-center justify-center gap-5 sm:gap-7 lg:gap-5 overflow-hidden"
        >
          {/* 🟢 PAW PATTERN BACKGROUND (Copied from Slider 1) */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <img
              src={PawBackground}
              alt=""
              className="absolute fill-amber-800 bottom-1/3 right-7/10 opacity-10 w-1/2 -rotate-30"
            />
            <img
              src={PawBackground}
              alt=""
              className="absolute fill-amber-800 bottom-1/4 right-3/100 opacity-10 w-1/3 rotate-45"
            />
            <img
              src={PawBackground}
              alt=""
              className="absolute fill-amber-800 top-7/10 left-27/100 opacity-10 w-1/4 rotate-15"
            />
            <img
              src={PawBackground}
              alt=""
              className="absolute fill-amber-800 top-19/20 left-8/10 opacity-10 w-1/5 -rotate-15"
            />
          </div>

          {/* Category Buttons (Added relative z-10 to ensure clickability) */}
          <div className="relative z-10 space-x-5 mb-5">
            <CardButton
              contents={BUTTON_CONTENTS}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Pet Grid (Existing z-10 is good) */}
          <div className="grid grid-cols-3 gap-3 md:gap-10 lg:gap-14 relative z-10 min-h-[400px] w-full max-w-7xl px-4">
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
            ) : visibleCards.length > 0 ? (
              visibleCards
                .slice(0, 3)
                .map((pet) => <Card key={pet.petId || pet.id} content={pet} />)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-amber-900/50 mt-10">
                <p className="fredoka font-medium text-lg">
                  No pets found in this category yet.
                </p>
              </div>
            )}
          </div>

          {/* Browse More Link (Added relative z-10) */}
          <NavLink
            to="/adopt"
            className="relative z-10 md:mt-5 fredoka font-semibold tracking-wide text-lg text-[hsl(228,14%,50%)] hover:(text-[#bc9da7] text-shadow-md) text-shadow-sm transition-all duration-500 ease-in-out cursor-pointer"
          >
            Browse More
          </NavLink>

          {/* Peeking Cat (Kept at z-0 or z-10 as preferred) */}
          <img
            src={PeekingCat}
            alt=""
            className="absolute bottom-0 -right-3 max-md:h-50/100 md:max-xl:w-20/100 xl:w-18/100 z-10 pointer-events-none"
          />
        </section>

        {/* ... Rest of your sections ... */}
        <section
          id="hero-section"
          className="relative min-h-screen snap-start snap-always bg-gray-100 flex items-center justify-center box-border w-full"
        >
          <img
            src={PetFood}
            alt="Pet Food"
            className="absolute left-15 top-1/8 w-24 md:w-48 lg:w-64 opacity-20 hidden sm:block"
          />

          {/* 🟢 DECORATION: Floating Pet Drink (Right Side) */}
          <img
            src={PetBowl}
            alt="Pet Bowl"
            className="absolute right-5 bottom-1/4 w-24 md:w-48 lg:w-64 opacity-20 z-10 hidden sm:block"
          />
          <img
            src={Collar}
            alt="Collar"
            className="absolute right-2/5 bottom-0 w-24 md:w-48 lg:w-80 opacity-20 z-10 hidden sm:block rotate-12"
          />
          <div className="flex flex-col items-center justify-center gap-3 lg:gap-8 relative z-10">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold gloria">
              Your Adoption Journey
            </h1>
            <ol className="adopt-list gloria text-sm md:(text-2xl min-w-lg) lg:(text-3xl min-w-2xl) p-1 min-w-2xs rounded-sm mb-2">
              <li>Browse.</li>
              <li>Choose a pet.</li>
              <li>Fill in the form and submit.</li>
              <li>Wait for approval.</li>
              <li>You have a new friend!</li>
            </ol>
            <div className="flex flex-row gloria w-full gap-2">
              <NavLink
                to="/adopt"
                className="flex-4 text-sm font-medium py-3 bg-[#009e8c] hover:bg-amber-800 hover:transition-all duration-300 ease-in-out text-white rounded-3xl shadow-xl w-full cursor-pointer text-center flex items-center justify-center"
              >
                Ready to Adopt?
              </NavLink>
            </div>
          </div>
          <img
            src={PeekingDog}
            alt=""
            className="absolute -bottom-3 left-0 max-md:h-15/100 md:max-lg:w-38/100 lg:w-30/100 xl:w-25/100 z-0 overflow-hidden"
          />
        </section>

        {/* SECTION 4: Ready to be the Hero */}
        <section
          id="hero-section"
          className="relative min-h-screen snap-start snap-always bg-gray-100 flex items-center justify-center box-border w-full py-20"
        >
          <div className="relative flex flex-col items-center justify-center gap-10 md:gap-14 w-full max-w-7xl px-5 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold gloria text-center leading-tight">
              Ready to be the Hero?
            </h1>

            {/* 🟢 CARDS CONTAINER */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 w-full justify-center items-stretch px-4">
              {/* Card 1: Event */}
              {/* Added 'flex-1 w-full' to ensure it takes equal width in the flex container */}
              <NavLink to="/event" className="flex-1 w-full flex">
                <div className="w-full flex flex-col bg-red-300 rounded-3xl p-8 lg:p-12 shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer min-h-[400px]">
                  <div className="flex-1 flex items-center justify-center mb-6">
                    <img
                      src={Event}
                      alt="Event"
                      className="h-24 md:h-48 object-contain" // Fixed height for consistency
                    />
                  </div>
                  <div className="flex flex-col gap-3 text-center">
                    <h1 className="text-2xl md:text-3xl xl:text-4xl font-extrabold gloria text-slate-900">
                      Be the Hero in Event!
                    </h1>
                    <p className="text-sm md:text-base fredoka font-medium text-slate-800 leading-relaxed">
                      There are various events for you to join including
                      campaigns, one-day volunteer, charity bazaar, etc.
                    </p>
                  </div>
                </div>
              </NavLink>

              {/* Card 2: Shelter */}
              {/* Added 'flex-1 w-full' here too */}
              <NavLink to="/volunteer" className="flex-1 w-full flex">
                <div className="w-full flex flex-col bg-amber-200 rounded-3xl p-8 lg:p-12 shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer min-h-[400px]">
                  <div className="flex-1 flex items-center justify-center mb-6">
                    <img
                      src={Volunteer}
                      alt="Shelter"
                      className="h-24 md:h-48 object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-3 text-center">
                    <h1 className="text-2xl md:text-3xl xl:text-4xl font-extrabold gloria text-slate-900">
                      Be the Hero in Shelter!
                    </h1>
                    <p className="text-sm md:text-base fredoka font-medium text-slate-800 leading-relaxed">
                      In here, you can feed, bath and play with the animal!
                    </p>
                  </div>
                </div>
              </NavLink>
            </div>
          </div>

          <img
            src={PeekingCat2}
            alt=""
            className="absolute top-0 left-0 max-md:h-13/100 max-lg:h-20/100 lg:w-22/100 z-0 overflow-hidden pointer-events-none"
          />
        </section>
        <section className="relative min-h-screen snap-start snap-always bg-[#009e8c] flex items-center justify-center text-center px-6">
          <div className="max-w-4xl text-white z-10 flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-5xl font-bold gloria tracking-wide text-shadow-md">
              Are you an NGO or Shelter?
            </h2>
            <p className="text-lg md:text-2xl fredoka font-light opacity-95 leading-relaxed max-w-2xl">
              Partner with us to give more pets a loving home. Join our platform
              to manage adoptions, organize events, and connect with a community
              of animal lovers.
            </p>
            <NavLink
              to="/partner"
              className="mt-6 px-12 py-4 bg-amber-300 hover:bg-amber-200 text-teal-900 text-xl font-bold rounded-full shadow-xl transition-all transform hover:scale-105 hover:shadow-2xl fredoka border-2 border-amber-100"
            >
              Partner With Us
            </NavLink>
          </div>

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <svg
              className="absolute -bottom-20 -right-20 w-96 h-96 text-white animate-pulse"
              fill="currentColor"
              viewBox="0 0 200 200"
            >
              <path
                d="M45,-76C58,-69,68,-59,76,-48C84,-36,90,-23,91,-9C92,5,88,20,81,33C73,46,62,58,49,67C36,76,21,83,5,83C-11,82,-22,75,-33,66C-44,57,-55,47,-63,35C-71,23,-76,10,-75,-3C-74,-16,-67,-28,-58,-39C-49,-50,-38,-60,-26,-67C-14,-74,-1,-78,14,-80L45,-76Z"
                transform="translate(100 100)"
              />
            </svg>
            <svg
              className="absolute top-20 left-10 w-60 h-60 text-white opacity-50"
              fill="currentColor"
              viewBox="0 0 200 200"
            >
              <circle cx="100" cy="100" r="50" />
            </svg>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
