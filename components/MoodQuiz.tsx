
import React, { useState } from 'react';
import { Mood, Recommendation } from '../types';
import { getFragranceRecommendation } from '../services/geminiService';

const MoodQuiz: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const handleMoodSelect = async (mood: Mood) => {
    setLoading(true);
    try {
      const rec = await getFragranceRecommendation(mood);
      setRecommendation(rec);
    } catch (error) {
      console.error("Failed to fetch recommendation", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-6 mb-20 p-8 bg-black text-white rounded-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-matte-gold opacity-10 blur-3xl -mr-16 -mt-16"></div>
      
      <h2 className="font-display text-2xl mb-2 tracking-wide text-white">Find your perfect fragrance</h2>
      <p className="text-gray-400 text-sm font-light mb-8">Tell us your essence, and we will reveal your scent.</p>
      
      {!recommendation ? (
        <div className="grid grid-cols-2 gap-3">
          {Object.values(Mood).map((mood) => (
            <button
              key={mood}
              disabled={loading}
              onClick={() => handleMoodSelect(mood)}
              className="py-3 px-4 border border-gray-800 text-xs uppercase tracking-widest hover:border-matte-gold hover:text-matte-gold transition-all duration-300 disabled:opacity-50"
            >
              {loading ? '...' : mood}
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] matte-gold block mb-2">The AI Recommendation</span>
            <h3 className="font-display text-xl mb-3 text-white">"{recommendation.fragranceName}"</h3>
            <p className="text-sm text-gray-300 italic leading-relaxed font-light mb-4 border-l border-matte-gold pl-4">
              {recommendation.reason}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">Vibe:</span>
              <span className="text-[10px] uppercase tracking-widest text-white px-2 py-0.5 bg-gray-900 border border-gray-800 rounded">
                {recommendation.vibe}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setRecommendation(null)}
            className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            Start Over
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-8 flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-matte-gold border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] uppercase tracking-widest text-matte-gold">Consulting the artisans...</span>
        </div>
      )}
    </section>
  );
};

export default MoodQuiz;
