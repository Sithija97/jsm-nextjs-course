// utils/cloudinaryUpload.ts
import { CLOUDINARY_CONFIG } from "@/config/cloudinary";

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

export const uploadToCloudinary = async (
  fileUri: string,
  fileType: "image" | "video" | "raw" = "image"
): Promise<string> => {
  try {
    const formData = new FormData();

    // Get file extension
    const uriParts = fileUri.split(".");
    const fileExtension = uriParts[uriParts.length - 1];

    // Create file object for FormData
    formData.append("file", {
      uri: fileUri,
      type: `${fileType}/${fileExtension}`,
      name: `upload_${Date.now()}.${fileExtension}`,
    } as any);

    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

    // Optional: Add folder organization
    formData.append("folder", "ai-app");

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${fileType}/upload`;

    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data: CloudinaryResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
