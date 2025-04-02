
import { Menu, X, Home, UserPlus, LogIn, Info, Phone, FileText, Globe } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  const navItems = [
    { name: t("nav.home"), path: "/", icon: <Home className="w-4 h-4" /> },
    { name: t("nav.about"), path: "/about", icon: <Info className="w-4 h-4" /> },
    { name: t("nav.contact"), path: "/contact", icon: <Phone className="w-4 h-4" /> },
  ];

  const authItems = {
    signedOut: [
      { name: t("nav.register"), path: "/register", icon: <UserPlus className="w-4 h-4" /> },
      { name: t("nav.login"), path: "/login", icon: <LogIn className="w-4 h-4" /> },
    ],
    signedIn: [
      { name: t("nav.addProblem"), path: "/add-problem", icon: <FileText className="w-4 h-4" /> },
      { name: t("nav.myProblems"), path: "/my-problems", icon: <FileText className="w-4 h-4" /> }
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

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1 hover:text-secondary transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
                <span>{t(`language.${i18n.language}`) || t("language.english")}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => changeLanguage("en")}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    {t("language.english")}
                  </button>
                  <button
                    onClick={() => changeLanguage("hi")}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    {t("language.hindi")}
                  </button>
                  <button
                    onClick={() => changeLanguage("mr")}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    {t("language.marathi")}
                  </button>
                </div>
              )}
            </div>
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

            {/* Mobile Language Selector */}
            <div className="py-2">
              <button
                onClick={() => changeLanguage("en")}
                className="flex items-center space-x-2 py-1 hover:text-secondary transition-colors w-full text-left"
              >
                <Globe className="w-4 h-4" />
                <span>{t("language.english")}</span>
              </button>
              <button
                onClick={() => changeLanguage("hi")}
                className="flex items-center space-x-2 py-1 hover:text-secondary transition-colors w-full text-left"
              >
                <Globe className="w-4 h-4" />
                <span>{t("language.hindi")}</span>
              </button>
              <button
                onClick={() => changeLanguage("mr")}
                className="flex items-center space-x-2 py-1 hover:text-secondary transition-colors w-full text-left"
              >
                <Globe className="w-4 h-4" />
                <span>{t("language.marathi")}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
