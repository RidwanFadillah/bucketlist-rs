import React from 'react';
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react';

export const ImageLightbox = ({ src, alt, onClose }) => {
  if (!src) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Buka Gambar Asli"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Tutup"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-4xl max-h-[85vh] p-2 flex flex-col items-center">
        <img
          src={src}
          alt={alt || 'Pratinjau Foto'}
          className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        {alt && (
          <p className="mt-3 text-sm text-slate-300 text-center font-medium bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
            {alt}
          </p>
        )}
      </div>
    </div>
  );
};
