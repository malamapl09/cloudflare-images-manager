// Cloudflare Images API Types

export interface CloudflareImage {
  id: string;
  filename: string;
  uploaded: string;
  requireSignedURLs: boolean;
  variants: string[];
  meta?: Record<string, unknown>;
}

export interface CloudflareListResponse {
  success: boolean;
  errors: CloudflareError[];
  messages: string[];
  result: {
    images: CloudflareImage[];
  };
  result_info: {
    page: number;
    per_page: number;
    count: number;
    total_count: number;
  };
}

export interface CloudflareUploadResponse {
  success: boolean;
  errors: CloudflareError[];
  messages: string[];
  result: CloudflareImage;
}

export interface CloudflareDeleteResponse {
  success: boolean;
  errors: CloudflareError[];
  messages: string[];
  result: Record<string, never>;
}

export interface CloudflareError {
  code: number;
  message: string;
}

export interface ImageData extends CloudflareImage {
  // Client-side URLs for different variants
  publicUrl?: string;
  thumbnailUrl?: string;
  // Additional metadata
  fileSize?: number;
  width?: number;
  height?: number;
}
