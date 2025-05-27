
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const NotFound = () => {
  const location = useLocation();
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Start animation after component mounts
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white overflow-hidden relative font-fredoka">
      {/* Orange juice carton */}
      <div className={`absolute top-10 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-1000 ${animationStarted ? 'translate-y-0' : '-translate-y-32'}`}>
        <div className="w-24 h-32 bg-orange-600 rounded-lg relative shadow-lg">
          {/* Carton design */}
          <div className="absolute inset-2 bg-orange-500 rounded-md"></div>
          <div className="absolute top-4 left-4 w-4 h-4 bg-white rounded-full opacity-80"></div>
          <div className="absolute bottom-6 left-3 text-white text-xs font-fredoka font-bold">OJ</div>
          
          {/* Spout */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-700 rounded-b-full"></div>
          
          {/* Pouring juice */}
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 bg-orange-500 transition-all duration-2000 delay-500 ${animationStarted ? 'h-96' : 'h-0'} z-10`}></div>
        </div>
      </div>

      {/* Orange juice filling effect */}
      <div className={`absolute bottom-0 left-0 w-full bg-orange-500 transition-all duration-3000 delay-1000 ${animationStarted ? 'h-full' : 'h-0'} z-0`}></div>

      {/* 404 Text appearing from the juice */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen">
        <div className={`text-center transition-all duration-1000 delay-2000 ${animationStarted ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
          <h1 className="text-8xl font-fredoka font-bold text-white mb-4 drop-shadow-lg">
            <span className={`inline-block transition-all duration-500 delay-2500 ${animationStarted ? 'transform translate-y-0' : 'transform translate-y-8'}`}>4</span>
            <span className={`inline-block transition-all duration-500 delay-2700 ${animationStarted ? 'transform translate-y-0' : 'transform translate-y-8'}`}>0</span>
            <span className={`inline-block transition-all duration-500 delay-2900 ${animationStarted ? 'transform translate-y-0' : 'transform translate-y-8'}`}>4</span>
          </h1>
          <p className={`text-2xl font-fredoka text-white mb-8 transition-all duration-500 delay-3200 ${animationStarted ? 'opacity-100' : 'opacity-0'}`}>
            Oops! This page got juiced!
          </p>
          
          {/* Blook character */}
          <div className={`mb-8 transition-all duration-500 delay-3500 ${animationStarted ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-75'}`}>
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg relative">
              {/* Blook face */}
              <div className="w-6 h-6 bg-white rounded-full absolute top-8 left-8"></div>
              <div className="w-6 h-6 bg-white rounded-full absolute top-8 right-8"></div>
              <div className="w-2 h-2 bg-orange-800 rounded-full absolute top-10 left-10"></div>
              <div className="w-2 h-2 bg-orange-800 rounded-full absolute top-10 right-10"></div>
              <div className="w-8 h-4 bg-orange-800 rounded-full absolute bottom-8"></div>
            </div>
          </div>
          
          <a 
            href="/" 
            className={`inline-block bg-white text-orange-600 px-8 py-4 rounded-full font-fredoka font-bold text-lg hover:bg-orange-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 ${animationStarted ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}
            style={{ transitionDelay: '3800ms' }}
          >
            Back to Game
          </a>
        </div>
      </div>

      {/* Floating juice drops */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 delay-4000 ${animationStarted ? 'opacity-100' : 'opacity-0'}`}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-orange-400 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default NotFound;
