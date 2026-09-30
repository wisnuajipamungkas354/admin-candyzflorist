import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  X, 
  Crop, 
  Loader2
} from 'lucide-react';
import getCroppedImg from '../utils/cropImage';

// Satu ukuran tetap potret (3:4)
const PORTRAIT_ASPECT = 3 / 4;

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  fileName = 'cropped.jpg',
  onClose,
  onCropComplete,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const handleApply = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    setProcessing(true);
    try {
      const { file, url } = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        fileName
      );
      onCropComplete({ file, url });
      onClose();
    } catch (e) {
      console.error('Gagal memotong gambar:', e);
      alert('Gagal memproses crop gambar: ' + (e.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200 dark:border-[#3D2D33] rounded-3xl max-w-lg w-full flex flex-col max-h-[92vh] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-floral-pink-100 dark:border-[#33262A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-floral-pink-50 dark:bg-floral-pink-950/60 text-floral-pink-600">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-floral-dark dark:text-white leading-tight">
                Sesuaikan Foto (Ukuran Potret 3:4)
              </h3>
              <p className="text-[11px] text-floral-muted dark:text-slate-400">
                Posisikan buket agar pas dengan bingkai potret etalase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-floral-muted hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Work Area - Fixed 3:4 Portrait */}
        <div className="relative flex-1 min-h-[340px] sm:min-h-[400px] bg-slate-950 overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={PORTRAIT_ASPECT}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={handleCropComplete}
            showGrid={true}
          />
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-floral-cream/40 dark:bg-[#1E1719] border-t border-floral-pink-100 dark:border-[#33262A]">
          <div className="flex items-center justify-between gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
                className="p-1 rounded-lg text-floral-muted hover:text-floral-pink-600 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-floral-pink-500 cursor-pointer h-1.5 bg-floral-pink-200/80 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
                className="p-1 rounded-lg text-floral-muted hover:text-floral-pink-600 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Rotate Button */}
            <button
              type="button"
              onClick={handleRotate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-floral-pink-200 dark:border-[#3D2D33] bg-white dark:bg-[#2A2024] text-xs font-semibold text-floral-dark dark:text-slate-300 hover:bg-floral-pink-50 dark:hover:bg-[#33262A] transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5 text-floral-pink-500" />
              <span>Putar 90°</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-floral-muted hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-floral-pink-100 dark:border-[#33262A] flex items-center justify-end gap-2.5 bg-white dark:bg-[#221A1D]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-floral-dark dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={processing}
            onClick={handleApply}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-floral-pink-500 hover:bg-floral-pink-600 text-xs sm:text-sm font-semibold text-white shadow-md shadow-floral-pink-500/20 active:scale-95 transition-all disabled:opacity-60"
          >
            {processing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{processing ? 'Memotong...' : 'Terapkan Hasil Potret'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
