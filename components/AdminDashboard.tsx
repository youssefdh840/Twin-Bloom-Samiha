
import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { supabase } from '../services/supabaseClient';
import { FRAGRANCES } from '../constants';
import { Outfit as OutfitType } from '../types';

const AdminDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [outfits, setOutfits] = useState<OutfitType[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [newOutfit, setNewOutfit] = useState({ name: '', price: '', pairedScentId: FRAGRANCES[0].id });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchOutfits = async () => {
    const data = await storeService.getOutfits();
    setOutfits(data);
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      alert("Backend connection not configured. Please check your environment variables.");
      return;
    }
    if (!selectedFile) {
      alert("Please select a product image.");
      return;
    }

    setIsPublishing(true);
    try {
      const imageUrl = await storeService.uploadImage(selectedFile);
      if (!imageUrl) throw new Error("Image upload failed");

      const result = await storeService.addOutfit({
        ...newOutfit,
        imageUrl
      });

      if (result) {
        await fetchOutfits();
        setIsAdding(false);
        setNewOutfit({ name: '', price: '', pairedScentId: FRAGRANCES[0].id });
        setSelectedFile(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to publish product. Verify your Supabase storage permissions.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently remove this piece from the collection?')) {
      const success = await storeService.deleteOutfit(id);
      if (success) fetchOutfits();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-display font-light text-black tracking-tight">Studio Dashboard</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">N & F collection Inventory</p>
          </div>
          <button 
            onClick={onExit}
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            Exit Studio
          </button>
        </header>

        {/* تنبيه في حال عدم الاتصال بقاعدة البيانات */}
        {!supabase && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-100 rounded-sm">
            <h3 className="text-amber-800 text-xs font-bold uppercase tracking-widest mb-2">Connection Status: Pending</h3>
            <p className="text-[10px] text-amber-700 uppercase tracking-widest leading-relaxed">
              The studio is currently offline. Please ensure that NEXT_PUBLIC_SUPABASE_URL and ANON_KEY are correctly configured in Vercel settings and redeploy.
            </p>
          </div>
        )}

        <section className="bg-white rounded-sm shadow-sm p-8 mb-12 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Live Collection</h2>
            <button 
              disabled={!supabase}
              onClick={() => setIsAdding(!isAdding)}
              className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-matte-gold transition-colors disabled:opacity-20"
            >
              {isAdding ? 'Cancel' : 'Add New Product'}
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handlePublish} className="mb-12 p-6 bg-gray-50 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500">Product Name</label>
                <input 
                  required
                  className="w-full p-3 text-sm border-gray-200 outline-none"
                  value={newOutfit.name}
                  onChange={e => setNewOutfit({...newOutfit, name: e.target.value})}
                  placeholder="e.g. Silk Silhouette"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500">Price</label>
                <input 
                  required
                  className="w-full p-3 text-sm border-gray-200 outline-none"
                  value={newOutfit.price}
                  onChange={e => setNewOutfit({...newOutfit, price: e.target.value})}
                  placeholder="$1,200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500">Product Image</label>
                <input 
                  type="file"
                  required
                  accept="image/*"
                  className="w-full p-2 text-xs border border-dashed border-gray-300 bg-white"
                  onChange={handleFileChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500">Pair with Fragrance</label>
                <select 
                  className="w-full p-3 text-sm border-gray-200 outline-none"
                  value={newOutfit.pairedScentId}
                  onChange={e => setNewOutfit({...newOutfit, pairedScentId: e.target.value})}
                >
                  {FRAGRANCES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 mt-4">
                <button 
                  disabled={isPublishing}
                  type="submit" 
                  className="w-full bg-matte-gold text-white py-3 text-xs uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isPublishing ? 'Synchronizing...' : 'Publish to Storefront'}
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 text-[10px] uppercase text-gray-400 font-medium">Preview</th>
                  <th className="pb-4 text-[10px] uppercase text-gray-400 font-medium">Product</th>
                  <th className="pb-4 text-[10px] uppercase text-gray-400 font-medium">Price</th>
                  <th className="pb-4 text-[10px] uppercase text-gray-400 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {!supabase ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[10px] uppercase tracking-widest text-gray-400 italic">
                      Waiting for secure cloud connection...
                    </td>
                  </tr>
                ) : outfits.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-xs text-gray-400 italic">
                      The inventory is currently empty.
                    </td>
                  </tr>
                ) : (
                  outfits.map((outfit) => (
                    <tr key={outfit.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <img src={outfit.imageUrl} className="w-12 h-12 object-cover rounded-sm border border-gray-200" />
                      </td>
                      <td className="py-4">
                        <div className="text-sm font-medium text-black">{outfit.name}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-tighter">
                          Pair: {FRAGRANCES.find(f => f.id === outfit.pairedScentId)?.name}
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{outfit.price}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => handleDelete(outfit.id)}
                          className="text-[10px] uppercase tracking-widest text-red-300 hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
