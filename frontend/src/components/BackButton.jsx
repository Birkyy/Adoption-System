import Cat from "../assets/mp3/cat.mp3";
import Elevator from "elevator.js";
import Button from "../assets/icons/back-to-top.svg";

function BackButton() {
  const handleElevator = () => {
    // Get the root element with snap scrolling
    const root = document.documentElement || document.body;

    // Temporarily disable snap scrolling
    root.style.scrollSnapType = "none";

    const elevator = new Elevator({
      element: document.querySelector(".elevator-button"),
      targetElement: document.querySelector("#elevator-target"),
      endAudio: Cat,
      duration: 2000,
      endCallback: () => {
        // Re-enable snap scrolling after animation
        root.style.scrollSnapType = "y mandatory";
      },
    });

    elevator.elevate();
  };

  return (
    <>
      <div
        className="elevator-button group fixed bottom-10 right-10 rounded-full bg-white shadow-lg p-5 cursor-pointer transition"
        onClick={handleElevator}
      >
        <img
          src={Button}
          alt="Back to top"
          className="w-5 h-5 group-hover:animate-bounce"
        />
      </div>
    </>
  );
}
export default BackButton;
