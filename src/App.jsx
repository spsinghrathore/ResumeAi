import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Result from "./pages/Result"; // ✅ Make sure this is uncommented
import Navbar from "./assets/components/Navbar";
import Footer from "./assets/components/Footer";

export default function App() {
  return (
    <>
       
           <Navbar /> 
      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} /> {/* ✅ This now works */}
      </Routes>
      <Footer />
    </>
  );
}