"use client";

import { useState, useCallback } from "react";
import { FiUploadCloud, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import Image from "next/image";

interface ImageUploadProps {
  onUploadSuccess: () => void;
}

interface FileWithPreview {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export default function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    },
    []
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        addFiles(Array.from(selectedFiles));
      }
      // Reset input
      e.target.value = "";
    },
    []
  );

  const addFiles = (newFiles: File[]) => {
    const imageFiles = newFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    const filesWithPreview: FileWithPreview[] = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...filesWithPreview]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFile = async (fileWithPreview: FileWithPreview, index: number) => {
    const formData = new FormData();
    formData.append("file", fileWithPreview.file);

    // Update status to uploading
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index].status = "uploading";
      newFiles[index].progress = 0;
      return newFiles;
    });

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setFiles((prev) => {
          const newFiles = [...prev];
          if (newFiles[index].progress < 90) {
            newFiles[index].progress += 10;
          }
          return newFiles;
        });
      }, 200);

      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      if (data.success) {
        setFiles((prev) => {
          const newFiles = [...prev];
          newFiles[index].status = "success";
          newFiles[index].progress = 100;
          return newFiles;
        });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index].status = "error";
        newFiles[index].error = (error as Error).message;
        return newFiles;
      });
    }
  };

  const handleUploadAll = async () => {
    if (files.length === 0) return;

    setIsUploading(true);

    // Upload all pending files
    const pendingFiles = files.filter((f) => f.status === "pending");

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === "pending") {
        await uploadFile(files[i], i);
      }
    }

    setIsUploading(false);

    const successCount = files.filter((f) => f.status === "success").length;
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} image(s)!`);
      onUploadSuccess();

      // Clear successful uploads after a delay
      setTimeout(() => {
        setFiles((prev) => prev.filter((f) => f.status !== "success"));
      }, 2000);
    }
  };

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
  };

  return (
    <div className="w-full space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileInput}
          disabled={isUploading}
          multiple
        />

        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <FiUploadCloud className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isUploading
              ? "Uploading..."
              : "Drop your images here, or click to browse"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supports: JPG, PNG, GIF, WebP, SVG (Max 10MB each, multiple files allowed)
          </p>
        </label>
      </div>

      {/* Image Previews */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {files.length} image(s) selected
            </h3>
            <div className="flex gap-2">
              <button
                onClick={clearAll}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                disabled={isUploading}
              >
                Clear All
              </button>
              <button
                onClick={handleUploadAll}
                disabled={isUploading || files.filter((f) => f.status === "pending").length === 0}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((fileWithPreview, index) => (
              <div
                key={index}
                className="relative group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={fileWithPreview.preview}
                    alt={fileWithPreview.file.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />

                  {/* Status Overlay */}
                  {fileWithPreview.status === "uploading" && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm">{fileWithPreview.progress}%</p>
                      </div>
                    </div>
                  )}

                  {fileWithPreview.status === "success" && (
                    <div className="absolute inset-0 bg-green-500 bg-opacity-75 flex items-center justify-center">
                      <FiCheck className="w-12 h-12 text-white" />
                    </div>
                  )}

                  {fileWithPreview.status === "error" && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
                      <FiAlertCircle className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>

                <div className="p-2">
                  <p className="text-xs text-gray-700 dark:text-gray-300 truncate" title={fileWithPreview.file.name}>
                    {fileWithPreview.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(fileWithPreview.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {fileWithPreview.status === "pending" && !isUploading && (
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
