
import React, { useState } from 'react';
import { Outfit as OutfitType } from '../types';
import { FRAGRANCES } from '../constants';

interface ProductDetailsProps {
  outfit: OutfitType;
  onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ outfit, onBack }) => {
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const getScentName = (idOrName: string) => {
    const found = FRAGRANCES.find(f => f.id === idOrName);
    return found ? found.name : (idOrName || 'Signature Scent');
  };

  const handleWhatsAppOrder = () => {
    const message = `Hello! I would like to order the "${outfit.name}" in size ${selectedSize}. Price: ${outfit.price}.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/21629233644?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      {/* Navigation / Back Button */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-gray-50 flex items-center">
        <button 
          onClick={onBack}
          className="flex items-center text-[10px] uppercase tracking-[0.3em] text-gray-500 hover:text-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Collection
        </button>
      </nav>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Large Product Image - Top on mobile, Side on desktop */}
        <div className="w-full lg:w-3/5 p-0 md:p-6">
          <div className="relative overflow-hidden rounded-none md:rounded-lg shadow-sm">
            <img 
              src={outfit.imageUrl} 
              alt={outfit.name} 
              className="w-full h-auto object-cover max-h-[80vh] lg:max-h-none"
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="w-full lg:w-2/5 p-6 md:p-12 lg:sticky lg:top-20 self-start">
          <div className="mb-8">
            <span className="text-[10px] uppercase tracking-[0.4em] text-matte-gold font-semibold mb-3 block">
              Exclusive Piece
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-black mb-4 leading-tight">
              {outfit.name}
            </h1>
            <p className="text-2xl font-light text-gray-900 tracking-tighter mb-6">
              {outfit.price}
            </p>
            
            <div className="h-[1px] w-full bg-gray-100 mb-8"></div>

            <div className="space-y-6">
              {/* Scent Essence */}
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Paired Essence</h4>
                <div className="bg-gray-50 px-4 py-3 rounded-sm border border-gray-100 inline-block">
                  <span className="text-sm italic matte-gold font-medium">
                    {getScentName(outfit.pairedScentId)}
                  </span>
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Select Size</h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center border text-xs transition-all duration-300 ${
                        selectedSize === size 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-200 text-gray-500 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-8">
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-black text-white py-5 text-xs font-bold uppercase tracking-[0.3em] hover:bg-matte-gold transition-all duration-500 flex items-center justify-center gap-3 shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Order via WhatsApp
            </button>
            <p className="text-[9px] text-center text-gray-400 mt-4 uppercase tracking-widest">
              Available for delivery in 2-3 business days
            </p>
          </div>

          {/* Details Tabs placeholder */}
          <div className="mt-12 space-y-4">
            <details className="group border-t border-gray-100 py-4">
              <summary className="flex justify-between items-center cursor-pointer list-none text-[10px] uppercase tracking-widest text-black">
                Fabric & Care
                <span className="group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                Premium quality materials sourced for ultimate comfort and durability. Hand wash or dry clean recommended to preserve the texture and form.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
