
import React, { useState, useEffect } from 'react';
import Header from './Header';
import MoodQuiz from './MoodQuiz';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { storeService } from '../services/storeService';
import { Outfit as OutfitType } from '../types';
import { FRAGRANCES } from '../constants';

const PublicStorefront: React.FC<{ onAdminLink: () => void }> = ({ onAdminLink }) => {
  const [outfits, setOutfits] = useState<OutfitType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await storeService.getOutfits();
        setOutfits(data);
      } catch (error) {
        console.error("Failed to load collection:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Returns the paired scent name. If it's a custom string from the DB, it returns that string.
  const getScentName = (idOrName: string) => {
    const found = FRAGRANCES.find(f => f.id === idOrName);
    return found ? found.name : (idOrName || 'Signature Scent');
  };

  return (
    <div className="max-w-screen-xl mx-auto min-h-screen shadow-2xl bg-[#F9F8F6] relative overflow-x-hidden">
      <div className="pb-20">
        <Header />
        
        {/* Outfits Section (Responsive Grid) */}
        <section className="px-4 sm:px-8 md:px-12 mb-20">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-display text-xl md:text-2xl text-black tracking-widest flex items-center">
              <span className="h-[1px] w-12 bg-matte-gold mr-4"></span>
              The Collection
            </h2>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-8 h-8 border-2 border-matte-gold border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Curating the gallery...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 animate-fade-in">
              {outfits.length === 0 ? (
                <div className="col-span-full py-20 text-center border border-dashed border-gray-200 bg-white/50 rounded-sm">
                  <p className="text-sm text-gray-400 font-light italic px-4 uppercase tracking-widest">The collection is currently being refreshed.</p>
                </div>
              ) : (
                outfits.map((outfit) => (
                  <div key={outfit.id} className="flex flex-col h-full group bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-sm overflow-hidden">
                    {/* Consistent Aspect Ratio Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                      <img 
                        src={outfit.imageUrl} 
                        alt={outfit.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>

                    {/* Content Container with Equal Height Logic */}
                    <div className="p-4 flex flex-col flex-grow bg-white overflow-hidden">
                      <div className="mb-4 overflow-hidden">
                        <h3 className="text-[10px] md:text-xs font-semibold text-black uppercase tracking-[0.15em] line-clamp-2 min-h-[2.5em] leading-relaxed break-words">
                          {outfit.name}
                        </h3>
                        
                        {/* Fixed Essence Badge Layout to handle long labels like "Mysterious" or "Romantic" */}
                        <div className="mt-3 flex flex-col gap-1 overflow-hidden">
                          <span className="text-[8px] uppercase tracking-widest text-gray-400 font-light">Essence</span>
                          <div className="w-full bg-gray-50 border border-gray-100 px-2 py-1.5 rounded-sm flex justify-center items-center overflow-hidden">
                            <span className="text-sm md:text-sm matte-gold font-medium italic whitespace-nowrap truncate max-w-full">
                              {getScentName(outfit.pairedScentId)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sticky Bottom Section */}
                      <div className="mt-auto pt-4 border-t border-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs md:text-sm font-light text-gray-900 tracking-tighter">{outfit.price}</span>
                          <span className="text-[8px] uppercase tracking-widest text-matte-gold font-bold">In Stock</span>
                        </div>
                        <button className="w-full py-3 bg-white border border-black text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500">
                          Discover Piece
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
        
        <div className="h-32 bg-gradient-to-b from-[#F9F8F6] to-white"></div>
        
        {/* Centered sections for better readability on desktop */}
        <div className="max-w-4xl mx-auto px-4">
          <MoodQuiz />
          <Footer />
        </div>

        <div className="text-center pb-12">
          <button 
            onClick={onAdminLink}
            className="text-[10px] uppercase tracking-[0.5em] text-gray-300 hover:text-matte-gold transition-all duration-300 hover:tracking-[0.6em]"
          >
            Access Studio Panel
          </button>
        </div>
      </div>

      <WhatsAppButton />
      <div className="fixed top-0 left-0 w-full h-1 bg-matte-gold z-50"></div>
    </div>
  );
};

export default PublicStorefront;
