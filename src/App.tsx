
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Complaints from "./pages/Complaints";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AddProblem from "./pages/AddProblem";
import MyProblems from "./pages/MyProblems";
import { SignedIn, SignedOut, SignIn, SignUp, ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import { Toaster } from "sonner";

const App = () => {
  return (
    <BrowserRouter>
      <ClerkLoading>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ClerkLoading>
      
      <ClerkLoaded>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/add-problem" element={<AddProblem />} />
          <Route path="/my-problems" element={<MyProblems />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </ClerkLoaded>
    </BrowserRouter>
  );
};

export default App;
