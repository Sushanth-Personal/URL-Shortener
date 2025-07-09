"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/UserContext";
import { loginUser, registerUser } from "@/api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useScreenSize from "@/hooks/useScreenSize";
import { validateEmail, validatePassword, validateContact } from "@/lib/inputError";
import Image from "next/image"; // Import Image component

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserDataState] = useState({
    username: "",
    email: "",
    password: "",
    contact: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const isTablet = useScreenSize(980);
  const { setIsLoggedIn, setUserData } = useUserContext();

  useEffect(() => {
    if (
      errors.username ||
      errors.email ||
      errors.contact ||
      errors.password ||
      errors.confirmPassword
    ) {
      toast.error("Error Registering ...", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [errors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDataState({ ...userData, [name]: value });
  };

  const handleRegisterLink = () => {
    setIsLogin(!isLogin);
    setErrors({
      username: "",
      email: "",
      contact: "",
      password: "",
      confirmPassword: "",
    });
    setUserDataState({
      username: "",
      email: "",
      contact: "",
      password: "",
    });
    setConfirmPassword("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { username, email, contact, password } = userData;
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const contactError = validateContact(contact);
    const confirmPasswordError =
      password !== confirmPassword ? "Passwords do not match" : "";

    setErrors({
      username: !username ? "Username is required" : "",
      email: emailError.error || "",
      contact: contactError.error || "",
      password: passwordError.error || "",
      confirmPassword: confirmPasswordError,
    });

    if (
      !username ||
      emailError.error ||
      contactError.error ||
      passwordError.error ||
      confirmPasswordError
    ) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(username, email, contact, password);
      setIsLoading(false);
      if (response.message === "Success") {
        toast.success("Registration Successful!", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsLogin(true);
      } else {
        setErrors({
          username: response === "Username already exists" ? "Username already exists" : "",
          email: response === "Email already exists" ? "Email already exists" : "",
          contact: response === "Contact already exists" ? "Contact already exists" : "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch {
      toast.error("Registration failed", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, password } = userData;
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError.error || "",
      password: passwordError.error || "",
      username: "",
      contact: "",
      confirmPassword: "",
    });

    if (emailError.error || passwordError.error) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser(email, password);
      setIsLoading(false);
      if (response.message === "Success") {
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsLoggedIn(true);
        setUserData({ ...response.user, userId: response.user._id });
        localStorage.setItem("userData", JSON.stringify(response.user));
        router.push("/dashboard");
      } else {
        setErrors({
          email: response === "Invalid email" ? "Invalid email" : "",
          password: response === "Invalid password" ? "Invalid password" : "",
          username: "",
          contact: "",
          confirmPassword: "",
        });
      }
    } catch {
      toast.error("Login failed", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsLoading(false);
    }
  };

  return (
    <section className="w-screen h-screen flex items-center overflow-y-hidden">
      {/* Left Side */}
      <div className="flex-1 relative h-full hidden lg:block">
        <h1 className="absolute top-7 left-7 text-4xl font-weight-700">URL Shortener</h1>
        <Image
          className="w-full h-full object-cover"
          src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737555992/m_image_nplbjl.png"
          alt="leftBackground"
          width={1920} // Adjust based on actual image dimensions
          height={1080}
        />
      </div>

      {/* Right Side */}
      <div className="flex flex-col flex-1 items-center justify-start px-6 lg:px-12 py-8 h-screen">
        {isTablet && (
          <Image
            className="w-20 mb-6"
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737555978/download_2_cmwand.png"
            alt="logo"
            width={80} // Matches w-20 (assuming 1rem = 16px, so 20 * 4 = 80px)
            height={80}
          />
        )}

        {/* Nav Buttons */}
        <nav className="w-full flex justify-end gap-4 mb-8">
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded ${isLogin ? "bg-gray-100 text-gray-600" : "bg-blue-600 text-white"}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded ${isLogin ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            Login
          </button>
        </nav>

        {/* Form */}
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-semibold mb-6">{isLogin ? "Login" : "Join us Today!"}</h1>
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="flex flex-col gap-4">
              {/* Username */}
              {!isLogin && (
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="username"
                    placeholder="Name"
                    value={userData.username}
                    onChange={handleChange}
                    className="p-2 border rounded focus:outline-blue-500"
                  />
                  <span className="text-red-500 text-sm">{errors.username}</span>
                </div>
              )}
              {/* Contact */}
              {!isLogin && (
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="contact"
                    placeholder="Mobile no."
                    value={userData.contact}
                    onChange={handleChange}
                    className="p-2 border rounded focus:outline-blue-500"
                  />
                  <span className="text-red-500 text-sm">{errors.contact}</span>
                </div>
              )}
              {/* Email */}
              <div className="flex flex-col">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={userData.email}
                  onChange={handleChange}
                  className="p-2 border rounded focus:outline-blue-500"
                />
                <span className="text-red-500 text-sm">{errors.email}</span>
              </div>
              {/* Password */}
              <div className="flex flex-col">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={userData.password}
                  onChange={handleChange}
                  className="p-2 border rounded focus:outline-blue-500"
                />
                <span className="text-red-500 text-sm">{errors.password}</span>
              </div>
              {/* Confirm Password */}
              {!isLogin && (
                <div className="flex flex-col">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="p-2 border rounded focus:outline-blue-500"
                  />
                  <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
                </div>
              )}
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {isLoading ? "Loading..." : isLogin ? "Log In" : "Sign Up"}
              </button>
            </form>
            {/* Toggle Link */}
            <div className="mt-4 text-sm text-center">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <button type="button" onClick={handleRegisterLink} className="text-blue-600 underline">
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button type="button" onClick={handleRegisterLink} className="text-blue-600 underline">
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}