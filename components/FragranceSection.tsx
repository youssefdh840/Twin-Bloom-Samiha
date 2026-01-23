
import React from 'react';
import { FRAGRANCES } from '../constants';

const FragranceSection: React.FC = () => {
  return (
    <section className="px-6 mb-16">
      <h2 className="font-display text-xl mb-8 text-black tracking-wide flex items-center">
        <span className="h-[1px] w-8 bg-matte-gold mr-3"></span>
        Exquisite Fragrances
      </h2>
      <div className="grid grid-cols-1 gap-12">
        {FRAGRANCES.map((fragrance) => (
          <div key={fragrance.id} className="flex flex-col items-center text-center">
            <div className="w-48 h-64 mb-6 bg-white p-4 shadow-sm relative group">
              <img 
                src={fragrance.imageUrl} 
                alt={fragrance.name} 
                className="w-full h-full object-contain mix-blend-multiply"
              />
              <div className="absolute inset-0 border border-matte-gold opacity-0 group-hover:opacity-20 transition-opacity m-2"></div>
            </div>
            <h3 className="font-display text-lg text-black mb-1">{fragrance.name}</h3>
            <div className="flex gap-2 mb-3">
              {fragrance.notes.map(note => (
                <span key={note} className="text-[10px] uppercase tracking-tighter px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {note}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 font-light max-w-xs leading-relaxed mb-4">
              {fragrance.description}
            </p>
            <button className="text-xs font-medium uppercase tracking-widest matte-gold hover:text-black transition-colors flex items-center">
              Shop Now <span className="ml-2">→</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FragranceSection;
