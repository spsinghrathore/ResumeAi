import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Result from "./pages/Result"; // ✅ Make sure this is uncommented
import Navbar from "./assets/components/Navbar";
import Footer from "./assets/components/Footer";
import FloatingLink from "./assets/components/FloatingLink";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import { Analytics } from '@vercel/analytics/react';

// Import Analytics from Vercel package
// import { Analytics } from "@vercel/analytics";

export default function App() {
  return (
    <>
       
      <Navbar /> 
      <Routes>
       
      <Route path="/" element={<Home />} />
      <Route path="/result" element={<Result />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact" element={<Contact />} />
      </Routes>
       <FloatingLink />
      <Footer />
       <Analytics />
    </>
  );
}