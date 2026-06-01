import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import UnderConstruction from "./pages/underconstruction";
import Dashboard from './pages/Portal';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/under-construction" element={<UnderConstruction />} />
        <Route path="/Portal" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}