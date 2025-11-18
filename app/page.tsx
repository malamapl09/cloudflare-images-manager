"use client";

import { useState, useEffect } from "react";
import { FiImage } from "react-icons/fi";
import ImageUpload from "@/components/ImageUpload";
import ImageGallery from "@/components/ImageGallery";
import ThemeToggle from "@/components/ThemeToggle";
import type { ImageData } from "@/types/cloudflare";
import toast from "react-hot-toast";

export default function Home() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/images");

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data = await response.json();

      if (data.success) {
        setImages(data.result.images);
      } else {
        throw new Error(data.error || "Failed to fetch images");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUploadSuccess = () => {
    fetchImages();
  };

  const handleDelete = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiImage className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Cloudflare Images Manager
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Upload, manage, and share your images
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Upload New Images
          </h2>
          <ImageUpload onUploadSuccess={handleUploadSuccess} />
        </section>

        {/* Gallery Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Images
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : (
            <ImageGallery images={images} onDelete={handleDelete} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Powered by{" "}
            <a
              href="https://www.cloudflare.com/products/cloudflare-images/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Cloudflare Images
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
