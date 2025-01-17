import React from "react";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Table from "./components/Table";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />
        {/* Table Route */}
        <Route path="/table" element={<Table />} />
      </Routes>
    </Router>
  );
}

export default App;
