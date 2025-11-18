"use client";

import { useState } from "react";
import Image from "next/image";
import { FiCopy, FiTrash2, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import type { ImageData } from "@/types/cloudflare";

interface ImageCardProps {
  image: ImageData;
  onDelete: (imageId: string) => void;
}

export default function ImageCard({ image, onDelete }: ImageCardProps) {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(image.publicUrl || "");
      setCopied(true);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/images/${image.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      toast.success("Image deleted successfully");
      onDelete(image.id);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={image.publicUrl || ""}
          alt={image.filename}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Info & Actions */}
      <div className="p-4">
        <p className="text-sm font-medium text-gray-900 truncate mb-2">
          {image.filename}
        </p>
        <p className="text-xs text-gray-500 mb-3">
          {new Date(image.uploaded).toLocaleDateString()}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyUrl}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            disabled={isDeleting}
          >
            {copied ? (
              <>
                <FiCheck className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <FiCopy className="w-4 h-4" />
                Copy URL
              </>
            )}
          </button>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              disabled={isDeleting}
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleDelete}
              className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
              disabled={isDeleting}
            >
              {isDeleting ? "..." : "Confirm"}
            </button>
          )}
        </div>

        {showDeleteConfirm && !isDeleting && (
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="w-full mt-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
