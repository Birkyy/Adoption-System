import dog from "../assets/images/home-dog.png";

function Home() {
  return (
    <div>
      {/* Welcome Section */}
      <section className="h-screen bg-[#ffebcd] flex items-center justify-center pb-40 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Circles */}
          <div className="absolute top-90 right-100 w-100 h-100 bg-orange-200 rounded-full opacity-30"></div>
          <div className="absolute bottom-110 left-250 w-100 h-100 bg-orange-200 rounded-full opacity-40"></div>
          <div className="absolute bottom-130 right-320 w-100 h-100 bg-orange-200 rounded-full opacity-25"></div>
          <div className="absolute top-120 right-250 w-120 h-120 bg-orange-200 rounded-full opacity-35"></div>
          <div className="absolute top-80 left-330 w-120 h-120 bg-orange-200 rounded-full opacity-30"></div>
        </div>

        <div className="flex flex-row w-full max-w-7xl gap-10 relative z-10">
          {/* Left side - Text content */}
          <div className="flex-4 flex flex-col justify-center items-end">
            <div className="max-w-lg">
              <h1 className="text-6xl font-bold h-color mb-6 navbar">
                Adopt. Not Shop.
              </h1>
              <p className="text-xl p-color navbar mb-8">
                Give a loving home to pets in need. Find your perfect companion
                and make a difference in their lives.
              </p>
              <div className="flex gap-4">
                <button className="btn-color text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Find a Pet
                </button>
                <button className="border-2 border-[hsl(36,100%,40%)] text-[hsl(36,100%,40%)] px-6 py-3 rounded-lg font-semibold hover:border-[hsl(36,100%,60%)] hover:text-[hsl(36,100%,60%)] transition-colors flex items-center gap-2">
                  Check Eligibility
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex-3 flex justify-start">
            <img src={dog} alt="dog" className="w-2/3 h-auto object-contain" />
          </div>
        </div>
      </section>

      <section className="h-screen"></section>
    </div>
  );
}

export default Home;
