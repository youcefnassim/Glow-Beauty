import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, Link2, CheckCircle2, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  aspectRatio?: 'video' | 'square' | 'banner';
  maxSizeMB?: number;
  className?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  aspectRatio = 'video',
  maxSizeMB = 5,
  className = '',
}) => {
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isAr = language === 'ar';

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawResult = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const maxDimension = 1000;
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawResult);
            return;
          }

          // Fond blanc si image transparente vers jpeg
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          try {
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            resolve(compressed);
          } catch {
            resolve(rawResult);
          }
        };
        img.onerror = () => resolve(rawResult);
        img.src = rawResult;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleProcessFile = async (file: File) => {
    setErrorMsg(null);

    if (!file.type.startsWith('image/')) {
      setErrorMsg(t('admin.imageUpload.invalidFile'));
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(t('admin.imageUpload.fileTooLarge', { max: maxSizeMB }));
      return;
    }

    setIsProcessing(true);
    try {
      const compressedDataUrl = await compressImage(file);
      if (compressedDataUrl) {
        onChange(compressedDataUrl);
      }
    } catch {
      setErrorMsg(isAr ? 'تعذر تحميل الصورة، يرجى المحاولة مرة أخرى.' : 'Échec du traitement de l’image.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = () => {
    onChange('');
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Ratio aspect class
  const ratioClasses = {
    square: 'aspect-square max-w-[200px]',
    video: 'aspect-[16/10] max-w-[320px]',
    banner: 'aspect-[21/9] max-w-[420px]',
  }[aspectRatio];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="font-semibold text-deep text-xs block">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-mutedText hover:text-deep flex items-center gap-1 transition cursor-pointer"
        >
          <Link2 className="w-3 h-3 text-rose-700" />
          <span>{showUrlInput ? (isAr ? 'إخفاء الرابط' : 'Masquer URL') : (isAr ? 'أو لصق رابط ويب' : 'Ou coller un lien URL')}</span>
        </button>
      </div>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* URL input fallback if toggled */}
      {showUrlInput && (
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 animate-fadeIn">
          <label className="text-[10px] font-semibold text-mutedText block">
            {isAr ? 'رابط مباشر للصورة (URL)' : 'Lien direct vers l’image (URL)'}
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={value.startsWith('data:') ? '' : value}
              onChange={(e) => {
                onChange(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 text-xs p-2.5 rounded-lg border border-stone-200 bg-white"
            />
            {value && !value.startsWith('data:') && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-2.5 py-1 text-xs text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition"
              >
                {t('admin.imageUpload.remove')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Upload / Preview Area */}
      {value ? (
        <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center gap-4">
          <div className={`${ratioClasses} w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative group`}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          <div className="flex-1 w-full space-y-2 text-start">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'تم تحميل الصورة بنجاح' : 'Image prête et optimisée'}</span>
            </div>
            <p className="text-[11px] text-mutedText">
              {value.startsWith('data:image')
                ? (isAr ? 'ملف محمل من جهازك (محسن تلقائياً)' : 'Fichier importé depuis votre appareil (compressé)')
                : (isAr ? 'صورة عبر رابط خارجي' : 'Image hébergée via URL externe')}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-deep text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                {isProcessing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-rose-700" />
                )}
                <span>{t('admin.imageUpload.change')}</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={isProcessing}
                className="px-3 py-1.5 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('admin.imageUpload.remove')}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition ${
            isDragOver
              ? 'border-rose-500 bg-rose-50/50 scale-[0.99]'
              : 'border-stone-300 hover:border-rose-400 bg-stone-50/50 hover:bg-rose-50/20'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-100/70 text-rose-800 flex items-center justify-center mb-2.5">
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 animate-spin text-rose-700" />
            ) : (
              <Upload className="w-6 h-6 text-rose-700" />
            )}
          </div>

          <p className="font-semibold text-deep text-xs">
            {isProcessing ? t('admin.imageUpload.processing') : t('admin.imageUpload.title')}
          </p>
          <p className="text-[11px] text-mutedText mt-1 max-w-xs">
            {t('admin.imageUpload.dragDrop')}
          </p>
          <span className="mt-2 text-[10px] text-rose-700 bg-rose-50 font-medium px-2.5 py-0.5 rounded-full border border-rose-100">
            JPG, PNG, WEBP (Max {maxSizeMB} Mo)
          </span>
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] text-rose-600 font-medium animate-fadeIn">
          {errorMsg}
        </p>
      )}
    </div>
  );
};
