import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageUpload(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCameraCapture = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing the camera", err);
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 300, 150);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
            onImageUpload(file);
            setPreview(URL.createObjectURL(file));
          }
        }, 'image/jpeg');
      }
      if (videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Upload Image
        </button>
        <button
          onClick={handleCameraCapture}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Take Photo
        </button>
      </div>
      {preview && (
        <div className="mt-4">
          <Image src={preview} alt="Preview" width={300} height={150} className="rounded-lg mx-auto" />
        </div>
      )}
      <video ref={videoRef} className="hidden" />
      <canvas ref={canvasRef} width={300} height={150} className="hidden" />
      {videoRef.current && videoRef.current.srcObject && (
        <button
          onClick={captureImage}
          className="mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Capture
        </button>
      )}
    </div>
  );
};

export default ImageUpload;