import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, User, ShoppingCart, Search } from 'lucide-react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Sample navigation items
  const navigationItems = [
    { 
      name: 'Products', 
      href: '#', 
      hasDropdown: true,
      dropdownItems: [
        { name: 'New Arrivals', href: '#' },
        { name: 'Best Sellers', href: '#' },
        { name: 'Sale', href: '#' }
      ]
    },
    { name: 'About', href: '#', hasDropdown: false },
    { name: 'Blog', href: '#', hasDropdown: false },
    { name: 'Contact', href: '#', hasDropdown: false },
  ];

  return (
    <div className="relative">
      <nav className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-indigo-600">BrandName</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <a 
                    href={item.href}
                    className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium flex items-center"
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                  </a>
                  
                  {/* Dropdown menus */}
                  {item.hasDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {item.dropdownItems.map((dropdownItem) => (
                        <a
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          {dropdownItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Right side icons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-600 hover:text-indigo-600" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-indigo-600">
                <User className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-indigo-600 relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
            {navigationItems.map((item) => (
              <div key={item.name}>
                <a
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                >
                  {item.name}
                </a>
                
                {/* Mobile dropdown items */}
                {item.hasDropdown && (
                  <div className="pl-6 space-y-1 mt-1">
                    {item.dropdownItems.map((dropdownItem) => (
                      <a
                        key={dropdownItem.name}
                        href={dropdownItem.href}
                        className="block px-3 py-2 text-sm font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                      >
                        {dropdownItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Mobile icons */}
            <div className="flex items-center space-x-6 px-3 py-2">
              <button className="text-gray-600 hover:text-indigo-600" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-indigo-600">
                <User className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-indigo-600 relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search bar positioned right after navbar with smooth transition */}
      <div 
        className={`w-full bg-gray-50 border-b border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
          isSearchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for products..."
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-md py-2 px-10 outline-none"
              onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
            />
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <button 
              className="absolute right-3 top-2.5 text-gray-400 hover:text-indigo-600"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Page content would go here */}
      <div className="pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* This div represents your page content */}
        <div className="bg-gray-100 h-screen rounded-lg p-6 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Your content goes here</p>
        </div>
      </div>
    </div>
  );
}