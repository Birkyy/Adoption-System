function PetDetail() {
  return (
    <div class="tracking-wide max-md:mx-auto">
      <div class="bg-gradient-to-r from-gray-600 via-gray-900 to-gray-900 md:min-h-[350px] grid items-start grid-cols-1 lg:grid-cols-5 md:grid-cols-2">
        <div class="lg:col-span-3 h-full p-6">
          <div class="relative h-full flex items-center justify-center lg:min-h-[580px]">
            <img
              src="https://readymadeui.com/images/watch6.webp"
              alt="Product"
              class="lg:w-3/5 w-3/4 aspect-[511/580] object-contain max-lg:p-8"
            />

            <div class="flex space-x-4 items-end absolute right-0 max-md:right-4 bottom-0">
              <div class="bg-white w-9 h-9 grid items-center justify-center rounded-full rotate-90 shrink-0 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3 h-3 fill-[#333] inline"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                    clip-rule="evenodd"
                    data-original="#000000"
                  ></path>
                </svg>
              </div>
              <div class="bg-[#333] w-9 h-9 grid items-center justify-center rounded-full -rotate-90 shrink-0 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3 h-3 fill-[#fff] inline"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                    clip-rule="evenodd"
                    data-original="#000000"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 bg-gray-100 h-full px-8 py-12 fredoka flex flex-col gap-2">
          <h1 className="text-4xl font-semibold tracking-wider">Bobby</h1>
          <p className="text-xl font-semibold">2 years old</p>
          <p className="text-xl font-semibold">Gold Retriever</p>

          <div class="flex gap-4 mt-8">
            <button
              type="button"
              class="w-full max-w-[200px] px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-sm cursor-pointer"
            >
              Adopt now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetDetail;
