import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion";
const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-rose-500 to-sky-500">
      <form
        onSubmit={handleSubmit}
        className="w-11/12 max-w-md bg-white rounded-2xl flex flex-col justify-center px-6 py-8"
      >
        <motion.div
          className="flex justify-center items-center text-4xl md:text-5xl font-righteous mt-6 mb-4"
          initial={{ color: "#4C1D95" }} // Initial color
          animate={{ color: "#DA316D" }} // Target color
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }} // Reverse loop
        >
          Chatty
        </motion.div>
  
        <div className="mt-6">
          <input
            type="email"
            placeholder="Enter Email Address"
            className="border-b w-full h-10 px-2"
          />
        </div>
        <div className="mt-4">
          <input
            type="password"
            placeholder="Enter Password"
            className="border-b w-full h-10 px-2"
          />
        </div>
  
        {err && (
          <div className="mt-2 text-slate-500 font-semibold">
            Error: Missing fields, incorrect password or email. Please check and try again.
          </div>
        )}
  
        <button type="submit" className="mt-6 w-full">
          <div className="rounded-xl flex justify-center items-center text-xl font-semibold pb-1 h-12 bg-indigo-900 text-white w-full active:scale-95 transition duration-300 ease-in-out">
            Sign In
          </div>
        </button>
  
        <div className="mt-6 text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-900 font-semibold cursor-pointer hover:text-rose-600 transition duration-800"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
  
};

export default Login;
