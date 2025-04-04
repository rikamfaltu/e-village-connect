
import { Menu, X, Home, UserPlus, LogIn, Info, Phone, FileText, ClipboardList, Shield } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Check if current route is admin panel
  const isAdminRoute = location.pathname === "/admin";
  
  // Admin emails - same as defined in AdminPanel for consistency
  const adminEmails = ["admin@example.com", "2023bit045@sggs.ac.in"];
  const isAdmin = user && adminEmails.includes(user.primaryEmailAddress?.emailAddress || "");

  const navItems = [
    { name: t('nav.home'), path: "/", icon: <Home className="w-4 h-4" /> },
    { name: t('nav.about'), path: "/about", icon: <Info className="w-4 h-4" /> },
    { name: t('nav.contact'), path: "/contact", icon: <Phone className="w-4 h-4" /> },
  ];

  const authItems = {
    signedOut: [
      { name: t('nav.register'), path: "/register", icon: <UserPlus className="w-4 h-4" /> },
      { name: t('nav.login'), path: "/login", icon: <LogIn className="w-4 h-4" /> },
    ],
    signedIn: [
      { name: t('nav.addProblem'), path: "/add-problem", icon: <FileText className="w-4 h-4" /> },
      { name: t('nav.myProblems'), path: "/my-problems", icon: <ClipboardList className="w-4 h-4" /> }
    ],
    admin: [
      { name: t('nav.adminPanel'), path: "/admin", icon: <Shield className="w-4 h-4" /> }
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
            {t('app.title')}
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
              {/* Only show Add Problem and My Problems links for non-admin users */}
              {!isAdmin && authItems.signedIn.map((item, index) => (
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
              
              {/* Show Admin Panel link for admin users */}
              {isAdmin && authItems.admin.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-1 bg-red-600 px-3 py-1 rounded-md hover:bg-red-700 transition-all duration-300"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <LanguageSelector />
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
              <LanguageSelector />
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <LanguageSelector />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="transition-transform duration-300 hover:scale-110"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
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
              {/* Only show Add Problem and My Problems links for non-admin users in mobile menu */}
              {!isAdmin && authItems.signedIn.map((item) => (
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
              
              {/* Show Admin Panel link for admin users in mobile menu */}
              {isAdmin && authItems.admin.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-2 py-2 bg-red-600 px-3 my-2 rounded-md hover:bg-red-700 transition-colors"
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
