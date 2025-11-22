function PetList() {
  return (
    <>
      <div class="flex">
        <div class="w-full max-w-[280px] shrink-0 py-6">
          <div class="flex items-center border-b border-gray-300 pb-4 px-6">
            <h3 class="text-slate-900 text-lg font-semibold">Filter</h3>
            <button
              type="button"
              class="text-sm text-red-500 font-semibold ml-auto cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <div class="border-r border-gray-300 divide-y divide-gray-300">
            <div class="p-6">
              <ul class="space-y-4">
                <li class="flex items-center gap-3">
                  <input
                    type="radio"
                    id="dog"
                    name="animal"
                    class="w-4 h-4 cursor-pointer"
                    checked
                  />
                  <label
                    for="dog"
                    class="text-slate-900 font-semibold text-sm cursor-pointer"
                  >
                    Dog
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    type="radio"
                    id="cat"
                    name="animal"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="cat"
                    class="text-slate-900 font-semibold text-sm cursor-pointer"
                  >
                    Cat
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    type="radio"
                    id="other"
                    name="animal"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="other"
                    class="text-slate-900 font-semibold text-sm cursor-pointer"
                  >
                    Others
                  </label>
                </li>
              </ul>
            </div>

            <div class="p-6">
              <h6 class="text-slate-900 text-sm font-semibold">Breeds</h6>
              <div class="flex px-3 py-1.5 rounded-md border border-gray-300 bg-gray-100 overflow-hidden mt-2">
                <input
                  type="email"
                  placeholder="Search category"
                  class="w-full bg-transparent outline-none text-gray-900 text-sm"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 192.904 192.904"
                  class="w-3 fill-gray-600"
                >
                  <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
                </svg>
              </div>
              <ul class="mt-6 space-y-4">
                <li class="flex items-center gap-3">
                  <input
                    id="Gold_Retriever"
                    type="checkbox"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="Gold_Retriever"
                    class="text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    Gold Retriever
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    id="Corgi"
                    type="checkbox"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="Corgi"
                    class="text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    Corgi
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    id="Pit_Bull"
                    type="checkbox"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="Pit_Bull"
                    class="text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    Pit Bull
                  </label>
                </li>
              </ul>
            </div>

            {/* Year Slider */}

            <div class="p-6">
              <h6 class="text-slate-900 text-sm font-semibold">Color</h6>
              <div class="flex px-3 py-1.5 rounded-md border border-gray-300 bg-gray-100 overflow-hidden mt-2">
                <input
                  type="email"
                  placeholder="Search color"
                  class="w-full bg-transparent outline-none text-gray-900 text-sm"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 192.904 192.904"
                  class="w-3 fill-gray-600"
                >
                  <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
                </svg>
              </div>
              <ul class="mt-6 space-y-4">
                <li class="flex items-center gap-3">
                  <input
                    id="black"
                    type="checkbox"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="black"
                    class="flex items-center gap-2 text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    <span class="block rounded-full bg-black w-4 h-4"></span>
                    Black
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    id="blue"
                    type="checkbox"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="blue"
                    class="flex items-center gap-2 text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    <span class="block rounded-full bg-blue-600 w-4 h-4"></span>
                    Blue
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    id="purple"
                    type="checkbox"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="purple"
                    class="flex items-center gap-2 text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    <span class="block rounded-full bg-purple-600 w-4 h-4"></span>
                    Purple
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    id="orange"
                    type="checkbox"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="orange"
                    class="flex items-center gap-2 text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    <span class="block rounded-full bg-orange-600 w-4 h-4"></span>
                    Orange
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    id="pink"
                    type="checkbox"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="pink"
                    class="flex items-center gap-2 text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    <span class="block rounded-full bg-pink-600 w-4 h-4"></span>
                    Pink
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    id="yellow"
                    type="checkbox"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="yellow"
                    class="flex items-center gap-2 text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    <span class="block rounded-full bg-yellow-600 w-4 h-4"></span>
                    Yellow
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    id="red"
                    type="checkbox"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="red"
                    class="flex items-center gap-2 text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    <span class="block rounded-full bg-red-600 w-4 h-4"></span>
                    Red
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    id="green"
                    type="checkbox"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="green"
                    class="flex items-center gap-2 text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    <span class="block rounded-full bg-green-600 w-4 h-4"></span>
                    Green
                  </label>
                </li>
              </ul>
            </div>

            <div class="p-6">
              <h6 class="text-slate-900 text-sm font-semibold">Discount</h6>
              <ul class="space-y-4 mt-4">
                <li class="flex items-center gap-3">
                  <input
                    type="radio"
                    id="10"
                    name="discount"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="10"
                    class="text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    10% and above
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    type="radio"
                    id="20"
                    name="discount"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="20"
                    class="text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    20% and above
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    type="radio"
                    id="30"
                    name="discount"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="30"
                    class="text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    30% and above
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    type="radio"
                    id="40"
                    name="discount"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="40"
                    class="text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    40% and above
                  </label>
                </li>
                <li class="flex items-center gap-3">
                  <input
                    type="radio"
                    id="50"
                    name="discount"
                    class="w-4 h-4 cursor-pointer"
                  />
                  <label
                    for="50"
                    class="text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    50% and above
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="w-full p-6">
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div class="bg-gray-100 w-full h-48 rounded-md"></div>
            <div class="bg-gray-100 w-full h-48 rounded-md"></div>
            <div class="bg-gray-100 w-full h-48 rounded-md"></div>
            <div class="bg-gray-100 w-full h-48 rounded-md"></div>
            <div class="bg-gray-100 w-full h-48 rounded-md"></div>
            <div class="bg-gray-100 w-full h-48 rounded-md"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PetList;
