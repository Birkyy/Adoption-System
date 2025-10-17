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
import { useState, useEffect } from "react";

function Home() {
  const [activeCategory, setActiveCategory] = useState("Dog");

  const [button_contents] = useState([
    { id: 1, title: "Dog", image: DogIcon },
    { id: 2, title: "Cat", image: CatIcon },
    { id: 3, title: "Other", image: Paw },
  ]);

  const [dog_contents] = useState([
    {
      id: 1,
      image: Dog,
      name: "Buddy",
      breed: "Golden Retriever",
      age: "2 years",
    },
    { id: 2, image: Dog, name: "Max", breed: "Labrador", age: "3 years" },
    { id: 3, image: Dog, name: "Bella", breed: "Beagle", age: "1 year" },
    {
      id: 4,
      image: Dog,
      name: "Buddy",
      breed: "Golden Retriever",
      age: "2 years",
    },
    { id: 5, image: Dog, name: "Max", breed: "Labrador", age: "3 years" },
    { id: 6, image: Dog, name: "Bella", breed: "Beagle", age: "1 year" },
  ]);

  const [cat_contents] = useState([
    {
      id: 1,
      image: Cat,
      name: "Whiskers",
      breed: "Persian",
      age: "1 year",
    },
    { id: 2, image: Cat, name: "Luna", breed: "Siamese", age: "2 years" },
    { id: 3, image: Cat, name: "Oliver", breed: "Maine Coon", age: "3 years" },
    {
      id: 4,
      image: Cat,
      name: "Mittens",
      breed: "Ragdoll",
      age: "1 year",
    },
    {
      id: 5,
      image: Cat,
      name: "Shadow",
      breed: "British Shorthair",
      age: "2 years",
    },
    { id: 6, image: Cat, name: "Cleo", breed: "Sphynx", age: "1 year" },
  ]);

  const [other_contents] = useState([
    {
      id: 1,
      image: Dog, // Replace with actual other pet image
      name: "Hoppy",
      breed: "Rabbit",
      age: "1 year",
    },
    { id: 2, image: Dog, name: "Nibbles", breed: "Hamster", age: "6 months" },
    { id: 3, image: Dog, name: "Polly", breed: "Parrot", age: "2 years" },
  ]);

  // Get the current content based on active category
  const getCurrentContent = () => {
    switch (activeCategory) {
      case "Dog":
        return dog_contents;
      case "Cat":
        return cat_contents;
      case "Other":
        return other_contents;
      default:
        return dog_contents;
    }
  };

  function useResponsiveCards(contents) {
    const [visibleCards, setVisibleCards] = useState([]);

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 1280)
          setVisibleCards(contents.slice(0, 6)); // lg: 6 cards
        else if (window.innerWidth >= 640)
          setVisibleCards(contents.slice(0, 4)); // sm: 4 cards
        else setVisibleCards(contents.slice(0, 3)); // xs: 3 card
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [contents]);

    return visibleCards;
  }

  const visibleCards = useResponsiveCards(getCurrentContent());

  return (
    <>
      {/* Welcome Section */}
      <section className="h-screen snap-start snap-always">
        <Slider></Slider>
      </section>

      {/* Pet Categories */}
      <section className="relative min-h-screen snap-start bg-[#f8d6c4] flex flex-col items-center justify-center gap-5 sm:gap-7 lg:gap-5">
        <CardButton
          contents={button_contents}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <div className="max-sm:flex max-sm:flex-col max-sm:gap-y-10 grid grid-cols-2 gap-7 xl:(grid-cols-3 gap-10)  relative z-10">
          <Card contents={visibleCards}></Card>
        </div>
        <button className="md:mt-5 fredoka font-semibold tracking-wide text-lg text-[hsl(228,14%,50%)] hover:(text-[#bc9da7]  text-shadow-md) text-shadow-sm transition-all duration-500 ease-in-out">
          Browse More
        </button>
        <img
          src={PeekingCat}
          alt=""
          className="absolute bottom-0 -right-3 max-md:h-50/100 md:max-xl:w-20/100 xl:w-18/100 z-0"
        />
        <img
          src={PeekingDog}
          alt=""
          className="absolute -bottom-3 left-0 max-md:h-15/100 md:max-lg:w-38/100 lg:w-30/100 xl:w-25/100 z-0 overflow-hidden"
        />
        <img
          src={PeekingCat2}
          alt=""
          className="absolute top-0 left-0 max-md:h-13/100 max-lg:h-20/100 lg:w-22/100 z-0 overflow-hidden"
        />
      </section>

      {/* How to Adopt Section */}
      <section className="relative min-h-screen snap-start snap-always bg-gray-100 flex items-center justify-center box-border w-full">
        <div className="flex flex-col items-center justify-center gap-3 lg:gap-8">
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
      </section>

      {/* How to Adopt Section */}
      <section className="min-h-screen snap-start snap-always bg-gray-100 flex items-center justify-center box-border w-full">
        <div className="flex flex-col items-center justify-center gap-20 lg:gap-15">
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold gloria">
            Ready to be the Hero?
          </h1>
          <div className="flex flex-row gap-20 gloria max-w-6xl">
            <div className="flex flex-col flex-1 shadow-2xl rounded-2xl bg-red-300 p-5">
              <img src={Event} alt="" />
              <h1 className="text-4xl font-extrabold px-10">
                Be the Hero in Event!
              </h1>
              <p className="px-10 py-5">
                There are various events for you to join including campaigns,
                one-day volunteer, charity bazaar, etc.
              </p>
            </div>
            <div className="flex flex-col flex-1 rounded-2xl shadow-2xl bg-amber-200 p-5">
              <img src={Volunteer} alt="" />
              <h1 className="text-4xl font-extrabold px-10">
                Be the Hero in Shelter!
              </h1>
              <p className="px-10 py-5">
                In here, you can feed, bath and play with the animal!
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
