
import React, { useContext, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, BookOpen, Plus, Trash2, UploadCloud, X, ArrowLeft, Eye, EyeOff, Calendar } from 'lucide-react';
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
        images: []
    };
    setGallery(prev => [album, ...prev]);
    setNewAlbum({});
    setShowAlbumModal(false);
  };

  const handleDeleteAlbum = (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      if(window.confirm("Delete this album?")) {
          setGallery(prev => prev.filter(a => a.id !== id));
      }
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Digital Assets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage Photo Gallery & e-Magazines</p>
        </div>
        
        <div className="flex bg-white dark:bg-[#1C1C1E] p-1 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
           <button 
             onClick={() => { setActiveTab('albums'); setSelectedAlbumId(null); }}
             className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'albums' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-500'}`}
           >
             <Image size={18} /> Photo Albums
           </button>
           <button 
             onClick={() => setActiveTab('magazines')}
             className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'magazines' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-500'}`}
           >
             <BookOpen size={18} /> e-Magazines
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
                  <div className="flex justify-end mb-6">
                     <button onClick={() => setShowAlbumModal(true)} className="bg-ios-blue text-white px-5 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-transform">
                        <Plus size={20} /> New Event Album
                     </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {gallery.map(album => (
                        <div 
                           key={album.id}
                           onClick={() => setSelectedAlbumId(album.id)}
                           className="group bg-white dark:bg-[#1C1C1E] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-slate-100 dark:border-white/5"
                        >
                           <div className="aspect-[4/3] relative overflow-hidden">
                              <img src={album.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold border border-white/30">Manage Photos</span>
                              </div>
                           </div>
                           <div className="p-5 relative">
                              <h3 className="font-bold text-slate-900 dark:text-white truncate">{album.title}</h3>
                              <div className="flex justify-between items-center mt-1">
                                 <p className="text-xs text-slate-500 font-medium">{album.images.length} Photos • {album.date}</p>
                                 <button 
                                    onClick={(e) => handleDeleteAlbum(album.id, e)}
                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                                 >
                                    <Trash2 size={16} />
                                 </button>
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
                     <button onClick={() => setSelectedAlbumId(null)} className="p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
                        <ArrowLeft size={24} className="text-slate-700 dark:text-white" />
                     </button>
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedAlbum.title}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{selectedAlbum.date} • {selectedAlbum.images.length} Photos</p>
                     </div>
                  </div>

                  {/* Upload Area */}
                  <div 
                     onClick={() => bulkPhotoInputRef.current?.click()}
                     className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-[2rem] h-40 flex flex-col items-center justify-center cursor-pointer hover:border-ios-blue hover:bg-slate-50 dark:hover:bg-white/5 transition-all mb-8 group"
                  >
                     <UploadCloud size={40} className="text-slate-400 group-hover:text-ios-blue transition-colors mb-2" />
                     <p className="font-bold text-slate-600 dark:text-slate-300">Click to Bulk Upload Photos</p>
                     <p className="text-xs text-slate-400">Supports JPG, PNG</p>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                     {selectedAlbum.images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5">
                           <img src={img} className="w-full h-full object-cover" alt="" />
                           <button 
                              onClick={(e) => handleDeleteImage(selectedAlbum.id, idx, e)}
                              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                           >
                              <X size={14} />
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
                        <div key={mag.id} className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[1.5rem] border border-slate-100 dark:border-white/5 flex items-center gap-4 md:gap-6 shadow-sm group">
                           <div className="w-16 h-24 md:w-20 md:h-28 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-slate-200">
                              <img src={mag.coverUrl} className="w-full h-full object-cover" alt="" />
                           </div>
                           <div className="flex-1">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{mag.title}</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{mag.month}</p>
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${mag.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                 {mag.isPublished ? 'Published' : 'Hidden'}
                              </span>
                           </div>
                           <div className="flex items-center gap-2">
                              <button 
                                 onClick={() => toggleMagazineVisibility(mag.id)}
                                 className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                              >
                                 {mag.isPublished ? <Eye size={20} /> : <EyeOff size={20} />}
                              </button>
                              <button 
                                 onClick={() => handleDeleteMagazine(mag.id)}
                                 className="p-2.5 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
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
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAlbumModal(false)} />
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-md rounded-[2rem] p-6 shadow-2xl">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">New Event Album</h2>
                  <div className="space-y-4">
                     <input 
                        type="text" 
                        placeholder="Album Title (e.g. Sports Day)" 
                        className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white"
                        value={newAlbum.title || ''}
                        onChange={e => setNewAlbum({...newAlbum, title: e.target.value})}
                     />
                     <input 
                        type="date" 
                        className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white"
                        value={newAlbum.date || ''}
                        onChange={e => setNewAlbum({...newAlbum, date: e.target.value})}
                     />
                     <div 
                        onClick={() => coverInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-ios-blue text-slate-400"
                     >
                        {newAlbum.coverUrl ? (
                           <img src={newAlbum.coverUrl} className="w-full h-full object-cover rounded-xl" alt="" />
                        ) : (
                           <span className="flex flex-col items-center text-xs font-bold uppercase"><Image size={24} className="mb-2"/> Upload Cover</span>
                        )}
                        <input type="file" ref={coverInputRef} className="hidden" onChange={(e) => {
                           if(e.target.files?.[0]) setNewAlbum({...newAlbum, coverUrl: URL.createObjectURL(e.target.files[0])})
                        }} />
                     </div>
                     <button onClick={handleCreateAlbum} className="w-full py-3 bg-ios-blue text-white font-bold rounded-xl shadow-lg mt-2">Create Album</button>
                  </div>
                  <button onClick={() => setShowAlbumModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><X size={20} /></button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* CREATE MAGAZINE MODAL */}
      <AnimatePresence>
         {showMagazineModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMagazineModal(false)} />
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-md rounded-[2rem] p-6 shadow-2xl">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Publish e-Magazine</h2>
                  <div className="space-y-4">
                     <input 
                        type="text" 
                        placeholder="Title" 
                        className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white"
                        value={newMagazine.title || ''}
                        onChange={e => setNewMagazine({...newMagazine, title: e.target.value})}
                     />
                     <input 
                        type="text" 
                        placeholder="Month (e.g. October 2025)"
                        className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white"
                        value={newMagazine.month || ''}
                        onChange={e => setNewMagazine({...newMagazine, month: e.target.value})}
                     />
                     <div 
                        onClick={() => magCoverInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-ios-blue text-slate-400"
                     >
                        {newMagazine.coverUrl ? (
                           <img src={newMagazine.coverUrl} className="w-full h-full object-cover rounded-xl" alt="" />
                        ) : (
                           <span className="flex flex-col items-center text-xs font-bold uppercase"><Image size={24} className="mb-2"/> Upload Cover</span>
                        )}
                        <input type="file" ref={magCoverInputRef} className="hidden" onChange={(e) => {
                           if(e.target.files?.[0]) setNewMagazine({...newMagazine, coverUrl: URL.createObjectURL(e.target.files[0])})
                        }} />
                     </div>
                     <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl cursor-pointer" onClick={() => setNewMagazine(prev => ({...prev, isPublished: !prev.isPublished}))}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${newMagazine.isPublished ? 'bg-ios-blue border-ios-blue' : 'border-slate-300'}`}>
                           {newMagazine.isPublished && <X size={14} className="text-white rotate-45" style={{ transform: 'rotate(0deg)' }}><path d="M20 6 9 17l-5-5"/></X>}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Publish Immediately</span>
                     </div>
                     <button onClick={handlePublishMagazine} className="w-full py-3 bg-ios-blue text-white font-bold rounded-xl shadow-lg mt-2">Publish</button>
                  </div>
                  <button onClick={() => setShowMagazineModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><X size={20} /></button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};
