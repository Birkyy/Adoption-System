import Slider from "../components/Slider.jsx";

function Home() {
  return (
    <div className="snap-y snap-mandatory overflow-scroll">
      {/* Welcome Section */}
      <section className="h-screen snap-start">
        <Slider></Slider>
      </section>
      <section className="min-h-screen snap-start bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">More Content Coming Soon</h2>
          <p className="text-lg text-gray-600">
            This is your second section with snap scrolling!
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
