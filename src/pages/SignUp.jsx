import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import {BiCloudUpload} from 'react-icons/bi'
import { motion } from 'framer-motion';
const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
const [avatarFile, setAvatarFile] = useState(null)
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // Store the selected file in the state
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value.toLowerCase();
    const email = e.target[1].value.toLowerCase();
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
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
  
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter Display Name"
            className="border-b w-full h-10 px-2"
          />
        </div>
        <div className="mt-4">
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
  
        <input style={{ display: "none" }} type="file" id="avatar" onChange={handleFileChange} />
  
        <div className="flex justify-center">
          <label htmlFor="avatar" className="w-2/3">
            <div className="flex items-center justify-center border-2 border-indigo-900 text-indigo-900 h-12 mt-6 mb-4 rounded-xl gap-3 cursor-pointer">
              <div>
                <BiCloudUpload size={22} />
              </div>
              <div className="">Add Your Avatar</div>
            </div>
            {avatarFile && ( 
          <div className="flex justify-center">
            <img
              src={URL.createObjectURL(avatarFile)} // Create a temporary URL for the selected file
              alt="Avatar Preview"
              className="h-24 w-24 object-cover rounded-full mt-4"
            />
          </div>
        )}
          </label>
        </div>
  
        <button disabled={loading} className="w-full mt-4">
          <div className="rounded-xl flex justify-center items-center text-xl font-semibold pb-1 h-12 bg-indigo-900 text-white w-full active:scale-95 transition duration-300 ease-in-out">
            Sign Up
          </div>
        </button>
  
        {loading && (
          <div className="mt-4 text-slate-500 font-semibold flex justify-center items-center">
            Creating your account...
          </div>
        )}
        {err && (
          <div className="mt-4 text-slate-500 font-semibold">
            Issue: Missing fields or invalid information (password and email).
            <br />
            Please check fields, password strength, and email validity.
          </div>
        )}
  
        <div className="mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-indigo-900 font-semibold cursor-pointer hover:text-rose-600 transition duration-800"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
  
};

export default Register;
