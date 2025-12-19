
import React, { useContext, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronRight, Download, ChevronLeft, Image as ImageIcon, Sparkles, ZoomIn } from 'lucide-react';
import { SchoolContext } from '../App';
import { Album } from '../types';

export const Gallery: React.FC = () => {
  const { gallery, magazines } = useContext(SchoolContext);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const visibleMagazines = magazines.filter(m => m.isPublished);
  
  // Extract Unique Categories
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(gallery.map(a => a.category)))];
  }, [gallery]);

  // Filter Albums
  const filteredAlbums = useMemo(() => {
    if (activeCategory === 'All') return gallery;
    return gallery.filter(a => a.category === activeCategory);
  }, [gallery, activeCategory]);

  // Featured Albums for Hero Carousel
  const featuredAlbums = gallery.filter(a => a.featured);

  const openLightbox = (album: Album, index: number = 0) => {
    setSelectedAlbum(album);
    setLightboxIndex(index);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedAlbum) {
      setLightboxIndex((prev) => (prev + 1) % selectedAlbum.images.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedAlbum) {
      setLightboxIndex((prev) => (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      
      {/* 1. HERO CAROUSEL (For You) */}
      {featuredAlbums.length > 0 && (
        <section>
           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 px-1 flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-500 fill-yellow-500" /> For You
           </h2>
           <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x px-1">
              {featuredAlbums.map((album) => (
                 <motion.div 
                    key={album.id}
                    whileHover={{ scale: 0.98 }}
                    onClick={() => openLightbox(album)}
                    className="snap-center flex-shrink-0 w-[85vw] md:w-[600px] h-[300px] md:h-[400px] rounded-[2rem] relative overflow-hidden cursor-pointer shadow-lg group"
                 >
                    <img src={album.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                       <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block border border-white/20">
                          {album.category}
                       </span>
                       <h3 className="text-3xl font-bold text-white leading-tight mb-1">{album.title}</h3>
                       <p className="text-white/80 text-sm font-medium">{album.images.length} Photos • {album.date}</p>
                    </div>
                 </motion.div>
              ))}
           </div>
        </section>
      )}

      {/* 2. E-MAGAZINES */}
      {visibleMagazines.length > 0 && (
        <section>
           <div className="flex justify-between items-end mb-6 px-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="text-ios-blue" size={24} /> Library
              </h2>
           </div>
           
           <div className="flex gap-8 overflow-x-auto no-scrollbar px-2 snap-x pb-8">
              {visibleMagazines.map((mag) => (
                <div 
                  key={mag.id} 
                  className="snap-start group cursor-pointer flex-shrink-0"
                  onClick={() => window.open(mag.pdfUrl, '_blank')}
                >
                   {/* 3D Book Effect */}
                   <div className="relative w-40 aspect-[3/4] rounded-r-lg rounded-l-sm shadow-[10px_10px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-1">
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-white/20 z-20 rounded-l-sm backdrop-blur-sm"></div>
                      <img 
                        src={mag.coverUrl} 
                        alt={mag.title} 
                        className="w-full h-full object-cover rounded-r-lg rounded-l-sm"
                      />
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-lg"></div>
                   </div>
                   <div className="mt-4 text-center w-40">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate">{mag.title}</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide mt-1">{mag.month}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* 3. MAIN GALLERY GRID */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-1">
           <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="text-purple-500" size={24} /> Moments
           </h2>
           
           {/* Filter Pills */}
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map(cat => (
                 <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                       activeCategory === cat 
                       ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg' 
                       : 'bg-white dark:bg-[#1C1C1E] text-slate-500 border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                 >
                    {cat}
                 </button>
              ))}
           </div>
        </div>

        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
           <AnimatePresence>
             {filteredAlbums.map((album) => (
               <motion.div
                 layout
                 key={album.id}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 onClick={() => openLightbox(album)}
                 className="break-inside-avoid bg-white dark:bg-[#1C1C1E] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-slate-100 dark:border-white/5 relative"
               >
                  <div className="relative overflow-hidden">
                     <img src={album.coverUrl} alt={album.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                           <ZoomIn size={16} /> View {album.images.length} Photos
                        </span>
                     </div>
                  </div>
                  <div className="p-5">
                     <span className="text-[10px] font-bold text-ios-blue uppercase tracking-widest mb-1 block">
                       {album.category}
                     </span>
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{album.title}</h3>
                     <p className="text-xs text-slate-500 mt-1">{album.date}</p>
                  </div>
               </motion.div>
             ))}
           </AnimatePresence>
        </motion.div>
      </section>

      {/* 4. IMMERSIVE LIGHTBOX */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-2xl"
            onClick={() => setSelectedAlbum(null)}
          >
            {/* Toolbar */}
            <div className="flex justify-between items-center p-6 text-white z-50 absolute top-0 w-full bg-gradient-to-b from-black/80 to-transparent" onClick={(e) => e.stopPropagation()}>
               <div>
                  <h3 className="text-lg font-bold">{selectedAlbum.title}</h3>
                  <p className="text-xs text-white/60 font-medium tracking-wide">{lightboxIndex + 1} of {selectedAlbum.images.length}</p>
               </div>
               <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-md">
                     <Download size={20} />
                  </button>
                  <button onClick={() => setSelectedAlbum(null)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-md">
                     <X size={20} />
                  </button>
               </div>
            </div>

            {/* Main Canvas */}
            <div className="flex-1 flex items-center justify-center relative w-full h-full">
               <button 
                 onClick={prevImage} 
                 className="absolute left-4 p-4 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all z-50 hidden md:block"
               >
                 <ChevronLeft size={40} />
               </button>
               
               <motion.img 
                 key={`${selectedAlbum.id}-${lightboxIndex}`}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 src={selectedAlbum.images.length > 0 ? selectedAlbum.images[lightboxIndex] : selectedAlbum.coverUrl}
                 className="max-h-[75vh] max-w-[95vw] md:max-w-[80vw] object-contain shadow-2xl rounded-lg select-none"
                 onClick={(e) => e.stopPropagation()}
                 drag="x"
                 dragConstraints={{ left: 0, right: 0 }}
                 onDragEnd={(e, { offset, velocity }) => {
                    if (offset.x > 100) prevImage();
                    else if (offset.x < -100) nextImage();
                 }}
               />

               <button 
                 onClick={nextImage} 
                 className="absolute right-4 p-4 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all z-50 hidden md:block"
               >
                 <ChevronRight size={40} />
               </button>
            </div>

            {/* Filmstrip */}
            <div className="h-28 bg-black/40 backdrop-blur-md flex items-center gap-3 overflow-x-auto px-6 no-scrollbar z-50 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
               {selectedAlbum.images.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`h-16 aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 relative flex-shrink-0 ${idx === lightboxIndex ? 'ring-2 ring-white scale-110 z-10' : 'opacity-50 hover:opacity-100 hover:scale-105'}`}
                  >
                     <img src={img} className="w-full h-full object-cover" />
                  </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
