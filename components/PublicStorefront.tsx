
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

  const getScentName = (id: string) => FRAGRANCES.find(f => f.id === id)?.name || 'Custom Scent';

  return (
    <div className="max-w-md mx-auto min-h-screen shadow-2xl bg-[#F9F8F6] relative overflow-x-hidden">
      <div className="pb-20">
        <Header />
        
        {/* Outfits Section (Live Cloud Data) */}
        <section className="px-6 mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-xl text-black tracking-wide flex items-center">
              <span className="h-[1px] w-8 bg-matte-gold mr-3"></span>
              Our Selected Outfits
            </h2>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-6 h-6 border-2 border-matte-gold border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Curating the collection...</p>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              {outfits.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-gray-200 bg-white/50 rounded-sm">
                  <p className="text-sm text-gray-400 font-light italic px-4">The collection is currently being reimagined.</p>
                </div>
              ) : (
                outfits.map((outfit) => (
                  <div key={outfit.id} className="group relative overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-500">
                    <div className="aspect-[4/5] overflow-hidden bg-gray-50">
                      <img 
                        src={outfit.imageUrl} 
                        alt={outfit.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
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
                      <button className="w-full mt-4 py-3 border border-black text-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300">
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
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
