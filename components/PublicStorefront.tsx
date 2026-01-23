
import React, { useState, useEffect } from 'react';
import Header from './Header';
import FragranceSection from './FragranceSection';
import MoodQuiz from './MoodQuiz';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { storeService } from '../services/storeService';
import { Outfit as OutfitType } from '../types';
import { FRAGRANCES } from '../constants';

const PublicStorefront: React.FC<{ onAdminLink: () => void }> = ({ onAdminLink }) => {
  const [outfits, setOutfits] = useState<OutfitType[]>([]);

  useEffect(() => {
    setOutfits(storeService.getOutfits());
  }, []);

  const getScentName = (id: string) => FRAGRANCES.find(f => f.id === id)?.name || '';

  return (
    <div className="max-w-md mx-auto min-h-screen shadow-2xl bg-[#F9F8F6] relative overflow-x-hidden">
      <div className="pb-20">
        <Header />
        
        {/* Outfits Section (Dynamic) */}
        <section className="px-6 mb-16">
          <h2 className="font-display text-xl mb-6 text-black tracking-wide flex items-center">
            <span className="h-[1px] w-8 bg-matte-gold mr-3"></span>
            Our Selected Outfits
          </h2>
          <div className="space-y-8">
            {outfits.map((outfit) => (
              <div key={outfit.id} className="group relative overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img 
                    src={outfit.imageUrl} 
                    alt={outfit.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-medium text-black uppercase tracking-wider">{outfit.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 italic">
                        Paired with: <span className="matte-gold">{getScentName(outfit.pairedScentId)}</span>
                      </p>
                    </div>
                    <span className="text-sm font-light text-gray-700">{outfit.price}</span>
                  </div>
                  <button className="w-full mt-4 py-3 border border-black text-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <div className="h-24 bg-gradient-to-b from-[#F9F8F6] to-white"></div>
        
        <FragranceSection />
        <MoodQuiz />
        <Footer />

        <div className="text-center pb-8">
          <button 
            onClick={onAdminLink}
            className="text-[10px] uppercase tracking-[0.4em] text-gray-300 hover:text-matte-gold transition-colors"
          >
            Access Studio Panel
          </button>
        </div>
      </div>

      <WhatsAppButton />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-matte-gold z-50"></div>
    </div>
  );
};

export default PublicStorefront;
