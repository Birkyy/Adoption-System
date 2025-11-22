import Slider from "../components/Slider.jsx";
import CardButton from "../components/CardButton.jsx";
import Dog from "../assets/images/home-dog.png";
import Cat from "../assets/images/cat.png";
import PeekingCat from "../assets/images/peeking-cat.png";
import PeekingCat2 from "../assets/images/peeking-cat-2.png";
import PeekingDog from "../assets/images/peeking-dog.png";
import DogIcon from "../assets/icons/dog.svg?react";
import CatIcon from "../assets/icons/cat.svg?react";
import Paw from "../assets/icons/paw1.svg?react";
import Card from "../components/Card.jsx";
import Volunteer from "../assets/icons/animal-shelter.svg";
import Event from "../assets/icons/event.svg";
import { useState, useEffect, useMemo } from "react";

// --- Static Data ---
const BUTTON_CONTENTS = [
  { id: 1, title: "Dog", image: DogIcon },
  { id: 2, title: "Cat", image: CatIcon },
  { id: 3, title: "Other", image: Paw },
];

// --- Custom Hook ---
function useResponsiveCards(contents) {
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setVisibleCards(contents.slice(0, 6)); // lg: 6 cards
      } else if (window.innerWidth >= 640) {
        setVisibleCards(contents.slice(0, 4)); // sm: 4 cards
      } else {
        setVisibleCards(contents.slice(0, 3)); // xs: 3 cards
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [contents]);

  return visibleCards;
}

function Home() {
  const [activeCategory, setActiveCategory] = useState("Dog");
  const [petData, setPetData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual backend URL
        const response = await fetch(
          `http://localhost:5000/api/Pets/${activeCategory}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPetData(data);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
        setPetData([]); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, [activeCategory]);

  const visibleCards = useResponsiveCards(petData);

  return (
    <>
      {/* Welcome Section */}
      <section className="h-screen snap-start snap-always">
        <Slider></Slider>
      </section>

      {/* Pet Categories */}
      <section className="relative min-h-screen snap-start bg-[#f8d6c4] flex flex-col items-center justify-center gap-5 sm:gap-7 lg:gap-5">
        <CardButton
          contents={BUTTON_CONTENTS}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <div className="max-sm:flex max-sm:flex-col max-sm:gap-y-10 grid grid-cols-2 gap-7 xl:(grid-cols-3 gap-10)  relative z-10">
          {isLoading ? (
            <p>Loading pets...</p>
          ) : (
            visibleCards.map((pet) => (
              <Card
                key={pet.id}
                content={{ ...pet, image: pet.imageUrl === "Dog" ? Dog : Cat }}
              />
            ))
          )}
        </div>
        <button className="md:mt-5 fredoka font-semibold tracking-wide text-lg text-[hsl(228,14%,50%)] hover:(text-[#bc9da7]  text-shadow-md) text-shadow-sm transition-all duration-500 ease-in-out">
          Browse More
        </button>
        <img
          src={PeekingCat}
          alt=""
          className="absolute bottom-0 -right-3 max-md:h-50/100 md:max-xl:w-20/100 xl:w-18/100 z-0"
        />
      </section>

      {/* How to Adopt Section */}
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
            <button className="flex-4 text-sm font-medium py-3 bg-[#009e8c] hover:bg-amber-800 hover:transition-all duration-300 ease-in-out text-white rounded-3xl shadow-xl w-full">
              Ready to Adopt?
            </button>
            <button className="flex-3 text-sm font-medium py-3 bg-amber-200 border-2 border-amber-800 hover:(bg-amber-500 border-amber-500 text-white) hover:transition-all duration-300 ease-in-out text-amber-800 rounded-3xl shadow-xl">
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

      {/* How to Adopt Section */}
      <section className="relative min-h-screen snap-start snap-always bg-gray-100 flex items-center justify-center box-border w-full">
        <div className="relative flex flex-col items-center justify-center gap-5 md:gap-8 w-full h-screen z-10">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold gloria">
            Ready to be the Hero?
          </h1>
          <div className="flex flex-col lg:flex-row gap-10 gloria justify-center items-center w-full">
            <div className="flex flex-col gap-1 shadow-2xl rounded-2xl bg-red-300 px-10 py-5 w-3/4 md:(w-4/7 px-15) max-lg:min-h-1/2 lg:max-w-2/5">
              <img src={Event} alt="" className="h-25 md:h-40 self-center" />
              <h1 className="text-lg md:text-2xl xl:text-4xl font-extrabold">
                Be the Hero in Event!
              </h1>
              <p className="text-xs md:text-sm">
                There are various events for you to join including campaigns,
                one-day volunteer, charity bazaar, etc.
              </p>
            </div>
            <div className="flex flex-col gap-1 shadow-2xl rounded-2xl bg-amber-200 px-10 py-5 w-3/4 md:(w-4/7 px-15) max-lg:min-h-1/2 lg:(max-w-2/5)">
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
    </>
  );
}

export default Home;
