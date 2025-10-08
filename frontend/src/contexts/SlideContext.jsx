import { createContext, useContext, useState } from "react";

const SlideContext = createContext();

export function SlideProvider({ children }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  return (
    <SlideContext.Provider value={{ currentSlideIndex, setCurrentSlideIndex }}>
      {children}
    </SlideContext.Provider>
  );
}

export function useSlide() {
  const context = useContext(SlideContext);
  if (context === undefined) {
    throw new Error("useSlide must be used within a SlideProvider");
  }
  return context;
}
