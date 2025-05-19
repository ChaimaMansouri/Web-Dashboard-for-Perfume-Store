import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Predictions from "./pages/Predictions";
import General from "./pages/General";
import Home from "./pages/Home";
import PrivateRoute from "./components/privateRoutes";

function App() {
  return (  
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
        <Route path="/men" element={< Men />} />
        <Route path="/women" element={< Women />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/general" element={<General />} />
        <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </Router>

  );
}

export default App;