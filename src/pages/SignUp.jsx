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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
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
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-rose-500 to-sky-500">
      <form onSubmit={handleSubmit} className="w-1/4 bg-white rounded-2xl flex flex-col justify-center">
        
      <motion.div
      className="flex justify-center items-center text-5xl font-righteous mt-6 mb-2"
      initial={{ color: "#4C1D95" }} // Initial color
      animate={{ color: "#DA316D" }} // Target color
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }} // Reverse loop
    >
      Chatty
    </motion.div>
        
        <div className="ml-10 mt-12">
            <input type="text" placeholder="Enter Display Name" className="border-b w-3/4 h-10 flex justify-center items-center"/>
            <input type="email" placeholder="Enter Email Address" className="border-b w-3/4 h-10 flex justify-center items-center"/>
            <input type="password" placeholder="Enter Password" className="border-b w-3/4 h-10 flex justify-center items-center"/>
        </div>
        
        <input style={{ display: "none" }} type="file" id="avatar" />

        <div className="flex justify-center">
          <label htmlFor="avatar" className="w-2/6">
            <div className="flex items-center justify-center border-2 border-indigo-900 text-indigo-900 h-12 mt-6 mb-4 rounded-xl gap-3 cursor-pointer">
              <div><BiCloudUpload size={22}/></div>
              <div className="">Add Your Avatar</div>
            </div>
          </label>
        </div>

        <button disabled={loading} className="flex justify-center items-center" ><div className="rounded-xl flex justify-center items-center text-xl font-semibold pb-1 h-12 bg-indigo-900 text-white w-2/6 active:scale-95 transition duration-300 ease-in-out">Sign Up</div></button>
        
        {loading && (
          <div className="flex justify-center items-end h-10 text-slate-500 font-semibold">
            "Creating your account"
          </div>
          )}
        {err &&
          <div className="flex justify-center items-end h-16 text-slate-500 font-semibold">
          Issue: Missing fields or invalid information (password and email).<br/>
          Please check fields, password strength, and email validity.
          </div>
          }
        
        <div className="flex justify-center items-center h-16">Already have an account? <Link to='/signin' className="ml-2 text-indigo-900 font-semibold cursor-pointer hover:text-rose-600 transition duration-800">Sign In</Link></div>
      </form>
    </div>
  );
};

export default Register;
