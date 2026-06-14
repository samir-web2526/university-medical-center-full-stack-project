const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";

export interface UploadResult {
  url: string;
  displayUrl: string;
  deleteUrl: string;
}

export interface UploadError {
  message: string;
}

/**
 * Convert a File to base64 string (without data:image/... prefix)
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/...;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image file to imgbb and return the hosted URL.
 *
 * @param file - The image file to upload (max 32MB for imgbb free tier)
 * @param optionalName - Optional name for the image
 * @returns The hosted image URL
 * @throws If no API key is configured or upload fails
 */
export async function uploadImage(
  file: File,
  optionalName?: string
): Promise<UploadResult> {
  if (!IMGBB_API_KEY || IMGBB_API_KEY === "YOUR_API_KEY_HERE") {
    throw new Error(
      "Image upload is not configured. Please set NEXT_PUBLIC_IMGBB_API_KEY in .env"
    );
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  // Validate file size (32MB max for imgbb)
  if (file.size > 32 * 1024 * 1024) {
    throw new Error("Image must be smaller than 32MB");
  }

  const base64 = await fileToBase64(file);

  const formData = new FormData();
  formData.append("key", IMGBB_API_KEY);
  formData.append("image", base64);
  if (optionalName) {
    formData.append("name", optionalName);
  }

  const res = await fetch(IMGBB_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json?.error?.message || "Failed to upload image");
  }

  return {
    url: json.data.url,
    displayUrl: json.data.display_url,
    deleteUrl: json.data.delete_url,
  };
}

/**
 * Validate that a file is a supported image type
 */
export function isValidImageType(file: File): boolean {
  const supported = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/tiff",
  ];
  return supported.includes(file.type);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
