
import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { supabase } from '../services/supabaseClient';
import { Outfit as OutfitType } from '../types';

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const AdminDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [outfits, setOutfits] = useState<OutfitType[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'optimizing' | 'uploading'>('idle');
  const [newOutfit, setNewOutfit] = useState({ 
    name: '', 
    price: '', 
    sizes: ['S', 'M', 'L', 'XL', 'XXL'] as string[],
    outOfStockSizes: [] as string[],
    showSizes: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchOutfits = async () => {
    const data = await storeService.getOutfits();
    setOutfits(data);
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

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
          const iterativeCompress = (quality: number) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) return reject(new Error('Blob conversion failed'));
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
          iterativeCompress(0.9);
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

  const handleSizeToggle = (size: string) => {
    setNewOutfit(prev => {
      const exists = prev.sizes.includes(size);
      const newSizes = exists ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size];
      // If we remove from available sizes, also remove from OOS sizes
      const newOOS = exists ? prev.outOfStockSizes.filter(s => s !== size) : prev.outOfStockSizes;
      
      return {
        ...prev,
        sizes: newSizes,
        outOfStockSizes: newOOS
      };
    });
  };

  const handleOOSToggle = (size: string) => {
    // Only allow OOS toggle if the size is already in available sizes
    if (!newOutfit.sizes.includes(size)) return;
    
    setNewOutfit(prev => ({
      ...prev,
      outOfStockSizes: prev.outOfStockSizes.includes(size)
        ? prev.outOfStockSizes.filter(s => s !== size)
        : [...prev.outOfStockSizes, size]
    }));
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
    if (newOutfit.showSizes && newOutfit.sizes.length === 0) {
      alert("Please select at least one available size if size selection is enabled.");
      return;
    }

    setIsPublishing(true);
    try {
      setPublishStatus('optimizing');
      const optimizedFile = await compressImage(selectedFile);
      setPublishStatus('uploading');
      const imageUrl = await storeService.uploadImage(optimizedFile);
      if (!imageUrl) throw new Error("Image upload failed.");

      const result = await storeService.addOutfit({
        name: newOutfit.name,
        price: newOutfit.price,
        pairedScentId: '', 
        imageUrl,
        sizes: newOutfit.sizes,
        outOfStockSizes: newOutfit.outOfStockSizes,
        showSizes: newOutfit.showSizes
      });

      if (result) {
        await fetchOutfits();
        setIsAdding(false);
        setNewOutfit({ 
          name: '', 
          price: '', 
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          outOfStockSizes: [],
          showSizes: true
        });
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
          <button onClick={onExit} className="text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            Exit Studio
          </button>
        </header>

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
            <form onSubmit={handlePublish} className="mb-12 p-6 bg-gray-50 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500">Name</label>
                <input required className="w-full p-3 text-sm border-gray-200 outline-none focus:ring-1 focus:ring-matte-gold" value={newOutfit.name} onChange={e => setNewOutfit({...newOutfit, name: e.target.value})} placeholder="Product Title" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500">Price</label>
                <input required className="w-full p-3 text-sm border-gray-200 outline-none focus:ring-1 focus:ring-matte-gold" value={newOutfit.price} onChange={e => setNewOutfit({...newOutfit, price: e.target.value})} placeholder="$0.00" />
              </div>

              <div className="space-y-3 md:col-span-2 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="showSizes" 
                  className="w-4 h-4 accent-black" 
                  checked={newOutfit.showSizes} 
                  onChange={e => setNewOutfit({...newOutfit, showSizes: e.target.checked})} 
                />
                <label htmlFor="showSizes" className="text-[10px] uppercase tracking-widest text-gray-800 font-semibold cursor-pointer">
                  Show Size Selection for this item
                </label>
              </div>
              
              {newOutfit.showSizes && (
                <>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] uppercase text-gray-500 block">Catalog Sizes (Garment exists in:)</label>
                    <div className="flex gap-4">
                      {ALL_SIZES.map(size => (
                        <div 
                          key={size}
                          onClick={() => handleSizeToggle(size)}
                          className={`w-10 h-10 border flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all ${newOutfit.sizes.includes(size) ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-400 hover:border-black'}`}
                        >
                          {size}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] uppercase text-gray-500 block">Inventory Status (Mark as Out of Stock:)</label>
                    <div className="flex gap-4">
                      {ALL_SIZES.map(size => {
                        const isAvailableInCatalog = newOutfit.sizes.includes(size);
                        const isOOS = newOutfit.outOfStockSizes.includes(size);
                        return (
                          <div 
                            key={size}
                            onClick={() => handleOOSToggle(size)}
                            className={`w-10 h-10 border flex items-center justify-center text-[10px] font-bold transition-all ${
                              !isAvailableInCatalog 
                                ? 'bg-gray-100 border-gray-100 text-gray-200 cursor-not-allowed opacity-30' 
                                : isOOS 
                                  ? 'bg-red-50 border-red-500 text-red-600 diagonal-cross cursor-pointer' 
                                  : 'bg-white border-gray-200 text-gray-400 hover:border-red-300 cursor-pointer'
                            }`}
                            title={!isAvailableInCatalog ? "Select in Catalog Sizes first" : isOOS ? "Mark as In Stock" : "Mark as Out of Stock"}
                          >
                            {size}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] uppercase text-gray-500">Image</label>
                <input type="file" required accept="image/*" className="w-full p-2 text-xs border border-dashed border-gray-300 bg-white" onChange={handleFileChange} />
              </div>

              <div className="md:col-span-2 mt-4">
                <button disabled={isPublishing} type="submit" className="w-full bg-matte-gold text-white py-3 text-xs uppercase tracking-widest hover:bg-black transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2">
                  {isPublishing && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {publishStatus === 'idle' && 'Publish Item'}
                  {publishStatus === 'optimizing' && 'Optimizing...'}
                  {publishStatus === 'uploading' && 'Uploading...'}
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
                  <th className="pb-4 text-[10px] uppercase text-gray-400 font-medium">Sizes</th>
                  <th className="pb-4 text-[10px] uppercase text-gray-400 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {outfits.length === 0 ? (
                  <tr><td colSpan={4} className="py-12 text-center text-xs text-gray-400 italic">Inventory is empty.</td></tr>
                ) : (
                  outfits.map((outfit) => (
                    <tr key={outfit.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4"><img src={outfit.imageUrl} className="w-12 h-12 object-cover rounded-sm border border-gray-100" alt="" /></td>
                      <td className="py-4"><div className="text-sm font-medium text-black">{outfit.name}</div></td>
                      <td className="py-4">
                        {outfit.showSizes ? (
                          <div className="flex gap-1">
                            {(outfit.sizes || []).map(s => {
                              const isOOS = (outfit.outOfStockSizes || []).includes(s);
                              return (
                                <span key={s} className={`text-[9px] px-1.5 py-0.5 rounded border ${isOOS ? 'border-red-100 bg-red-50 text-red-300 line-through' : 'border-gray-100 text-gray-400'}`}>
                                  {s}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[9px] uppercase tracking-widest text-gray-300">Sizes Hidden</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleDelete(outfit.id)} className="text-[10px] uppercase tracking-widest text-red-300 hover:text-red-600 transition-colors">Delete</button>
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
