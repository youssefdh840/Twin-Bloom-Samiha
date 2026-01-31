import React from 'react';

const WhatsAppButton: React.FC = () => {
  return (
    <a 
      href="https://wa.me/21699822816" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-14 h-14 bg-white border border-gray-100 shadow-2xl rounded-full flex items-center justify-center group transition-all hover:scale-110 z-50"
    >
      <div className="absolute -top-10 right-0 bg-black text-white text-[10px] py-1 px-3 rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Questions?
      </div>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-black group-hover:matte-gold transition-colors"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </a>
  );
};

export default WhatsAppButton;