import { useState, createContext, useContext, useEffect } from 'react';
import { ChevronDown, Moon, Sun } from 'lucide-react';

// Create theme context
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  // Check for user preference or stored theme
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const [darkMode, setDarkMode] = useState(prefersDark);

  // Apply theme class to document and handle transitions
  useEffect(() => {
    const applyTheme = () => {
      document.documentElement.classList.toggle('dark', darkMode);
      document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
      document.body.style.backgroundColor = darkMode ? '#0f172a' : '#f8fafc';
      document.body.style.color = darkMode ? '#f3f4f6' : '#1f2937';
    };
    
    applyTheme();
    
    return () => {
      document.body.style.transition = '';
    };
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="relative w-16 h-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Background */}
      <div className={`absolute inset-0 transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-r from-blue-900 to-indigo-900' 
          : 'bg-gradient-to-r from-blue-400 to-indigo-500'
      }`}></div>
      
      {/* Track with icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <Sun size={16} className={`text-yellow-300 transition-opacity duration-300 ${darkMode ? 'opacity-50' : 'opacity-100'}`} />
        <Moon size={16} className={`text-blue-200 transition-opacity duration-300 ${darkMode ? 'opacity-100' : 'opacity-50'}`} />
      </div>
      
      {/* Thumb */}
      <div 
        className={`absolute top-1 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          darkMode 
            ? 'translate-x-9 bg-indigo-200' 
            : 'translate-x-1 bg-white'
        }`}
      ></div>
    </button>
  );
}

function Navbar() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center mb-8 transition-all duration-500 border-b dark:border-gray-700 border-gray-200 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
      <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent transition-colors duration-500">Gradient Accordion</div>
      <ThemeToggle />
    </nav>
  );
}

function AccordionContent() {
  const [openIndex, setOpenIndex] = useState(0);
  const { darkMode } = useContext(ThemeContext);
  
  const accordionItems = [
    {
      id: 1,
      title: "What is this accordion component?",
      content: "This is a modern, animated accordion component built with React and styled with Tailwind CSS. It features smooth transitions, accessible controls, and responsive design to provide an excellent user experience.",
      gradient: {
        light: "from-blue-500 to-cyan-400",
        dark: "from-blue-600 to-cyan-500"
      }
    },
    {
      id: 2,
      title: "How do the animations work?",
      content: "The animations use CSS transitions combined with React state management. When an accordion item is toggled, height and opacity transitions create a smooth opening and closing effect. The chevron icon also rotates to provide visual feedback.",
      gradient: {
        light: "from-purple-500 to-pink-400",
        dark: "from-purple-600 to-pink-500"
      }
    },
    {
      id: 3,
      title: "Is this component accessible?",
      content: "Yes! This accordion follows accessibility best practices. It uses proper ARIA attributes, is fully keyboard navigable, and provides visual feedback for interactions. The component maintains good contrast ratios and follows semantic HTML structure.",
      gradient: {
        light: "from-green-500 to-emerald-400",
        dark: "from-green-600 to-emerald-500"
      }
    },
    {
      id: 4,
      title: "Can I customize this component?",
      content: "Absolutely! You can easily modify the colors, spacing, animations, and content to match your design system. The component is built with Tailwind CSS, making it simple to adjust the styling. You can also extend the functionality by adding features like multiple open panels or different animation styles.",
      gradient: {
        light: "from-orange-500 to-amber-400",
        dark: "from-orange-600 to-amber-500"
      }
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  // Function to get background style based on open state and theme
  const getBackgroundStyle = (item, index) => {
    const isOpen = openIndex === index;
    if (!isOpen) return {};
    
    const gradientClass = darkMode ? item.gradient.dark : item.gradient.light;
    return {
      background: `linear-gradient(to right, var(--tw-gradient-stops))`,
      className: `bg-gradient-to-r ${gradientClass}`
    };
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl shadow-xl overflow-hidden transition-all duration-500 dark:shadow-gray-800/30">
      <div className="p-8 bg-white dark:bg-gray-800 transition-colors duration-500">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent transition-colors duration-500">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {accordionItems.map((item, index) => {
            const isOpen = openIndex === index;
            const gradientClass = darkMode ? item.gradient.dark : item.gradient.light;
            
            return (
              <div 
                key={item.id} 
                className={`relative rounded-lg overflow-hidden transition-all duration-500 transform ${
                  isOpen ? 'scale-105 shadow-lg dark:shadow-gray-900/50' : 'scale-100'
                }`}
              >
                {/* Gradient Background */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-0 transition-opacity duration-500 ${
                    isOpen ? 'opacity-100' : ''
                  }`}
                ></div>
                
                {/* Header Button */}
                <button
                  className={`relative z-10 flex justify-between items-center w-full p-5 text-left transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                    ${isOpen ? 
                      'text-white' : 
                      'dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  aria-controls={`accordion-content-${item.id}`}
                >
                  <span className="text-lg font-medium">{item.title}</span>
                  <div className="flex items-center justify-center">
                    <ChevronDown 
                      size={20} 
                      className={`transition-transform duration-500 ease-in-out ${
                        isOpen ? 'transform rotate-180 text-white' : 'dark:text-gray-400 text-gray-500'
                      }`} 
                    />
                  </div>
                </button>
                
                {/* Content Panel */}
                <div 
                  id={`accordion-content-${item.id}`}
                  className={`relative z-10 overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                  aria-hidden={!isOpen}
                >
                  <div className={`p-5 transition-colors duration-500 ${
                    isOpen ? 'text-white' : 'dark:bg-gray-700 dark:text-gray-300 bg-gray-50 text-gray-600'
                  }`}>
                    <p>{item.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mounted, setMounted] = useState(false);

  // Ensure hydration completes
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until client-side to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen w-full transition-colors duration-500 dark:bg-gray-900 bg-gray-50 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <Navbar />
          <AccordionContent />
          <footer className="mt-12 text-center text-sm bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent transition-colors duration-500">
            <p>Click the toggle in the navbar to switch between light and dark themes.</p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}