'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { App } from 'antd';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Custom modal component to avoid antd compatibility issues
const CropModal = ({ title, open, onOk, onCancel, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 backdrop-blur-sm bg-blue-600/40" onClick={onCancel}></div>
      <div className="bg-white rounded-lg w-full max-w-4xl z-10 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onOk}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

// Canvas preview helper function
function canvasPreview(
  image,
  canvas,
  crop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.save();
  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const centerX = canvas.width / 2 / pixelRatio;
  const centerY = canvas.height / 2 / pixelRatio;
  ctx.translate(centerX, centerY);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  ctx.restore();
}

// Helper function to convert canvas to blob
function toBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.95);
  });
}

const ImageUploader = ({
  type, // "avatar", "background", "logo"
  title,
  filePreview,
  onUpload,
  onRemove,
  required = false,
  layoutName = 'modern', // For conditional rendering based on card layout
  isProfilePhoto = null // auto-determine from type if null
}) => {
  const { message } = App.useApp();
  const inputRef = useRef(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const dropAreaRef = useRef(null);
  
  // Determine if this is a profile photo
  const isProfile = isProfilePhoto !== null 
    ? isProfilePhoto 
    : type === 'avatar';
    
  // Debug logging
  useEffect(() => {
    console.log('Current layout name:', layoutName);
    console.log('Is profile photo:', isProfile);
    console.log('Should use circular crop:', layoutName === 'modern' && isProfile);
  }, [layoutName, isProfile]);
  
  // State
  const [imageSrc, setImageSrc] = useState(filePreview);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 80,
    height: isProfile ? 80 : 46,
    x: 10,
    y: 10,
    aspect: isProfile ? 1 : 16/9,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [modalKey, setModalKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Update imageSrc when filePreview changes (from parent component)
  useEffect(() => {
    setImageSrc(filePreview);
  }, [filePreview]);
  
  // Set up drag and drop
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;
    
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    const highlight = () => setIsDragging(true);
    const unhighlight = () => setIsDragging(false);
    
    const handleDrop = (e) => {
      preventDefaults(e);
      unhighlight();
      
      const dt = e.dataTransfer;
      const files = dt.files;
      
      if (files && files.length) {
        handleFiles(files);
      }
    };
    
    const handleFiles = (files) => {
      if (files[0]) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          // Create a synthetic event object
          const syntheticEvent = {
            target: { files: [file] }
          };
          handleFileSelect(syntheticEvent);
        } else {
          message.error('Please upload an image file');
        }
      }
    };
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea?.removeEventListener(eventName, preventDefaults, false);
      });
      
      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea?.removeEventListener(eventName, highlight, false);
      });
      
      ['dragleave', 'drop'].forEach(eventName => {
        dropArea?.removeEventListener(eventName, unhighlight, false);
      });
      
      dropArea?.removeEventListener('drop', handleDrop, false);
    };
  }, [message]);

  // Get appropriate style for the upload area based on layout and type
  const getUploadAreaStyle = useCallback(() => {
    if (!isProfile) return 'w-full h-36 rounded-lg'; 
    
    return layoutName === 'modern'
      ? 'w-40 h-40 mx-auto rounded-full' 
      : 'w-40 h-40 mx-auto rounded-lg';
  }, [isProfile, layoutName]);

  // Get appropriate style for the preview image
  const getPreviewImageStyle = useCallback(() => {
    if (!isProfile) return 'rounded-lg';
    
    return layoutName === 'modern' ? 'rounded-full' : 'rounded-lg';
  }, [isProfile, layoutName]);

  // Handle file selection and start cropping flow
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log(`File selected for ${isProfile ? 'Profile Photo' : 'Cover Photo'}, layout: ${layoutName}`);
    
    // Create a temporary URL for the preview image
    const tempPreviewUrl = URL.createObjectURL(file);
    const loadingMsg = message.loading('Processing image...', 0);
    
    // Pre-load the image
    const img = new Image();
    img.onload = () => {
      loadingMsg();
      setTempImageSrc(tempPreviewUrl);
      setModalKey(prevKey => prevKey + 1);
      
      // Reset crop and transforms
      setScale(1);
      setRotate(0);
      
      // Show crop modal
      setShowCropModal(true);
    };
    img.onerror = () => {
      loadingMsg();
      message.error('Failed to load image. Please try another file.');
      URL.revokeObjectURL(tempPreviewUrl);
      if (inputRef.current) inputRef.current.value = '';
    };
    img.src = tempPreviewUrl;
  }, [message, isProfile, layoutName]);

  // Handle image load in crop modal
  const onImageLoad = useCallback((img) => {
    try {
      const imageElement = img.target || img;
      if (!imageElement) return false;
      
      imgRef.current = imageElement;
      
      // Set initial crop based on the image dimensions
      const imgWidth = imageElement.width;
      const imgHeight = imageElement.height;
      
      let initialCrop;
      
      if (isProfile) {
        // For profile, use a square crop centered in the image
        const size = Math.min(imgWidth, imgHeight) * 0.8;
        const percentSize = (size / Math.min(imgWidth, imgHeight)) * 100;
        
        initialCrop = {
          unit: '%',
          width: percentSize,
          height: percentSize,
          x: (100 - percentSize) / 2,
          y: (100 - percentSize) / 2,
          aspect: 1 // Always use square aspect ratio for profile photos
        };
      } else {
        // For cover, use a 16:9 aspect ratio rectangular crop
        const width = 80; // 80% of the image width
        const height = width / (16/9);
        
        initialCrop = {
          unit: '%',
          width: width,
          height: height,
          x: (100 - width) / 2,
          y: (100 - height) / 2,
          aspect: 16/9 // 16:9 aspect ratio for cover
        };
      }
      
      setCrop(initialCrop);
      
      // Also set the completed crop to start with
      const pixelCrop = {
        unit: 'px',
        width: (initialCrop.width / 100) * imgWidth,
        height: (initialCrop.height / 100) * imgHeight,
        x: (initialCrop.x / 100) * imgWidth,
        y: (initialCrop.y / 100) * imgHeight,
      };
      setCompletedCrop(pixelCrop);
      
      return false;
    } catch (error) {
      console.error("Error in onImageLoad:", error);
      return false;
    }
  }, [isProfile]);

  // Effect to update the preview canvas when crop changes
  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      // Use canvas preview to create a high-quality preview
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate
      );
    }
  }, [completedCrop, scale, rotate]);

  // Handle zoom slider change
  const handleScaleChange = useCallback((e) => {
    const value = parseFloat(e.target.value);
    setScale(value);
  }, []);

  // Generate cropped image from canvas
  const generateCroppedImage = useCallback(async () => {
    try {
      if (!imgRef.current || !completedCrop || !previewCanvasRef.current) {
        message.error('No crop selection available');
        return null;
      }
      
      // Create offscreen canvas for the final output
      const offscreen = document.createElement('canvas');
      const ctx = offscreen.getContext('2d');
      
      if (!ctx) {
        throw new Error('No 2d context');
      }
      
      // Set size based on profile/cover type
      if (isProfile) {
        // For profile photos, create a square canvas
        const size = Math.min(completedCrop.width, completedCrop.height);
        offscreen.width = size;
        offscreen.height = size;
      } else {
        // For cover photos, use the actual crop dimensions
        offscreen.width = completedCrop.width;
        offscreen.height = completedCrop.height;
      }
      
      // Draw the preview canvas onto the offscreen canvas
      ctx.drawImage(
        previewCanvasRef.current,
        0,
        0,
        previewCanvasRef.current.width,
        previewCanvasRef.current.height,
        0,
        0,
        offscreen.width,
        offscreen.height
      );
      
      // For profile photos in modern layout, apply circular mask
      if (isProfile && layoutName === 'modern') {
        console.log('Applying circular mask to profile photo');
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(
          offscreen.width / 2,
          offscreen.height / 2,
          offscreen.width / 2,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      
      // Convert to blob
      const blob = await toBlob(offscreen);
      
      if (!blob) {
        throw new Error('Failed to create blob');
      }
      
      const fileName = 'cropped-image.jpeg';
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      
      return { file, url };
    } catch (error) {
      console.error('Error generating cropped image:', error);
      message.error('Failed to generate image');
      return null;
    }
  }, [completedCrop, isProfile, layoutName, message]);

  // Apply crop and save changes
  const applyChanges = useCallback(async () => {
    if (!completedCrop) {
      message.error('Please select a crop area first');
      return;
    }
    
    const loadingMsg = message.loading('Processing image...', 0);
    
    try {
      const result = await generateCroppedImage();
      
      if (result) {
        const { file, url } = result;
        
        // Update preview
        setImageSrc(url);
        
        // Create crop position data
        const cropPositionData = {
          crop: completedCrop,
          scale: scale,
          rotate: rotate,
          layoutName: layoutName,
          isCircular: isProfile && layoutName === 'modern' // Add information about circularity
        };
        
        // Call parent's upload handler
        onUpload(
          { target: { files: [file] } }, // Synthetic event
          type, 
          cropPositionData
        );
        
        // Clean up
        if (tempImageSrc) URL.revokeObjectURL(tempImageSrc);
        
        loadingMsg();
        setShowCropModal(false);
        setTempImageSrc(null);
        
        message.success(`${title} updated successfully!`);
      }
    } catch (e) {
      console.error('Error applying changes:', e);
      message.error('Failed to process image');
      loadingMsg();
    }
  }, [completedCrop, generateCroppedImage, message, scale, rotate, tempImageSrc, title, onUpload, type, isProfile, layoutName]);

  // Handle cancel button in modal
  const handleCancel = useCallback(() => {
    if (tempImageSrc) URL.revokeObjectURL(tempImageSrc);
    
    setShowCropModal(false);
    setTempImageSrc(null);
    
    if (inputRef.current) inputRef.current.value = '';
    
    message.info('Image editing canceled');
  }, [tempImageSrc, message]);

  // Handle remove button
  const handleRemove = useCallback((e) => {
    e?.stopPropagation(); // Prevent triggering click on upload area
    setImageSrc('');
    if (onRemove) {
      onRemove(type);
    }
    
    if (inputRef.current) inputRef.current.value = '';
  }, [onRemove, type]);

  // Handle edit button click
  const handleEdit = useCallback((e) => {
    e?.stopPropagation(); // Prevent triggering click on upload area
    if (!imageSrc) return;
    
    setTempImageSrc(imageSrc);
    setModalKey(prevKey => prevKey + 1);
    
    // Show crop modal
    setShowCropModal(true);
  }, [imageSrc]);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <button 
          className="text-sm text-blue-500 hover:text-blue-700" 
          title="More info"
          aria-label="More information"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </button>
      </div>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={inputRef}
        id={`file-input-${type}`}
        accept="image/*"
        className="!hidden"
        onChange={handleFileSelect}
      />
      
      {/* Upload area with dynamic shape based on layout */}
      <div 
        ref={dropAreaRef}
        onClick={() => inputRef.current?.click()}
        className={`
          transition-all duration-200 cursor-pointer
          ${getUploadAreaStyle()}
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50'}
          ${imageSrc 
            ? '' 
            : 'border-2 border-dashed'}
        `}
      >
        {imageSrc ? (
          <div className="w-full h-full relative group">
            <img 
              src={imageSrc}
              alt={`Uploaded ${title}`}
              className={`
                w-full h-full object-cover
                ${getPreviewImageStyle()}
              `}
            />
            <div className={`
              absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100
              transition-opacity duration-200 flex items-center justify-center gap-3
              ${getPreviewImageStyle()}
            `}>
              <button
                onClick={handleEdit}
                className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600"
                title="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={handleRemove}
                className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
                title="Remove"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            {isProfile ? (
              <>
                <div className="p-3 bg-gray-200 rounded-full mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-blue-500 text-sm font-medium">Select</span>
                <span className="text-gray-500 text-xs mt-1 text-center px-2">file or drag and drop one here</span>
              </>
            ) : (
              <>
                <div className="flex gap-3 mb-2">
                  <div className="p-2 bg-gray-200 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="p-2 bg-gray-200 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="p-2 bg-gray-200 rounded">
                    <span className="text-xs font-medium">GIF</span>
                  </div>
                </div>
                <span className="text-blue-500 text-sm font-medium">Select</span>
                <span className="text-gray-500 text-xs mt-1 text-center">image, video, gif file or drag and drop one here</span>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Crop Modal with clear indication of photo type */}
      {showCropModal && (
        <CropModal
          key={`${isProfile ? 'profile' : 'cover'}-${layoutName}-${modalKey}`}
          title={`Crop ${title}`}
          open={showCropModal}
          onOk={applyChanges}
          onCancel={handleCancel}
        >
          <div className="flex flex-col gap-6">
            <p className="text-gray-600">
              {isProfile 
                ? layoutName === 'modern'
                  ? "Select the area for your profile photo (will appear as a circle)"
                  : "Select the area for your profile photo (will appear as a square)"
                : "Select the area for your cover photo"}
            </p>
            
            {/* Image Crop Container */}
            <div className="crop-container flex justify-center overflow-hidden" style={{ maxHeight: '400px' }}>
              {tempImageSrc && (
                <div className="flex justify-center w-full">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={isProfile ? 1 : 16/9}
                    circularCrop={isProfile && layoutName === 'modern'}
                    keepSelection
                    ruleOfThirds
                  >
                    <img 
                      ref={imgRef}
                      src={tempImageSrc}
                      alt="Crop preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        transform: `scale(${scale}) rotate(${rotate}deg)`,
                        transformOrigin: 'center center'
                      }}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex flex-col items-start gap-4 w-full">
              {/* Scale Slider */}
              <div className="w-full">
                <div className="flex justify-between w-full mb-1">
                  <span className="font-medium">Zoom</span>
                  <span className="text-gray-500">{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={scale}
                  onChange={handleScaleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              {/* Rotation Control */}
              <div className="w-full">
                <div className="flex justify-between w-full mb-1">
                  <span className="font-medium">Rotate</span>
                  <span className="text-gray-500">{rotate}°</span>
                </div>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={rotate}
                  onChange={(e) => setRotate(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            {/* Hidden Preview Canvas */}
            <canvas
              ref={previewCanvasRef}
              className="!hidden"
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: completedCrop?.width,
                height: completedCrop?.height,
              }}
            />
            
            {/* Debug Info */}
            <div className="text-sm text-gray-400 mt-2">
              Layout: {layoutName}, Is Profile: {isProfile ? 'Yes' : 'No'}, 
              Circular Crop: {isProfile && layoutName === 'modern' ? 'Yes' : 'No'}
            </div>
          </div>
        </CropModal>
      )}
    </div>
  );
};

export default ImageUploader;