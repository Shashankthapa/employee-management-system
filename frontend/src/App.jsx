import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import CreateEmployee from "../components/CreateEmployee";
import Logout from "../components/Logout";
import DisplayEmployee from "../components/DisplayEmployee";
import UpdateEmployee from "../components/UpdateEmployee";
import "./App.css"

function App() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(
    localStorage.getItem("username") || ""
  );

  useEffect(() => {
    if (displayName) localStorage.setItem("username", displayName);
  }, [displayName]);

  return (
    <>
      <Header navigate={navigate} displayName={displayName} />
      <Routes>
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/login"
          element={
            <Login navigate={navigate} setDisplayName={setDisplayName} />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/show-employee"
          element={<DisplayEmployee itemsPerPage={4} />}
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="/update/:id" element={<UpdateEmployee />} />
      </Routes>
    </>
  );
}

export default App;
