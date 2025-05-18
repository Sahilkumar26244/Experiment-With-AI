import { useState, createContext, useContext, useEffect } from 'react';
import { ChevronDown, Moon, Sun } from 'lucide-react';

// Create theme context
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center mb-6 border-b transition-colors duration-300 dark:border-gray-700">
      <div className="font-bold text-xl text-gray-800 dark:text-gray-100">Accordion Demo</div>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          <Sun size={20} className="text-yellow-400" />
        ) : (
          <Moon size={20} className="text-gray-600" />
        )}
      </button>
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
      content: "This is a modern, animated accordion component built with React and styled with Tailwind CSS. It features smooth transitions, accessible controls, and responsive design to provide an excellent user experience."
    },
    {
      id: 2,
      title: "How do the animations work?",
      content: "The animations use CSS transitions combined with React state management. When an accordion item is toggled, height and opacity transitions create a smooth opening and closing effect. The chevron icon also rotates to provide visual feedback."
    },
    {
      id: 3,
      title: "Is this component accessible?",
      content: "Yes! This accordion follows accessibility best practices. It uses proper ARIA attributes, is fully keyboard navigable, and provides visual feedback for interactions. The component maintains good contrast ratios and follows semantic HTML structure."
    },
    {
      id: 4,
      title: "Can I customize this component?",
      content: "Absolutely! You can easily modify the colors, spacing, animations, and content to match your design system. The component is built with Tailwind CSS, making it simple to adjust the styling. You can also extend the functionality by adding features like multiple open panels or different animation styles."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto rounded-lg shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Frequently Asked Questions</h2>
      <div className="space-y-4">
        {accordionItems.map((item, index) => (
          <div 
            key={item.id} 
            className={`border rounded-lg overflow-hidden transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <button
              className={`flex justify-between items-center w-full p-4 text-left transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-100' 
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
              onClick={() => toggleAccordion(index)}
              aria-expanded={openIndex === index}
              aria-controls={`accordion-content-${item.id}`}
            >
              <span className="text-lg font-medium">{item.title}</span>
              <ChevronDown 
                size={20} 
                className={`transition-transform duration-300 ease-in-out ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${openIndex === index ? 'transform rotate-180' : ''}`} 
              />
            </button>
            <div 
              id={`accordion-content-${item.id}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
              aria-hidden={openIndex !== index}
            >
              <div className={`p-4 border-t transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-300' 
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
                <p>{item.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeContext.Provider value={{ darkMode: false, setDarkMode: () => {} }}>
      <ThemeProvider>
        <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900 bg-gray-100">
          <div className="container mx-auto px-4">
            <Navbar />
            <AccordionContent />
          </div>
        </div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}