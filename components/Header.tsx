
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-12 px-6 text-center bg-white border-b border-gray-100 mb-8">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 border-2 border-matte-gold rounded-full flex items-center justify-center p-2">
          <span className="font-display text-2xl font-light tracking-tighter matte-gold">NF</span>
        </div>
      </div>
      <h1 className="font-display text-3xl font-light tracking-widest text-black uppercase mb-2">
        N & F collection
      </h1>
      <p className="text-gray-500 font-light italic text-sm tracking-wide">
        "Curated elegance for the modern soul."
      </p>
    </header>
  );
};

export default Header;
