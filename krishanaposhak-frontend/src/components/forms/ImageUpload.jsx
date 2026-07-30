import { forwardRef, useRef, useCallback, useState, useId } from 'react';
import { cn } from '@/utils/cn';

const ImageUpload = forwardRef(function ImageUpload(
  {
    label,
    name,
    maxSize = 5,
    multiple = false,
    files = [],
    onChange,
    error,
    helperText,
    isDisabled = false,
    aspectRatio = '4/3',
    className,
  },
  ref,
) {
  const generatedId = useId();
  const inputId = name || generatedId;
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (newFiles) => {
      const validFiles = Array.from(newFiles).filter((file) => {
        if (!file.type.startsWith('image/')) return false;
        if (file.size > maxSize * 1024 * 1024) return false;
        return true;
      });

      if (validFiles.length > 0) {
        const newFileList = multiple ? [...files, ...validFiles] : [validFiles[0]];
        onChange?.(newFileList);
      }
    },
    [maxSize, multiple, files, onChange],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (!isDisabled) handleFiles(e.dataTransfer.files);
    },
    [isDisabled, handleFiles],
  );

  const handleRemove = useCallback(
    (index) => {
      const newFiles = files.filter((_, i) => i !== index);
      onChange?.(newFiles);
    },
    [files, onChange],
  );

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-dark-charcoal">
          {label}
        </label>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          isDragging
            ? 'border-royal-blue bg-royal-blue/5'
            : 'border-muted-sand hover:border-royal-blue/50 hover:bg-royal-blue/5',
          isDisabled && 'cursor-not-allowed opacity-50',
          error && 'border-error',
        )}
        style={{ aspectRatio }}
      >
        <svg className="mb-2 h-10 w-10 text-natural-wood" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <p className="text-sm font-medium text-dark-charcoal">
          {isDragging ? 'Drop images here' : 'Upload images'}
        </p>
        <p className="mt-1 text-xs text-natural-wood">
          PNG, JPG, WebP up to {maxSize}MB
        </p>
      </div>

      <input
        ref={(el) => {
          inputRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        id={inputId}
        name={name}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
        disabled={isDisabled}
        className="hidden"
      />

      {files.length > 0 && (
        <div className={cn('mt-3 grid gap-3', multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1')}>
          {Array.from(files).map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-24 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                aria-label={`Remove ${file.name}`}
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-error text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-error" role="alert">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-natural-wood">{helperText}</p>
      )}
    </div>
  );
});

export default ImageUpload;

