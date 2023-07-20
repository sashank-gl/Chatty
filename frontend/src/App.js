import React, { useContext } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import "./index.css";
import SignUp from "./pages/SignUp";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

const App = () => {
  const {currentUser} = useContext(AuthContext)
 

  const ProtectedRoute = ({children}) => {
    if (!currentUser) {
      return <Navigate to="/signin" />
      console.log(currentUser)
    }
    return children
    console.log(currentUser)
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="signin" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
