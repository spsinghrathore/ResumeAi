import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Result from "./pages/Result"; // ✅ Make sure this is uncommented
import Navbar from "./assets/components/Navbar";
import Footer from "./assets/components/Footer";
import FloatingLink from "./assets/components/FloatingLink";

// Import Analytics from Vercel package
// import { Analytics } from "@vercel/analytics";

export default function App() {
  return (
    <>
       
           <Navbar /> 
      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} /> {/* ✅ This now works */}
      </Routes>
       <FloatingLink />
      <Footer />
      {/* Add Analytics here
      <Analytics /> */}
    </>
  );
}