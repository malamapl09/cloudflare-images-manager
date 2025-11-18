"use client";

import { useState, useMemo } from "react";
import ImageCard from "./ImageCard";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import type { ImageData } from "@/types/cloudflare";

interface ImageGalleryProps {
  images: ImageData[];
  onDelete: (imageId: string) => void;
}

const IMAGES_PER_PAGE = 12;

export default function ImageGallery({ images, onDelete }: ImageGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter images based on search query
  const filteredImages = useMemo(() => {
    if (!searchQuery.trim()) return images;

    return images.filter((image) =>
      image.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [images, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No images yet. Upload your first image to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <SearchBar value={searchQuery} onChange={handleSearchChange} />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"}
        </p>
      </div>

      {/* Images Grid */}
      {currentImages.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentImages.map((image) => (
              <ImageCard key={image.id} image={image} onDelete={onDelete} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No images found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
