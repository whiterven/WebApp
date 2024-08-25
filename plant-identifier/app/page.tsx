'use client';

import { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import PlantInfo from './components/PlantInfo';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (file: File) => {
    setImage(file);
    setResult(null);
  };

  const identifyPlant = async () => {
    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('/api/identify-plant', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to identify plant');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error identifying plant:', error);
      setResult('Error identifying plant. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-700">Plant Identifier</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <ImageUpload onImageUpload={handleImageUpload} />
          {image && (
            <button
              onClick={identifyPlant}
              disabled={loading}
              className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Identifying...' : 'Identify Plant'}
            </button>
          )}
        </div>
        {result && <PlantInfo info={result} />}
      </main>
      <Footer />
    </div>
  );
}