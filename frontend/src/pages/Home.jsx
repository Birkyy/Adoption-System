import Slider from "../components/Slider.jsx";
import CardButton from "../components/CardButton.jsx";
import Dog from "../assets/images/home-dog.png";
import Card from "../components/Card.jsx";
import Volunteer from "../assets/icons/animal-shelter.svg";
import Event from "../assets/icons/event.svg";
import { useState } from "react";

function Home() {
  const [button_contents] = useState([
    { id: 1, title: "Dog", image: Dog },
    { id: 2, title: "Cat", image: Dog },
    { id: 3, title: "Other", image: Dog },
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
  ]);

  return (
    <>
      {/* Welcome Section */}
      <section className="h-screen snap-start snap-always">
        <Slider></Slider>
      </section>

      {/* Pet Categories */}
      <section className="min-h-screen snap-start bg-white flex flex-col items-center justify-center gap-5 xl:gap-10">
        <div className="flex flex-row min-w-3xs justify-center gap-5 sm:gap-10 md:gap-20 lg:(gap-32 mb-5) xl:gap-40 2xl:gap-52">
          <CardButton contents={button_contents}></CardButton>
        </div>
        <div className="flex flex-col lg:flex-row gap-x-10 gap-y-10 xl:gap-x-20">
          <Card contents={dog_contents}></Card>
          <button className="text-md font-medium px-6 py-2 bg-[#009e8c] hover:bg-amber-800 hover:transition-all duration-300 ease-in-out text-white rounded-3xl shadow-xl lg:max-w-25">
            Learn More
          </button>
        </div>
      </section>

      {/* How to Adopt Section */}
      <section className="min-h-screen snap-start snap-always bg-gray-100 flex items-center justify-center box-border w-full">
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
