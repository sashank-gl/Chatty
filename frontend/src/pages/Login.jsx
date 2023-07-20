import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className='h-screen flex justify-center items-center bg-rose-400'>
        <div className='w-1/3'>
            <div>Chatty</div>
            <form onSubmit={handleSubmit}>
            <input type='email' placeholder='Enter Email Address' /><br/>
            <input type='password' placeholder='Enter Password' />
            <button type="submit">Sign In</button>
            {err && <span>Something went wrong</span>}

            </form>
            
            <div>You don't have an account? <Link to="/signup">Sign Up</Link></div>
        </div>
    </div>
  )
}

export default Login