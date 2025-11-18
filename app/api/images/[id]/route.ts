import { NextRequest, NextResponse } from "next/server";
import { deleteImage } from "@/lib/cloudflare";

/**
 * DELETE /api/images/[id] - Delete an image by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteImage(id);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to delete image", details: result.errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image", message: (error as Error).message },
      { status: 500 }
    );
  }
}
