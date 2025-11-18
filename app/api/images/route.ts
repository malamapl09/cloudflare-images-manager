import { NextRequest, NextResponse } from "next/server";
import { uploadImage, listImages, getImageUrl } from "@/lib/cloudflare";

/**
 * POST /api/images - Upload a new image
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Upload to Cloudflare
    const result = await uploadImage(file);

    if (!result.success) {
      return NextResponse.json(
        { error: "Upload failed", details: result.errors },
        { status: 500 }
      );
    }

    // Add public URL to the response
    const imageWithUrl = {
      ...result.result,
      publicUrl: getImageUrl(result.result.id),
    };

    return NextResponse.json({
      success: true,
      result: imageWithUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image", message: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/images - List all images with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("per_page") || "100", 10);

    const result = await listImages(page, perPage);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to fetch images", details: result.errors },
        { status: 500 }
      );
    }

    // Add public URLs to all images
    const imagesWithUrls = result.result.images.map((image) => ({
      ...image,
      publicUrl: getImageUrl(image.id),
    }));

    return NextResponse.json({
      success: true,
      result: {
        images: imagesWithUrls,
      },
      result_info: result.result_info,
    });
  } catch (error) {
    console.error("List images error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images", message: (error as Error).message },
      { status: 500 }
    );
  }
}
