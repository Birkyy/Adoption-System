import { NavLink } from "react-router-dom";
import Dog from "../assets/images/welcoming-dog.png";
import Food from "../assets/images/pet-food.png";

function Register() {
  return (
    <>
      <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-bl from-grey-400 to bg-gray-100 relative overflow-hidden">
        <div class="py-5 max-lg:px-12 lg:(pl-25 pr-15)">
          <div class="grid lg:grid-cols-2 items-center justify-center max-w-6xl w-full relative z-10 shadow-2xl rounded-2xl">
            <div class="px-8 py-10 max-lg:mx-auto bg-white lg:rounded-l-2xl max-lg:rounded-2xl">
              <form class="space-y-6">
                <div class="mb-7">
                  <h1 class="text-slate-900 text-3xl font-semibold fredoka tracking-wide text-shadow-md">
                    Join our big family!
                  </h1>
                  <p class="text-slate-600 text-md mt-2 leading-relaxed fredoka">
                    Together, we can give every pet a chance at a forever home.
                  </p>
                </div>

                <div className="fredoka">
                  <label class="text-slate-900 text-sm font-medium mb-2 block text-shadow-sm">
                    Username
                  </label>
                  <div class="relative flex items-center">
                    <input
                      name="username"
                      type="text"
                      required
                      class="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-[hsl(239,100%,65%)] focus:ring-[hsl(239,100%,75%)]"
                      placeholder="Enter username"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      class="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="10"
                        cy="7"
                        r="6"
                        data-original="#000000"
                      ></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="fredoka">
                  <label class="text-slate-900 text-sm font-medium mb-2 block text-shadow-sm">
                    Email
                  </label>
                  <div class="relative flex items-center">
                    <input
                      name="email"
                      type="text"
                      required
                      class="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-[hsl(239,100%,65%)] focus:ring-[hsl(239,100%,75%)]"
                      placeholder="Enter email"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#bbb"
                      class="w-[18px] h-[18px] absolute right-4"
                    >
                      <path
                        d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="fredoka">
                  <label class="text-slate-900 text-sm font-medium mb-2 block text-shadow-sm">
                    Password
                  </label>
                  <div class="relative flex items-center">
                    <input
                      name="password"
                      type="password"
                      required
                      // SWAPPED: Default outline is the darker blue, focus ring is the lighter blue
                      class="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-[hsl(239,100%,65%)] focus:ring-[hsl(239,100%,75%)]"
                      placeholder="Enter password"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      class="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                      viewBox="0 0 128 128"
                    >
                      <path
                        d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="fredoka">
                  <label class="text-slate-900 text-sm font-medium mb-2 block text-shadow-sm">
                    Confirm Password
                  </label>
                  <div class="relative flex items-center">
                    <input
                      name="confirm-password"
                      type="password"
                      required
                      // SWAPPED: Default outline is the darker blue, focus ring is the lighter blue
                      class="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-[hsl(239,100%,65%)] focus:ring-[hsl(239,100%,75%)]"
                      placeholder="Enter confirm password"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      class="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                      viewBox="0 0 128 128"
                    >
                      <path
                        d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div class="!mt-8">
                  <button
                    type="button"
                    class="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-[hsl(239,100%,70%)] hover:bg-[hsl(239,100%,55%)] transition-colors duration-100 ease-in-out focus:outline-none cursor-pointer fredoka"
                  >
                    Sign up
                  </button>
                  <p class="text-sm !mt-6 text-center text-slate-600 fredoka">
                    Already have an account?{" "}
                    <NavLink
                      to="/signin"
                      className="text-[hsl(239,100%,70%)] hover:(text-[hsl(239,100%,55%)] underline) transition-colors duration-100 ease-in-out font-medium ml-1 whitespace-nowrap"
                    >
                      Login here
                    </NavLink>
                  </p>
                </div>
              </form>
            </div>
            <div className="bg-radial from-[#e3e0f3] to-[#bac7de] from-60% h-full w-full flex items-center justify-center rounded-r-2xl relative overflow-hidden">
              <img
                src={Dog}
                class="w-3/4 max-lg:w-0 block object-cover relative z-10"
                alt="Two dogs say welcome"
              />
              <img
                src={Food}
                alt=""
                className="absolute w-2/7 h-2/7 right-1/8 bottom-1/8"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
