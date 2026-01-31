
import React from 'react';

const Footer: React.FC = () => {
  const deliveryLocations = ['Ksour Essef', 'Chebba', 'Rojich', 'Mahdia'];

  return (
    <footer className="bg-white border-t border-gray-100 py-16 px-6 text-center">
      {/* Delivery Information Section */}
      <div className="mb-12">
        <h4 className="font-display text-sm italic text-black mb-4 tracking-wide">Livraison à :</h4>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-xs mx-auto">
          {deliveryLocations.map((location, index) => (
            <React.Fragment key={location}>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-light">
                {location}
              </span>
              {index < deliveryLocations.length - 1 && (
                <span className="text-matte-gold opacity-30">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="w-8 h-[1px] bg-gray-100 mx-auto mb-12"></div>

      <div className="mb-8">
        <h4 className="text-xs uppercase tracking-[0.4em] text-black mb-4">Follow the Journey</h4>
        <div className="flex justify-center">
          <a 
            href="#" 
            className="text-gray-400 cursor-default transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Instagram
          </a>
        </div>
      </div>
      
      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-12">
        &copy; 2026 N & F COLLECTION. ALL RIGHTS RESERVED
      </p>
    </footer>
  );
};

export default Footer;
