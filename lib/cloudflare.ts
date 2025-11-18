import type {
  CloudflareListResponse,
  CloudflareUploadResponse,
  CloudflareDeleteResponse,
} from "@/types/cloudflare";

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

const headers = {
  Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
};

/**
 * Upload an image to Cloudflare Images
 */
export async function uploadImage(file: File): Promise<CloudflareUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * List all images with pagination
 */
export async function listImages(
  page: number = 1,
  perPage: number = 100
): Promise<CloudflareListResponse> {
  const url = new URL(BASE_URL);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("per_page", perPage.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete an image by ID
 */
export async function deleteImage(imageId: string): Promise<CloudflareDeleteResponse> {
  const response = await fetch(`${BASE_URL}/${imageId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to delete image: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get the public URL for an image
 */
export function getImageUrl(imageId: string, variant: string = "public"): string {
  const accountHash = process.env.CLOUDFLARE_ACCOUNT_HASH!;
  return `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`;
}
