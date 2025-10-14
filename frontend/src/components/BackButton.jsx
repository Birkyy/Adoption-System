import Cat from "../assets/mp3/cat.mp3";
import Elevator from "elevator.js";

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
        className="elevator-button fixed bottom-4 right-4 rounded-full bg-white shadow-lg p-10 cursor-pointer"
        onClick={handleElevator}
      >
        Testing
      </div>
    </>
  );
}
export default BackButton;
