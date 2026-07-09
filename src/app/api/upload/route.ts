import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import cloudinary from "@/app/lib/cloudinary";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401);
    }

    if (session.user.role !== "ADMIN") {
        return errorResponse("Forbidden", 403);
    }

    try {
        const formData = await req.formData();

        const files = formData.getAll("file") as File[];

        if (!files) {
            return errorResponse("Please select at least one image", 400);
        }

        if (files.length > 10) {
            return errorResponse("Maximum 10 images allowed", 400);
        }

        const uploadedImages: string[] = [];

        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                return errorResponse("Only image files are allowed", 400);
            }

            if (file.size > 5 * 1024 * 1024) {
                return errorResponse("Each image must be smaller than 5MB", 400);
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const imageUrl = await new Promise<string>((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            folder: "products",
                            resource_type: "image",
                            quality: "auto",
                            fetch_format: "auto",
                        },
                        (error, result) => {
                            if (error || !result) {
                                reject(error);
                            } else {
                                resolve(result.secure_url);
                            }
                        }
                    )
                    .end(buffer);
            });

            uploadedImages.push(imageUrl);
        }

        return successResponse(
            "Images uploaded successfully",
            uploadedImages
        );
    } catch (error) {
        console.log("Upload API:", error);
        return errorResponse("Internal Server Error");
    }
}