import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { registerPublicUser } from "../API/AuthAPI";
import Dog from "../assets/images/welcoming-dog.png";
import Food from "../assets/images/pet-food.png";
import toast, { Toaster } from "react-hot-toast";

const preloadImages = (imageArray) => {
  const promises = imageArray.map((src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = resolve;
    });
  });
  return Promise.all(promises);
};

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    contactInfo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        await preloadImages([Dog, Food]);
        setImagesLoaded(true);
      } catch (err) {
        setImagesLoaded(true);
      }
    };
    loadAssets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const loadingToast = toast.loading("Creating your account...");

    try {
      const payload = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contactInfo: formData.contactInfo,
      };

      await registerPublicUser(payload);

      toast.dismiss(loadingToast);
      toast.success("Registration successful! Redirecting...");

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      toast.dismiss(loadingToast);

      toast.error(
        err.response?.data || "Registration failed. Please check your details."
      );

      setError("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-bl from-grey-400 to bg-gray-100 relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="py-5 max-lg:px-12 lg:(pl-25 pr-15)">
        <div className="grid lg:grid-cols-2 items-center justify-center max-w-6xl w-full relative z-10 shadow-2xl rounded-2xl">
          {/* LEFT COLUMN: FORM */}
          <div className="px-8 py-10 max-lg:mx-auto bg-white lg:rounded-l-2xl max-lg:rounded-2xl">
            <form className="space-y-4">
              <div className="mb-5">
                <h1 className="text-slate-900 text-3xl font-semibold fredoka tracking-wide text-shadow-md">
                  Join our big family!
                </h1>
                <p className="text-slate-600 text-md mt-2 leading-relaxed fredoka">
                  Ready to adopt? Create an account to find your new best
                  friend.
                </p>
              </div>

              {/* Name Field */}
              <div className="fredoka">
                <label className="text-slate-900 text-sm font-medium mb-1 block">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full text-sm border border-slate-300 px-4 py-2 rounded-lg outline-[hsl(239,100%,65%)]"
                  placeholder="Enter your full name"
                  onChange={handleChange}
                />
              </div>

              {/* Username Field */}
              <div className="fredoka">
                <label className="text-slate-900 text-sm font-medium mb-1 block">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full text-sm border border-slate-300 px-4 py-2 rounded-lg outline-[hsl(239,100%,65%)]"
                  placeholder="Enter username"
                  onChange={handleChange}
                />
              </div>

              {/* Email Field */}
              <div className="fredoka">
                <label className="text-slate-900 text-sm font-medium mb-1 block">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full text-sm border border-slate-300 px-4 py-2 rounded-lg outline-[hsl(239,100%,65%)]"
                  placeholder="Enter email"
                  onChange={handleChange}
                />
              </div>

              {/* Contact Info Field */}
              <div className="fredoka">
                <label className="text-slate-900 text-sm font-medium mb-1 block">
                  Contact Phone
                </label>
                <input
                  name="contactInfo"
                  type="text"
                  required
                  className="w-full text-sm border border-slate-300 px-4 py-2 rounded-lg outline-[hsl(239,100%,65%)]"
                  placeholder="Enter phone number"
                  onChange={handleChange}
                />
              </div>

              {/* Password Field */}
              <div className="fredoka">
                <label className="text-slate-900 text-sm font-medium mb-1 block">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full text-sm border border-slate-300 px-4 py-2 rounded-lg outline-[hsl(239,100%,65%)]"
                  placeholder="Enter password"
                  onChange={handleChange}
                />
              </div>

              {/* Confirm Password Field */}
              <div className="fredoka">
                <label className="text-slate-900 text-sm font-medium mb-1 block">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full text-sm border border-slate-300 px-4 py-2 rounded-lg outline-[hsl(239,100%,65%)]"
                  placeholder="Confirm password"
                  onChange={handleChange}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="!mt-6">
                <button
                  type="button"
                  onClick={handleRegister}
                  className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-[hsl(239,100%,70%)] hover:bg-[hsl(239,100%,55%)] transition-colors duration-100 ease-in-out cursor-pointer fredoka"
                >
                  Sign up
                </button>
                <p className="text-sm !mt-4 text-center text-slate-600 fredoka">
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

          {/* RIGHT COLUMN: IMAGES */}
          <div className="bg-radial from-[#e3e0f3] to-[#bac7de] from-60% h-full w-full flex items-center justify-center rounded-r-2xl relative overflow-hidden">
            <img
              src={Dog}
              className={`w-3/4 max-lg:w-0 block object-cover relative z-10 transition-opacity duration-700 ease-in-out ${
                imagesLoaded ? "opacity-100" : "opacity-0"
              }`}
              alt="Two dogs say welcome"
            />
            <img
              src={Food}
              alt=""
              className={`absolute w-2/7 h-2/7 right-1/8 bottom-1/8 max-lg:hidden transition-opacity duration-700 ease-in-out ${
                imagesLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
