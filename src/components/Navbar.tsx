
import { Menu, X, Home, UserPlus, LogIn, Info, Phone, FileText, ClipboardList } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
    { name: "About", path: "/about", icon: <Info className="w-4 h-4" /> },
    { name: "Contact", path: "/contact", icon: <Phone className="w-4 h-4" /> },
  ];

  const authItems = {
    signedOut: [
      { name: "Register", path: "/register", icon: <UserPlus className="w-4 h-4" /> },
      { name: "Login", path: "/login", icon: <LogIn className="w-4 h-4" /> },
    ],
    signedIn: [
      { name: "Add Problem", path: "/add-problem", icon: <FileText className="w-4 h-4" /> },
      { name: "My Problems", path: "/my-problems", icon: <ClipboardList className="w-4 h-4" /> }
    ]
  };

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="font-bold text-xl transform transition-transform hover:scale-105"
          >
            E-Gram Panchayat
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-1 hover:text-secondary transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            
            <SignedIn>
              {authItems.signedIn.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-1 hover:text-secondary transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              {authItems.signedOut.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-1 hover:text-secondary transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden transition-transform duration-300 hover:scale-110"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-slide-in">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-2 py-2 hover:text-secondary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            
            <SignedIn>
              {authItems.signedIn.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-2 py-2 hover:text-secondary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              {authItems.signedOut.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-2 py-2 hover:text-secondary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </SignedOut>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
