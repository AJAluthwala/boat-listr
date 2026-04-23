"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/button";

type UploadedFile = {
  id: string;
  file: File;
  preview: string;
  uploadUrl?: string;
  s3Key?: string;
  publicUrl?: string;
  progress: number;
  status: "pending" | "uploading" | "uploaded" | "error";
  error?: string;
};

type ImageUploaderProps = {
  listingId?: number;
  onFilesReady?: (files: UploadedFile[]) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
  maxFiles?: number;
};

export default function ImageUploader({ listingId, onFilesReady, onUploadStateChange, maxFiles = 10 }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const addFiles = async (newFiles: FileList | null) => {
    if (!newFiles || files.length >= maxFiles) return;

    const fileArray = Array.from(newFiles).slice(0, maxFiles - files.length);
    const uploadedFiles = fileArray.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "pending" as const,
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const uploadFiles = async () => {
    setIsUploading(true);
    onUploadStateChange?.(true);
    let currentFiles = files.map((file) => ({ ...file }));
    const pendingFiles = currentFiles.filter((f) => f.status === "pending");

    const commitFiles = (nextFiles: UploadedFile[]) => {
      currentFiles = nextFiles;
      setFiles(nextFiles);
    };

    for (const fileItem of pendingFiles) {
      try {
        commitFiles(
          currentFiles.map((file) =>
            file.id === fileItem.id ? { ...file, status: "uploading" as const, progress: 10 } : file,
          ),
        );

        // Step 1: Get presigned URL from backend
        const uploadEndpoint = fileItem.file.type.startsWith("video") ? "/api/upload/video" : "/api/upload/image";
        const presignResponse = await fetch(uploadEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: fileItem.file.name,
            contentType: fileItem.file.type,
            fileSizeBytes: fileItem.file.size,
            listingId,
          }),
        });

        if (!presignResponse.ok) {
          const error = await presignResponse.json();
          throw new Error(error.error || "Failed to get upload URL");
        }

        const { uploadUrl, key, s3Key, publicUrl } = await presignResponse.json() as {
          uploadUrl: string;
          key?: string;
          s3Key?: string;
          publicUrl: string;
        };
        const resolvedS3Key = s3Key ?? key;

        commitFiles(
          currentFiles.map((file) =>
            file.id === fileItem.id
              ? { ...file, uploadUrl, s3Key: resolvedS3Key, publicUrl, progress: 30 }
              : file,
          ),
        );

        // Step 2: Upload file directly to S3
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": fileItem.file.type },
          body: fileItem.file,
        });

        if (!uploadRes.ok) {
          throw new Error(`S3 upload failed: ${uploadRes.statusText}`);
        }

        commitFiles(
          currentFiles.map((file) =>
            file.id === fileItem.id ? { ...file, status: "uploaded", progress: 100 } : file,
          ),
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed";
        commitFiles(
          currentFiles.map((file) =>
            file.id === fileItem.id
              ? { ...file, status: "error", error: errorMessage, progress: 0 }
              : file,
          ),
        );
      }
    }

    setIsUploading(false);
    onUploadStateChange?.(false);
    if (onFilesReady) onFilesReady(currentFiles.filter((file) => file.status === "uploaded"));
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const retryFile = (id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: "pending" as const, progress: 0, error: undefined }
          : f,
      ),
    );
  };

  return (
    <div className="bl-media-uploader">
      <div
        className={`bl-upload-zone ${isDragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p>
          <strong>Drag and drop</strong> images/videos here or{" "}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bl-link"
          >
            browse
          </button>
        </p>
        <span className="bl-upload-hint">
          Images (JPG, PNG, WebP) up to 15MB | Videos (MP4, WebM) up to 250MB
        </span>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => addFiles(e.target.files)}
          style={{ display: "none" }}
        />
      </div>

      {files.length > 0 && (
        <div className="bl-file-list">
          <div className="bl-file-header">
            <p>{files.length} file(s) selected</p>
            <div className="bl-file-stats">
              <span className="bl-badge">
                {files.filter((f) => f.status === "uploaded").length} uploaded
              </span>
              {files.some((f) => f.status === "error") && (
                <span className="bl-badge bl-badge-error">
                  {files.filter((f) => f.status === "error").length} failed
                </span>
              )}
            </div>
          </div>

          <div className="bl-file-grid">
            {files.map((fileItem) => (
              <div key={fileItem.id} className="bl-file-item">
                <div className="bl-file-preview">
                  <img src={fileItem.preview} alt={fileItem.file.name} />
                  {fileItem.status === "uploading" && (
                    <div className="bl-upload-overlay">
                      <div className="bl-progress-ring">
                        <svg viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="4"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="white"
                            strokeWidth="4"
                            strokeDasharray={`${2.51 * fileItem.progress} ${251}`}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <span>{fileItem.progress}%</span>
                      </div>
                    </div>
                  )}
                  {fileItem.status === "uploaded" && (
                    <div className="bl-upload-overlay bl-success">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                  {fileItem.status === "error" && (
                    <div className="bl-upload-overlay bl-error">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="bl-file-info">
                  <p className="bl-file-name" title={fileItem.file.name}>
                    {fileItem.file.name}
                  </p>
                  <p className="bl-file-size">
                    {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {fileItem.error && <p className="bl-file-error">{fileItem.error}</p>}
                </div>
                <div className="bl-file-actions">
                  {fileItem.status === "error" ? (
                    <button
                      type="button"
                      onClick={() => retryFile(fileItem.id)}
                      className="bl-icon-button bl-retry"
                      title="Retry"
                    >
                      ↻
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeFile(fileItem.id)}
                    className="bl-icon-button bl-delete"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {files.some((f) => f.status === "pending") && (
            <Button
              onClick={uploadFiles}
              disabled={isUploading}
              className="bl-upload-button"
            >
              {isUploading ? "Uploading..." : "Upload Files"}
            </Button>
          )}
        </div>
      )}

      <style jsx>{`
        .bl-media-uploader {
          width: 100%;
        }

        .bl-upload-zone {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #fafafa;
        }

        .bl-upload-zone:hover,
        .bl-upload-zone.dragging {
          border-color: #0066cc;
          background: #f0f7ff;
        }

        .bl-upload-zone svg {
          margin-bottom: 0.5rem;
          color: #666;
        }

        .bl-upload-zone p {
          margin: 0.5rem 0;
          font-size: 0.95rem;
        }

        .bl-upload-hint {
          display: block;
          font-size: 0.85rem;
          color: #888;
          margin-top: 0.5rem;
        }

        .bl-link {
          background: none;
          border: none;
          color: #0066cc;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          font: inherit;
        }

        .bl-link:hover {
          color: #0052a3;
        }

        .bl-file-list {
          margin-top: 1.5rem;
        }

        .bl-file-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #eee;
        }

        .bl-file-header p {
          margin: 0;
          font-weight: 500;
        }

        .bl-file-stats {
          display: flex;
          gap: 0.5rem;
        }

        .bl-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #e8f5e9;
          color: #2e7d32;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .bl-badge-error {
          background: #ffebee;
          color: #c62828;
        }

        .bl-file-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .bl-file-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .bl-file-preview {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background: #f5f5f5;
        }

        .bl-file-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .bl-upload-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
        }

        .bl-upload-overlay.bl-success {
          background: rgba(46, 125, 50, 0.8);
          color: white;
        }

        .bl-upload-overlay.bl-error {
          background: rgba(198, 40, 40, 0.8);
          color: white;
        }

        .bl-progress-ring {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .bl-progress-ring svg {
          width: 60px;
          height: 60px;
          margin-bottom: 0.25rem;
        }

        .bl-progress-ring span {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .bl-file-info {
          min-width: 0;
        }

        .bl-file-name {
          margin: 0;
          font-size: 0.85rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bl-file-size {
          margin: 0;
          font-size: 0.75rem;
          color: #888;
        }

        .bl-file-error {
          margin: 0;
          font-size: 0.75rem;
          color: #d32f2f;
        }

        .bl-file-actions {
          display: flex;
          gap: 0.25rem;
        }

        .bl-icon-button {
          background: none;
          border: 1px solid #ddd;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.2s ease;
        }

        .bl-icon-button:hover {
          border-color: #999;
          background: #f5f5f5;
        }

        .bl-icon-button.bl-delete:hover {
          border-color: #d32f2f;
          color: #d32f2f;
          background: #ffebee;
        }

        .bl-icon-button.bl-retry:hover {
          border-color: #ff9800;
          color: #ff9800;
          background: #fff3e0;
        }

        .bl-upload-button {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
