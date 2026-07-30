import { forwardRef, useRef, useCallback, useState, useId } from 'react';
import { cn } from '@/utils/cn';

const FileUpload = forwardRef(function FileUpload(
  {
    label,
    name,
    accept = 'image/*,.pdf,.doc,.docx',
    maxSize = 5,
    multiple = false,
    files = [],
    onChange,
    error,
    helperText,
    isDisabled = false,
    preview = false,
    dropzone = true,
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
        const isValidType = accept
          ? accept.split(',').some((type) => {
              const t = type.trim();
              if (t.startsWith('.')) return file.name.endsWith(t);
              if (t.endsWith('/*')) return file.type.startsWith(t.replace('/*', '/'));
              return file.type === t || file.type.startsWith(t);
            })
          : true;
        const isValidSize = file.size <= maxSize * 1024 * 1024;
        return isValidType && isValidSize;
      });

      if (validFiles.length > 0) {
        const newFileList = multiple ? [...files, ...validFiles] : [validFiles[0]];
        onChange?.(newFileList);
      }
    },
    [accept, maxSize, multiple, files, onChange],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (!isDisabled) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [isDisabled, handleFiles],
  );

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(true);
    },
    [],
  );

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleRemove = useCallback(
    (index) => {
      const newFiles = files.filter((_, i) => i !== index);
      onChange?.(newFiles);
    },
    [files, onChange],
  );

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-dark-charcoal">
          {label}
        </label>
      )}

      {dropzone ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
            isDragging
              ? 'border-royal-blue bg-royal-blue/5'
              : 'border-muted-sand hover:border-royal-blue/50 hover:bg-royal-blue/5',
            isDisabled && 'cursor-not-allowed opacity-50',
            error && 'border-error',
          )}
        >
          <svg className="mb-2 h-10 w-10 text-natural-wood" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm font-medium text-dark-charcoal">
            {isDragging ? 'Drop files here' : 'Drag & drop files or click to browse'}
          </p>
          <p className="mt-1 text-xs text-natural-wood">
            Max {maxSize}MB {accept && `• ${accept.split(',').join(', ')}`}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isDisabled}
          className={cn(
            'w-full rounded border border-muted-sand bg-white px-4 py-2 text-sm text-dark-charcoal hover:bg-muted-sand/10 transition-colors',
            isDisabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          Browse files
        </button>
      )}

      <input
        ref={(el) => {
          inputRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        id={inputId}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
        disabled={isDisabled}
        className="hidden"
      />

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {Array.from(files).map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded border border-muted-sand/30 bg-white px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                {preview && file.type?.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-8 w-8 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-muted-sand/20 text-natural-wood">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm text-dark-charcoal">{file.name}</p>
                  <p className="text-xs text-natural-wood">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label={`Remove ${file.name}`}
                className="ml-2 flex-shrink-0 text-natural-wood hover:text-error transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
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

export default FileUpload;

