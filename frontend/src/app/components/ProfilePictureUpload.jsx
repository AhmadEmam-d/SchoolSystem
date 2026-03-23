import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from './ui/button';

export function ProfilePictureUpload({ 
  currentImage, 
  userName, 
  onImageChange, 
  isEditing 
}) {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setPreviewImage(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = previewImage || currentImage;
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <div className="relative group">
        {displayImage ? (
          <img
            src={displayImage}
            alt={userName}
            className="h-24 w-24 rounded-full object-cover border-4 border-background shadow-lg"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-background shadow-lg">
            {initials}
          </div>
        )}
        
        {isEditing && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/50 dark:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="h-8 w-8 text-white" />
          </button>
        )}
      </div>

      {isEditing && (
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="w-fit"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
          </Button>
          {(displayImage || previewImage) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              className="w-fit text-destructive hover:text-destructive/80"
            >
              <X className="h-4 w-4 mr-2" />
              Remove Photo
            </Button>
          )}
          <p className="text-xs text-muted-foreground">
            JPG, PNG or GIF (max. 5MB)
          </p>
        </div>
      )}
    </div>
  );
}