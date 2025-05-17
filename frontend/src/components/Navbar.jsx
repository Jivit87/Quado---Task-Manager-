import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import profile from "../assets/profile.png";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const { isAuthenticated, user } = auth;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: "Task", link: "/dashboard" },
    { name: "Analytics", link: "/analytics" },
    { name: "AI Assistant", link: "/ai-assistant" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center px-4 pt-4 sm:pt-6 z-50">
      <nav
        className={`w-full max-w-6xl rounded-xl backdrop-blur-xl bg-gradient-to-r from-[#0A0A0A]/80 via-[#1A1A1A]/80 to-[#0A0A0A]/80 border border-[#2A2A2A] ${
          scrolled ? "shadow-lg w-[90%]" : "w-full"
        } transition-all duration-300`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">

            <Link to="/" className="flex items-center space-x-2 relative z-20">
              <span
                className="text-xl sm:text-2xl font-extrabold text-[#00FF85]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Quado
              </span>
            </Link>

            {/* For Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-[#A3B1B2] hover:text-[#00FF85] focus:outline-none transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/*For Desktop Menu */}
            <div
              className="hidden md:flex items-center justify-center flex-1"
              onMouseLeave={() => setHoveredItem(null)}
            >
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.link}
                  className={`relative px-4 py-2 mx-2 font-medium transition-colors text-sm lg:text-base ${
                    hoveredItem === idx ? "text-[#AF52DE]" : "text-[#A3B1B2]"
                  }`}
                  onMouseEnter={() => setHoveredItem(idx)}
                >
                  {hoveredItem === idx && (
                    <div className="absolute inset-0 h-full w-full rounded-full bg-[#2A2A2A] transition-all duration-300" />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center overflow-hidden border border-[#677475]">
                      <img
                        src={profile}
                        alt="Profile"
                        className="rounded-full w-full h-full object-cover"
                      />
                    </div>
                    <span
                      className="text-white font-medium text-sm lg:text-base"
                      style={{ fontFamily: "'system-ui', sans-serif" }}
                    >
                      {user?.name || "User"}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-[#677475] text-[#A3B1B2] hover:bg-[#2A2A2A] hover:text-[#FFFFFF] transition-all text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-[#677475] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 sm:mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-[#AF52DE] hover:text-[#AF52DE] hover:brightness-110 font-medium transition-colors text-sm lg:text-base"
                    style={{ fontFamily: "'system-ui', sans-serif" }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#00FF85] text-[#0A0A0A] font-medium hover:bg-opacity-90 transition-all text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/*For Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 border-t border-[#2A2A2A] pt-4">
              <div className="flex flex-col space-y-4">
                {navItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.link}
                    className="text-[#A3B1B2] hover:text-[#AF52DE] font-medium transition-colors text-sm"
                    style={{ fontFamily: "'system-ui', sans-serif" }}
                    onClick={toggleMobileMenu}
                  >
                    {item.name}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center overflow-hidden border border-[#677475]">
                        <img
                          src={profile}
                          alt="Profile"
                          className="rounded-full w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className="text-white font-medium text-sm"
                        style={{ fontFamily: "'system-ui', sans-serif" }}
                      >
                        {user?.name || "User"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        toggleMobileMenu();
                      }}
                      className="px-4 py-2 rounded-lg border border-[#677475] text-[#A3B1B2] hover:bg-[#2A2A2A] hover:text-[#FFFFFF] transition-all text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-[#677475] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-[#AF52DE] hover:text-[#AF52DE] hover:brightness-110 font-medium transition-colors text-sm"
                      style={{ fontFamily: "'system-ui', sans-serif" }}
                      onClick={toggleMobileMenu}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 rounded-lg bg-[#00FF85] text-[#0A0A0A] font-medium hover:bg-opacity-90 transition-all text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      onClick={toggleMobileMenu}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
