
import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronRight, Download, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import { SchoolContext } from '../App';
import { Album } from '../types';

export const Gallery: React.FC = () => {
  const { gallery, magazines } = useContext(SchoolContext);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filter only published content if you add isPublished to albums later. Currently assumes all visible.
  const visibleMagazines = magazines.filter(m => m.isPublished);

  const openLightbox = (album: Album, index: number = 0) => {
    setSelectedAlbum(album);
    setLightboxIndex(index);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedAlbum) {
      setLightboxIndex((prev) => (prev + 1) % selectedAlbum.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedAlbum) {
      setLightboxIndex((prev) => (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Gallery & e-Magazine</h1>
        <p className="text-slate-500 dark:text-slate-400">Explore our school's memories and publications.</p>
      </div>

      {/* 1. MAGAZINE SHELF */}
      {visibleMagazines.length > 0 && (
        <section>
           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
             <BookOpen className="text-ios-blue" size={24} />
             Latest Publications
           </h2>
           
           <div className="flex gap-8 overflow-x-auto no-scrollbar pb-10 px-2 snap-x">
              {visibleMagazines.map((mag) => (
                <motion.div 
                  key={mag.id} 
                  whileHover={{ y: -10 }}
                  className="snap-center flex-shrink-0 w-48 md:w-56 flex flex-col group cursor-pointer"
                  onClick={() => window.open(mag.pdfUrl, '_blank')}
                >
                   {/* 3D Book Effect Container */}
                   <div className="relative aspect-[3/4] rounded-r-xl rounded-l-sm shadow-xl transition-all duration-300 transform perspective-1000">
                      {/* Spine Effect */}
                      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white/40 to-transparent z-20 rounded-l-sm"></div>
                      
                      <img 
                        src={mag.coverUrl} 
                        alt={mag.title} 
                        className="w-full h-full object-cover rounded-r-xl rounded-l-sm shadow-inner"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-r-xl">
                         <span className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">Read Now</span>
                      </div>
                   </div>
                   
                   <div className="mt-4 text-center">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{mag.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{mag.month}</p>
                   </div>
                </motion.div>
              ))}
           </div>
        </section>
      )}

      {/* 2. EVENT ALBUMS (MASONRY GRID) */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
           <ImageIcon className="text-purple-500" size={24} />
           Event Gallery
        </h2>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
           {gallery.map((album, index) => (
             <motion.div
               key={album.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               onClick={() => openLightbox(album)}
               className="break-inside-avoid bg-white dark:bg-[#1C1C1E] rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-slate-100 dark:border-white/5"
             >
                <div className="relative overflow-hidden">
                   <img src={album.coverUrl} alt={album.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                   
                   <div className="absolute bottom-0 left-0 p-5 w-full">
                      <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest bg-white/20 backdrop-blur-md px-2 py-1 rounded-md mb-2 inline-block">
                        {album.category}
                      </span>
                      <h3 className="text-lg font-bold text-white leading-tight">{album.title}</h3>
                      <p className="text-xs text-white/70 mt-1">{album.images.length} Photos • {album.date}</p>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* 3. LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedAlbum(null)}
          >
            {/* Toolbar */}
            <div className="flex justify-between items-center p-6 text-white z-50 bg-gradient-to-b from-black/80 to-transparent" onClick={(e) => e.stopPropagation()}>
               <div>
                  <h3 className="text-lg font-bold">{selectedAlbum.title}</h3>
                  <p className="text-xs text-white/60">{lightboxIndex + 1} / {selectedAlbum.images.length}</p>
               </div>
               <div className="flex gap-4">
                  <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                     <Download size={20} />
                  </button>
                  <button onClick={() => setSelectedAlbum(null)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                     <X size={24} />
                  </button>
               </div>
            </div>

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center relative px-4 md:px-20">
               <button 
                 onClick={prevImage} 
                 className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
               >
                 <ChevronLeft size={32} />
               </button>
               
               <motion.img 
                 key={lightboxIndex}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 src={selectedAlbum.images.length > 0 ? selectedAlbum.images[lightboxIndex] : selectedAlbum.coverUrl}
                 className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
                 onClick={(e) => e.stopPropagation()}
               />

               <button 
                 onClick={nextImage} 
                 className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
               >
                 <ChevronRight size={32} />
               </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="h-24 bg-black/80 flex items-center gap-2 overflow-x-auto px-4 no-scrollbar z-50" onClick={(e) => e.stopPropagation()}>
               {selectedAlbum.images.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`h-16 aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${idx === lightboxIndex ? 'border-ios-blue scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
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
