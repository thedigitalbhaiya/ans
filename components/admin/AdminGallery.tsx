
import React, { useContext, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, BookOpen, Plus, Trash2, UploadCloud, X, ArrowLeft, Eye, EyeOff, Calendar, Check, MoreVertical, Star } from 'lucide-react';
import { SchoolContext } from '../../App';
import { Album, Magazine } from '../../types';

export const AdminGallery: React.FC = () => {
  const { gallery, setGallery, magazines, setMagazines } = useContext(SchoolContext);
  const [activeTab, setActiveTab] = useState<'albums' | 'magazines'>('albums');
  
  // State for Album View
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  
  // State for Modals
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showMagazineModal, setShowMagazineModal] = useState(false);

  // Form States
  const [newAlbum, setNewAlbum] = useState<Partial<Album>>({});
  const [newMagazine, setNewMagazine] = useState<Partial<Magazine>>({ isPublished: true });
  
  // Refs for File Input
  const coverInputRef = useRef<HTMLInputElement>(null);
  const magCoverInputRef = useRef<HTMLInputElement>(null);
  const bulkPhotoInputRef = useRef<HTMLInputElement>(null);

  // --- ALBUM LOGIC ---

  const handleCreateAlbum = () => {
    if (!newAlbum.title || !newAlbum.date) {
        alert("Please enter title and date");
        return;
    }
    const album: Album = {
        id: Date.now(),
        title: newAlbum.title,
        date: newAlbum.date,
        category: newAlbum.category || 'General',
        coverUrl: newAlbum.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca65e1112019?auto=format&fit=crop&w=600&q=80',
        featured: !!newAlbum.featured,
        images: []
    };
    setGallery(prev => [album, ...prev]);
    setNewAlbum({});
    setShowAlbumModal(false);
  };

  const handleDeleteAlbum = (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      if(window.confirm("Delete this album? All photos inside will be removed.")) {
          setGallery(prev => prev.filter(a => a.id !== id));
      }
  };

  const toggleFeatured = (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setGallery(prev => prev.map(a => a.id === id ? { ...a, featured: !a.featured } : a));
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && selectedAlbumId) {
          const newImages = Array.from(e.target.files).map((file: File) => URL.createObjectURL(file));
          setGallery(prev => prev.map(album => {
              if (album.id === selectedAlbumId) {
                  return { ...album, images: [...album.images, ...newImages] };
              }
              return album;
          }));
      }
  };

  const handleDeleteImage = (albumId: number, imgIndex: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setGallery(prev => prev.map(album => {
          if (album.id === albumId) {
              const newImages = [...album.images];
              newImages.splice(imgIndex, 1);
              return { ...album, images: newImages };
          }
          return album;
      }));
  };

  // --- MAGAZINE LOGIC ---

  const handlePublishMagazine = () => {
      if (!newMagazine.title || !newMagazine.month) return;
      const mag: Magazine = {
          id: Date.now(),
          title: newMagazine.title,
          month: newMagazine.month,
          coverUrl: newMagazine.coverUrl || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
          pdfUrl: '#',
          isPublished: !!newMagazine.isPublished
      };
      setMagazines(prev => [mag, ...prev]);
      setNewMagazine({ isPublished: true });
      setShowMagazineModal(false);
  };

  const toggleMagazineVisibility = (id: number) => {
      setMagazines(prev => prev.map(m => m.id === id ? { ...m, isPublished: !m.isPublished } : m));
  };

  const handleDeleteMagazine = (id: number) => {
      if(window.confirm("Delete magazine?")) {
          setMagazines(prev => prev.filter(m => m.id !== id));
      }
  };

  // --- RENDER HELPERS ---

  const selectedAlbum = gallery.find(a => a.id === selectedAlbumId);

  return (
    <div className="space-y-8 min-h-screen">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
             <Image className="text-purple-500" size={32} /> Gallery & Publications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage school memories and monthly newsletters.</p>
        </div>
        
        <div className="flex bg-white dark:bg-[#1C1C1E] p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
           <button 
             onClick={() => { setActiveTab('albums'); setSelectedAlbumId(null); }}
             className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'albums' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-300'}`}
           >
             Photo Albums
           </button>
           <button 
             onClick={() => setActiveTab('magazines')}
             className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'magazines' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-300'}`}
           >
             e-Magazines
           </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[500px]">
         <AnimatePresence mode="wait">
            
            {/* ALBUMS TAB */}
            {activeTab === 'albums' && !selectedAlbumId && (
               <motion.div 
                 key="albums-list"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
               >
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-lg font-bold text-slate-900 dark:text-white">All Albums</h2>
                     <button onClick={() => setShowAlbumModal(true)} className="bg-ios-blue text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-ios-blue/20 flex items-center gap-2 active:scale-95 transition-transform">
                        <Plus size={20} /> Create Album
                     </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {gallery.map(album => (
                        <div 
                           key={album.id}
                           onClick={() => setSelectedAlbumId(album.id)}
                           className="group bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer border border-slate-100 dark:border-white/5 relative"
                        >
                           <div className="aspect-[4/3] relative overflow-hidden rounded-2xl mb-4">
                              <img src={album.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold border border-white/30 text-sm">Open</span>
                              </div>
                              {album.featured && (
                                 <div className="absolute top-2 left-2 bg-yellow-400 text-white p-1.5 rounded-full shadow-md z-10">
                                    <Star size={12} fill="currentColor" />
                                 </div>
                              )}
                           </div>
                           
                           <div className="px-1">
                              <div className="flex justify-between items-start mb-1">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{album.category}</span>
                                 <span className="text-[10px] font-bold text-slate-400">{album.images.length} Items</span>
                              </div>
                              <h3 className="font-bold text-slate-900 dark:text-white truncate text-lg leading-tight">{album.title}</h3>
                              <div className="flex justify-between items-center mt-4 border-t border-slate-100 dark:border-white/5 pt-3">
                                 <p className="text-xs text-slate-500 font-medium">{album.date}</p>
                                 <div className="flex gap-1">
                                    <button 
                                       onClick={(e) => toggleFeatured(album.id, e)}
                                       className={`p-2 rounded-full transition-colors ${album.featured ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10'}`}
                                       title="Toggle Featured"
                                    >
                                       <Star size={16} fill={album.featured ? "currentColor" : "none"} />
                                    </button>
                                    <button 
                                       onClick={(e) => handleDeleteAlbum(album.id, e)}
                                       className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}

            {/* SINGLE ALBUM VIEW */}
            {activeTab === 'albums' && selectedAlbumId && selectedAlbum && (
               <motion.div 
                 key="single-album"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
               >
                  <div className="flex items-center gap-4 mb-8">
                     <button onClick={() => setSelectedAlbumId(null)} className="p-3 rounded-full bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 hover:scale-105 transition-transform shadow-sm">
                        <ArrowLeft size={20} className="text-slate-700 dark:text-white" />
                     </button>
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                           {selectedAlbum.title} 
                           <span className="text-sm font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-md">{selectedAlbum.date}</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{selectedAlbum.images.length} Photos in this album</p>
                     </div>
                  </div>

                  {/* Upload Area */}
                  <div 
                     onClick={() => bulkPhotoInputRef.current?.click()}
                     className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-[2rem] h-40 flex flex-col items-center justify-center cursor-pointer hover:border-ios-blue hover:bg-slate-50 dark:hover:bg-white/5 transition-all mb-8 group bg-white dark:bg-[#1C1C1E]"
                  >
                     <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud size={24} className="text-ios-blue" />
                     </div>
                     <p className="font-bold text-slate-900 dark:text-white text-lg">Click to Upload Photos</p>
                     <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG (Max 5MB each)</p>
                     <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        ref={bulkPhotoInputRef}
                        className="hidden" 
                        onChange={handleBulkUpload}
                     />
                  </div>

                  {/* Images Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                     {selectedAlbum.images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 shadow-sm border border-slate-200 dark:border-white/5">
                           <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <button 
                              onClick={(e) => handleDeleteImage(selectedAlbum.id, idx, e)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                           >
                              <Trash2 size={14} />
                           </button>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}

            {/* MAGAZINES TAB */}
            {activeTab === 'magazines' && (
               <motion.div 
                 key="magazines-list"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
               >
                  <div className="flex justify-end mb-6">
                     <button onClick={() => setShowMagazineModal(true)} className="bg-ios-blue text-white px-5 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-transform">
                        <Plus size={20} /> Publish Magazine
                     </button>
                  </div>

                  <div className="space-y-4">
                     {magazines.map(mag => (
                        <div key={mag.id} className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[1.5rem] border border-slate-100 dark:border-white/5 flex items-center gap-4 md:gap-6 shadow-sm group hover:border-ios-blue/30 transition-colors">
                           <div className="w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-slate-200 relative">
                              <img src={mag.coverUrl} className="w-full h-full object-cover" alt="" />
                              <div className="absolute inset-0 bg-black/10"></div>
                           </div>
                           
                           <div className="flex-1">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{mag.title}</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{mag.month}</p>
                              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${mag.isPublished ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:border-green-500/20' : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-white/5 dark:border-white/10'}`}>
                                 {mag.isPublished ? 'Published' : 'Hidden'}
                              </span>
                           </div>
                           
                           <div className="flex items-center gap-2 pr-2">
                              <button 
                                 onClick={() => toggleMagazineVisibility(mag.id)}
                                 className={`p-2.5 rounded-xl transition-colors ${mag.isPublished ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10' : 'bg-slate-100 text-slate-500 dark:bg-white/5'}`}
                                 title={mag.isPublished ? "Hide" : "Show"}
                              >
                                 {mag.isPublished ? <Eye size={20} /> : <EyeOff size={20} />}
                              </button>
                              <button 
                                 onClick={() => handleDeleteMagazine(mag.id)}
                                 className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                              >
                                 <Trash2 size={20} />
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}

         </AnimatePresence>
      </div>

      {/* CREATE ALBUM MODAL */}
      <AnimatePresence>
         {showAlbumModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAlbumModal(false)} />
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">New Event Album</h2>
                  <div className="space-y-5">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Album Title</label>
                        <input 
                           type="text" 
                           placeholder="e.g. Annual Sports Day" 
                           className="w-full p-4 bg-slate-50 dark:bg-black/20 rounded-2xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium"
                           value={newAlbum.title || ''}
                           onChange={e => setNewAlbum({...newAlbum, title: e.target.value})}
                        />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date</label>
                           <input 
                              type="date" 
                              className="w-full p-4 bg-slate-50 dark:bg-black/20 rounded-2xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium"
                              value={newAlbum.date || ''}
                              onChange={e => setNewAlbum({...newAlbum, date: e.target.value})}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category</label>
                           <select 
                              className="w-full p-4 bg-slate-50 dark:bg-black/20 rounded-2xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium"
                              value={newAlbum.category || 'Events'}
                              onChange={e => setNewAlbum({...newAlbum, category: e.target.value})}
                           >
                              <option>Events</option>
                              <option>Sports</option>
                              <option>Cultural</option>
                              <option>Academic</option>
                           </select>
                        </div>
                     </div>

                     <div 
                        onClick={() => coverInputRef.current?.click()}
                        className="w-full h-40 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-ios-blue text-slate-400 overflow-hidden relative group"
                     >
                        {newAlbum.coverUrl ? (
                           <>
                              <img src={newAlbum.coverUrl} className="w-full h-full object-cover" alt="" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <span className="text-white font-bold text-sm">Change Cover</span>
                              </div>
                           </>
                        ) : (
                           <span className="flex flex-col items-center text-xs font-bold uppercase gap-2"><Image size={24} /> Upload Cover Image</span>
                        )}
                        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => {
                           if(e.target.files?.[0]) setNewAlbum({...newAlbum, coverUrl: URL.createObjectURL(e.target.files[0])})
                        }} />
                     </div>

                     <div 
                        onClick={() => setNewAlbum(prev => ({...prev, featured: !prev.featured}))}
                        className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border transition-all ${newAlbum.featured ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/20' : 'bg-slate-50 border-transparent dark:bg-white/5'}`}
                     >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${newAlbum.featured ? 'bg-yellow-500 text-white' : 'bg-slate-300 text-slate-500'}`}>
                           <Star size={14} fill="currentColor" />
                        </div>
                        <div>
                           <p className={`text-sm font-bold ${newAlbum.featured ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Feature on Home</p>
                           <p className="text-[10px] text-slate-400">Show in the top carousel</p>
                        </div>
                     </div>

                     <button onClick={handleCreateAlbum} className="w-full py-4 bg-ios-blue text-white font-bold rounded-2xl shadow-xl shadow-ios-blue/20 mt-2 active:scale-95 transition-transform">Create Album</button>
                  </div>
                  <button onClick={() => setShowAlbumModal(false)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"><X size={20} /></button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* CREATE MAGAZINE MODAL */}
      <AnimatePresence>
         {showMagazineModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMagazineModal(false)} />
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Publish Magazine</h2>
                  <div className="space-y-5">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Title</label>
                        <input 
                           type="text" 
                           placeholder="e.g. The Scholar Vol. 5" 
                           className="w-full p-4 bg-slate-50 dark:bg-black/20 rounded-2xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium"
                           value={newMagazine.title || ''}
                           onChange={e => setNewMagazine({...newMagazine, title: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Month / Edition</label>
                        <input 
                           type="text" 
                           placeholder="e.g. October 2025"
                           className="w-full p-4 bg-slate-50 dark:bg-black/20 rounded-2xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium"
                           value={newMagazine.month || ''}
                           onChange={e => setNewMagazine({...newMagazine, month: e.target.value})}
                        />
                     </div>
                     <div 
                        onClick={() => magCoverInputRef.current?.click()}
                        className="w-full h-40 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-ios-blue text-slate-400 overflow-hidden relative group"
                     >
                        {newMagazine.coverUrl ? (
                           <>
                              <img src={newMagazine.coverUrl} className="w-full h-full object-cover" alt="" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <span className="text-white font-bold text-sm">Change Cover</span>
                              </div>
                           </>
                        ) : (
                           <span className="flex flex-col items-center text-xs font-bold uppercase gap-2"><Image size={24} /> Upload Cover</span>
                        )}
                        <input type="file" ref={magCoverInputRef} className="hidden" onChange={(e) => {
                           if(e.target.files?.[0]) setNewMagazine({...newMagazine, coverUrl: URL.createObjectURL(e.target.files[0])})
                        }} />
                     </div>
                     <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl cursor-pointer" onClick={() => setNewMagazine(prev => ({...prev, isPublished: !prev.isPublished}))}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${newMagazine.isPublished ? 'bg-ios-blue border-ios-blue' : 'border-slate-300'}`}>
                           {newMagazine.isPublished && <Check size={14} className="text-white" strokeWidth={4} />}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Publish Immediately</span>
                     </div>
                     <button onClick={handlePublishMagazine} className="w-full py-4 bg-ios-blue text-white font-bold rounded-2xl shadow-xl shadow-ios-blue/20 mt-2 active:scale-95 transition-transform">Publish</button>
                  </div>
                  <button onClick={() => setShowMagazineModal(false)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"><X size={20} /></button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};
