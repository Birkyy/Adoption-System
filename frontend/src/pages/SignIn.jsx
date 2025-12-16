import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser } from "../API/AuthAPI";
import { useAuth } from "../contexts/AuthContext";
import Dog from "../assets/images/welcoming-dog.png";
import Food from "../assets/images/pet-food.png";
import toast from "react-hot-toast";

// Helper to parse ASP.NET backend errors
const getErrorMessage = (error) => {
  // 1. Handle Backend Errors (400, 401, 500)
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (typeof data === "string") return data;
    if (data.errors) {
      const firstErrorKey = Object.keys(data.errors)[0];
      if (firstErrorKey) return data.errors[firstErrorKey][0];
    }
    if (data.title) return data.title;
  }

  // 2. Handle Frontend/Network Errors (Real Crashes)
  if (error instanceof Error) {
    console.error("Frontend Logic Error:", error); // Log real error to console
    return error.message; // Show the real crash reason (temporary)
  }

  return "Invalid email or password.";
};

function SignIn() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // Image Loading States
  const [dogLoaded, setDogLoaded] = useState(false);
  const [foodLoaded, setFoodLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.userRole === "Admin") {
        navigate("/admin");
      } else if (user.userRole === "NGO") {
        navigate("/ngo");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setError("");
    const loadingToast = toast.loading("Signing in...");

    try {
      // 1. Call API (returns the data object directly)
      const data = await loginUser(email, password);

      console.log("Login Data:", data); // Debug: Check if keys are 'User' or 'user'

      // 2. Handle Case Sensitivity (.NET sends 'User', React usually likes 'user')
      const userData = data.user || data.User;
      const token = data.token || data.Token;

      if (!userData || !token) {
        throw new Error("Login succeeded but User data is missing.");
      }

      // 3. Update Context
      login(userData, token, rememberMe);

      toast.dismiss(loadingToast);
      toast.success(
        `Welcome back, ${userData.name || userData.Name || "User"}!`
      );
    } catch (err) {
      toast.dismiss(loadingToast);

      const msg = getErrorMessage(err);
      console.error("Login Error:", err);
      toast.error(msg);
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 relative overflow-hidden">
      <div className="py-5 max-lg:px-12 lg:(pl-25 pr-15)">
        <div className="grid lg:grid-cols-2 items-center justify-center max-w-6xl w-full relative z-10 shadow-2xl rounded-2xl">
          {/* LEFT COLUMN: FORM */}
          <div className="px-8 py-10 max-lg:mx-auto bg-white lg:rounded-l-2xl max-lg:rounded-2xl">
            <form className="space-y-6">
              <div className="mb-10">
                <h1 className="text-slate-900 text-3xl font-semibold fredoka tracking-wide text-shadow-md">
                  Welcome back!
                </h1>
                <p className="text-slate-600 text-md mt-4 leading-relaxed fredoka">
                  Sign in to find your next furry friend and stay connected.
                </p>
              </div>

              {/* Email Field */}
              <div className="fredoka">
                <label className="text-slate-900 text-sm font-medium mb-2 block text-shadow-sm">
                  Email
                </label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-[hsl(239,100%,65%)] focus:ring-[hsl(239,100%,75%)]"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-4"
                  >
                    <path
                      d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Password Field */}
              <div className="fredoka">
                <label className="text-slate-900 text-sm font-medium mb-2 block text-shadow-sm">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-[hsl(239,100%,65%)] focus:ring-[hsl(239,100%,75%)]"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                    viewBox="0 0 128 128"
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center font-medium animate-pulse">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 shrink-0 text-[hsl(239,100%,65%)] focus:ring-[hsl(239,100%,75%)] border-slate-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-slate-900 fredoka"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="javascript:void(0);"
                    className="text-[hsl(239,100%,70%)] hover:(text-[hsl(239,100%,55%)] underline) transition-colors duration-100 ease-in-out font-medium fredoka"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div className="!mt-10">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-[hsl(239,100%,70%)] hover:bg-[hsl(239,100%,55%)] transition-colors duration-100 ease-in-out focus:outline-none cursor-pointer fredoka"
                >
                  Sign in
                </button>
                <p className="text-sm !mt-6 text-center text-slate-600 fredoka">
                  Don't have an account?{" "}
                  <NavLink
                    to="/register"
                    className="text-[hsl(239,100%,70%)] hover:(text-[hsl(239,100%,55%)] underline) transition-colors duration-100 ease-in-out font-medium ml-1 whitespace-nowrap"
                  >
                    Register here
                  </NavLink>
                </p>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: IMAGES */}
          <div className="bg-radial from-[#e3e0f3] to-[#bac7de] from-60% h-full w-full flex items-center justify-center rounded-r-2xl relative overflow-hidden">
            <img
              src={Dog}
              onLoad={() => setDogLoaded(true)}
              className={`w-3/4 max-lg:w-0 block object-cover relative z-10 transition-opacity duration-1000 ease-out ${
                dogLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              alt="Two dogs say welcome"
            />
            <img
              src={Food}
              onLoad={() => setFoodLoaded(true)}
              alt=""
              className={`absolute w-2/7 h-2/7 right-1/8 bottom-1/8 max-lg:hidden transition-opacity duration-1000 delay-200 ease-out ${
                foodLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
