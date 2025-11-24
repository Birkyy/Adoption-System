import { useEffect, useRef } from "react";
import Cat from "../assets/mp3/cat.mp3";
import Elevator from "elevator.js";
import Button from "../assets/icons/back-to-top.svg";

function BackButton() {
  const elevatorInstance = useRef(null);

  useEffect(() => {
    // Only initialize if it doesn't exist yet
    if (!elevatorInstance.current) {
      elevatorInstance.current = new Elevator({
        // We DO NOT pass 'element' here.
        // We want to control the click manually in React's onClick.
        // Passing 'element' lets the library attach its own listener (which duplicates).
        targetElement: document.querySelector("#elevator-target"),
        endAudio: Cat,
        duration: 2000,
        startCallback: () => {
          const root = document.documentElement || document.body;
          root.style.scrollSnapType = "none";
        },
        endCallback: () => {
          const root = document.documentElement || document.body;
          root.style.scrollSnapType = "y mandatory";
        },
      });
    }
  }, []); // Empty dependency array = run once on mount

  const handleElevator = () => {
    if (elevatorInstance.current) {
      elevatorInstance.current.elevate();
    } else {
      // Fallback if library fails
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className="elevator-button group fixed bottom-10 right-10 rounded-full bg-white shadow-lg p-5 cursor-pointer transition z-50"
      onClick={handleElevator} // We control the click manually here
    >
      <img
        src={Button}
        alt="Back to top"
        className="w-5 h-5 group-hover:animate-bounce"
      />
    </div>
  );
}

export default BackButton;
