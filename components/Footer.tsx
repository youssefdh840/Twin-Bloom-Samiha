
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-6 text-center">
      <div className="mb-8">
        <h4 className="text-xs uppercase tracking-[0.4em] text-black mb-4">Follow the Journey</h4>
        <div className="flex justify-center gap-6">
          <a href="#" className="text-gray-400 hover:text-black transition-colors">Instagram</a>
          <a href="#" className="text-gray-400 hover:text-black transition-colors">Pinterest</a>
          <a href="#" className="text-gray-400 hover:text-black transition-colors">Vogue</a>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 uppercase tracking-widest">
        &copy; 2024 Elysian Luxe. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
