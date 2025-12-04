
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, BookOpen, X, ChevronRight, Download } from 'lucide-react';
import { galleryImages } from '../data';

export const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">e-Magazine & Gallery</h1>
        <p className="text-slate-500 dark:text-slate-400">Highlights, memories, and school publications.</p>
      </div>

      {/* Featured Magazine Shelf */}
      <div className="relative">
         <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
           <BookOpen className="text-ios-blue" size={20} />
           Latest Publications
         </h2>
         <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 snap-x">
            {[1, 2].map((i) => (
              <div key={i} className="snap-center flex-shrink-0 w-64 md:w-72 flex flex-col group cursor-pointer">
                 <div className="aspect-[3/4] rounded-2xl bg-white dark:bg-[#1C1C1E] shadow-xl border border-slate-100 dark:border-white/5 overflow-hidden relative transform transition-transform group-hover:-translate-y-2 duration-300">
                    <img 
                      src={`https://images.unsplash.com/photo-${i === 1 ? '1544716278-ca65e1112019' : '1532012197267-da84d127e765'}?auto=format&fit=crop&w=600&q=80`} 
                      alt="Magazine Cover" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                       <button className="w-full py-2 bg-white text-black font-bold rounded-xl text-sm shadow-lg">Read Now</button>
                    </div>
                 </div>
                 <h3 className="font-bold text-slate-900 dark:text-white mt-4 text-lg">School Chronicles Vol. {i}</h3>
                 <p className="text-slate-500 text-sm">October 2025 Edition</p>
              </div>
            ))}
         </div>
      </div>

      <div className="border-t border-slate-100 dark:border-white/5 pt-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Event Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((img, index) => (
            <motion.div
              key={img.id}
              onClick={() => setSelectedImage(img.id)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative aspect-[4/3] rounded-[1.5rem] overflow-hidden shadow-sm cursor-pointer"
            >
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                 <span className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-md w-fit">{img.category}</span>
                 <h3 className="text-lg font-bold text-white leading-tight">{img.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
              <X size={32} />
            </button>
            <div className="w-full max-w-5xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
               <img 
                 src={galleryImages.find(i => i.id === selectedImage)?.url} 
                 className="w-full h-full object-contain rounded-lg shadow-2xl" 
               />
               <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white text-2xl font-bold">{galleryImages.find(i => i.id === selectedImage)?.title}</h3>
                  <button className="mt-4 flex items-center gap-2 text-white/80 hover:text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                    <Download size={18} /> Download High-Res
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
