import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Home from "./components/Home.jsx";
import DiseaseSearch from "./components/Disease.jsx";

export default function App() {
  const token = localStorage.getItem("access_token");

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={token ? <Navigate to="/home" /> : <Login />}
      />
      <Route
        path="/signup"
        element={token ? <Navigate to="/home" /> : <Signup />}
      />

      {/* Protected routes */}
      <Route
        path="/home"
        element={token ? <Home /> : <Navigate to="/" />}
      />
      <Route
        path="/diseases"
        element={token ? <DiseaseSearch /> : <Navigate to="/" />}
      />
    </Routes>
  );
}
