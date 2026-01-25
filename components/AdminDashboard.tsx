
import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { supabase } from '../services/supabaseClient';
import { Outfit as OutfitType } from '../types';

const AdminDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [outfits, setOutfits] = useState<OutfitType[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'optimizing' | 'uploading'>('idle');
  const [newOutfit, setNewOutfit] = useState({ name: '', price: '', pairedScentId: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchOutfits = async () => {
    const data = await storeService.getOutfits();
    setOutfits(data);
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  /**
   * High-quality client-side image compression
   * Resizes to max 1600px and adjusts quality to hit < 500KB target
   */
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Limit dimensions for web optimization (Retina standard)
          const MAX_DIM = 1600;
          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Failed to get canvas context'));
          
          ctx.drawImage(img, 0, 0, width, height);

          // Iterative compression logic
          const iterativeCompress = (quality: number) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) return reject(new Error('Blob conversion failed'));
                
                // If still over 500KB and quality is above 0.3, try lower quality
                if (blob.size > 500 * 1024 && quality > 0.3) {
                  iterativeCompress(quality - 0.1);
                } else {
                  const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                }
              },
              'image/jpeg',
              quality
            );
          };

          iterativeCompress(0.9); // Start with high quality
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      alert("Backend connection not configured.");
      return;
    }
    if (!selectedFile) {
      alert("Please select a product image.");
      return;
    }

    setIsPublishing(true);
    try {
      setPublishStatus('optimizing');
      const optimizedFile = await compressImage(selectedFile);
      
      setPublishStatus('uploading');
      const imageUrl = await storeService.uploadImage(optimizedFile);
      
      if (!imageUrl) {
        throw new Error("Image upload failed.");
      }

      const result = await storeService.addOutfit({
        ...newOutfit,
        imageUrl
      });

      if (result) {
        await fetchOutfits();
        setIsAdding(false);
        setNewOutfit({ name: '', price: '', pairedScentId: '' });
        setSelectedFile(null);
      } else {
        alert("Details could not be saved to database.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsPublishing(false);
      setPublishStatus('idle');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently remove this piece?')) {
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

        {!supabase && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-100 rounded-sm text-center">
            <p className="text-[10px] text-amber-700 uppercase tracking-widest leading-relaxed">
              Database connection pending. Check your Supabase environment variables.
            </p>
          </div>
        )}

        <section className="bg-white rounded-sm shadow-sm p-8 mb-12 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Active Inventory</h2>
            <button 
              disabled={!supabase}
              onClick={() => setIsAdding(!isAdding)}
              className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-matte-gold transition-colors disabled:opacity-20"
            >
              {isAdding ? 'Cancel' : 'Add New Item'}
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handlePublish} className="mb-12 p-6 bg-gray-50 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500">Name</label>
                <input 
                  required
                  className="w-full p-3 text-sm border-gray-200 outline-none focus:ring-1 focus:ring-matte-gold transition-all"
                  value={newOutfit.name}
                  onChange={e => setNewOutfit({...newOutfit, name: e.target.value})}
                  placeholder="Product Title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500">Price</label>
                <input 
                  required
                  className="w-full p-3 text-sm border-gray-200 outline-none focus:ring-1 focus:ring-matte-gold transition-all"
                  value={newOutfit.price}
                  onChange={e => setNewOutfit({...newOutfit, price: e.target.value})}
                  placeholder="$0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500">Image (Optimized automatically)</label>
                <input 
                  type="file"
                  required
                  accept="image/*"
                  className="w-full p-2 text-xs border border-dashed border-gray-300 bg-white"
                  onChange={handleFileChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500">Paired Scent</label>
                <input 
                  className="w-full p-3 text-sm border-gray-200 outline-none focus:ring-1 focus:ring-matte-gold transition-all"
                  value={newOutfit.pairedScentId}
                  onChange={e => setNewOutfit({...newOutfit, pairedScentId: e.target.value})}
                  placeholder="e.g. Saffron Oud"
                />
              </div>
              <div className="md:col-span-2 mt-4">
                <button 
                  disabled={isPublishing}
                  type="submit" 
                  className="w-full bg-matte-gold text-white py-3 text-xs uppercase tracking-widest hover:bg-black transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isPublishing && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {publishStatus === 'idle' && 'Publish Item'}
                  {publishStatus === 'optimizing' && 'Optimizing Quality...'}
                  {publishStatus === 'uploading' && 'Synchronizing Gallery...'}
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
                  <th className="pb-4 text-[10px] uppercase text-gray-400 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {outfits.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-xs text-gray-400 italic">
                      Inventory is empty. Add items to see them here.
                    </td>
                  </tr>
                ) : (
                  outfits.map((outfit) => (
                    <tr key={outfit.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <img src={outfit.imageUrl} className="w-12 h-12 object-cover rounded-sm border border-gray-100" alt="" />
                      </td>
                      <td className="py-4">
                        <div className="text-sm font-medium text-black">{outfit.name}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-tighter">
                          Scent: {outfit.pairedScentId || 'None'}
                        </div>
                      </td>
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
