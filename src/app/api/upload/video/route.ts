import { buildS3ObjectKey, isValidVideoMimeType } from "@/lib/upload";
import { createPresignedUploadUrl, getPublicS3Url } from "@/lib/s3";

type RequestBody = {
  fileName?: string;
  contentType?: string;
  fileSizeBytes?: number;
  listingId?: number;
};

const MAX_VIDEO_BYTES = 250 * 1024 * 1024;

export async function POST(request: Request) {
  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const fileName = body.fileName?.trim();
  const contentType = body.contentType?.trim().toLowerCase();
  const fileSizeBytes = body.fileSizeBytes;

  if (!fileName || !contentType || !fileSizeBytes) {
    return Response.json(
      {
        error: "fileName, contentType, and fileSizeBytes are required",
      },
      { status: 400 },
    );
  }

  if (!isValidVideoMimeType(contentType)) {
    return Response.json(
      { error: "Unsupported video type. Use mp4, quicktime, webm, or mkv." },
      { status: 400 },
    );
  }

  if (fileSizeBytes <= 0 || fileSizeBytes > MAX_VIDEO_BYTES) {
    return Response.json(
      { error: `Video must be between 1 byte and ${MAX_VIDEO_BYTES} bytes.` },
      { status: 400 },
    );
  }

  const key = buildS3ObjectKey({
    listingId: body.listingId,
    fileName,
    mediaType: "video",
  });

  try {
    const uploadUrl = await createPresignedUploadUrl({
      key,
      contentType,
    });

    return Response.json({
      key,
      uploadUrl,
      publicUrl: getPublicS3Url(key),
      expiresInSeconds: 300,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create presigned upload URL";
    return Response.json({ error: message }, { status: 500 });
  }
}