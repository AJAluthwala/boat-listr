"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import ImageUploader from "./image-uploader";

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

export default function CreateListingForm() {
  const [loading, setLoading] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [listingId, setListingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    manufacturedYear: "2020",
    lengthFt: "35",
    shortDescription: "",
    mainDescription: "",
    location: "",
    valueUSD: "",
    engine: "",
    totalPowerHP: "",
    brand: "",
    capacity: "",
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (mediaUploading) {
      setError("Wait for all media uploads to finish before publishing the listing.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("boatlistr-token") ?? "";

      // Step 1: Create the listing
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          ...form,
          manufacturedYear: Number(form.manufacturedYear),
          lengthFt: Number(form.lengthFt),
          valueUSD: Number(form.valueUSD),
          totalPowerHP: form.totalPowerHP ? Number(form.totalPowerHP) : undefined,
          capacity: form.capacity ? Number(form.capacity) : undefined,
        }),
      });

      const data = (await response.json()) as { error?: string; listing?: { id: number } };
      if (!response.ok) throw new Error(data.error ?? "Failed to create listing");

      const newListingId = data.listing?.id;
      if (!newListingId) throw new Error("No listing ID returned");

      setListingId(newListingId);

      // Step 2: Associate media with the listing
      if (uploadedFiles.length > 0) {
        for (let index = 0; index < uploadedFiles.length; index++) {
          const fileItem = uploadedFiles[index];
          if (fileItem.status === "uploaded" && fileItem.s3Key && fileItem.publicUrl) {
            const mediaResponse = await fetch(`/api/listings/${newListingId}/media`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
              body: JSON.stringify({
                url: fileItem.publicUrl,
                type: fileItem.file.type,
                kind: fileItem.file.type.startsWith("video") ? "VIDEO" : "IMAGE",
                s3Key: fileItem.s3Key,
                bucket: "boatlistr-media",
                mimeType: fileItem.file.type,
                sizeBytes: fileItem.file.size,
                isPrimary: index === 0, // First file is primary
                sortOrder: index,
              }),
            });

            if (!mediaResponse.ok) {
              const mediaData = (await mediaResponse.json()) as { error?: string };
              throw new Error(mediaData.error ?? `Failed to save media for ${fileItem.file.name}`);
            }
          }
        }
      }

      setMessage(
        `✓ Listing #${newListingId} published successfully with ${uploadedFiles.filter((f) => f.status === "uploaded").length} media file(s). You can now optimize media and respond to leads.`
      );

      // Reset form
      setForm({
        title: "",
        category: "",
        manufacturedYear: "2020",
        lengthFt: "35",
        shortDescription: "",
        mainDescription: "",
        location: "",
        valueUSD: "",
        engine: "",
        totalPowerHP: "",
        brand: "",
        capacity: "",
      });
      setUploadedFiles([]);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="bl-form-head">
        <span className="bl-eyebrow">New listing</span>
        <h2>Publish a boat with confidence</h2>
        <p>Use clear pricing, complete details, strong photos and videos to create a listing that converts.</p>
      </div>
      <form className="bl-form-column" onSubmit={onSubmit}>
        <div className="bl-form-section">
          <h3>Boat Details</h3>
          <div className="bl-form-grid-two">
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input required placeholder="Year" value={form.manufacturedYear} onChange={(e) => setForm({ ...form, manufacturedYear: e.target.value })} />
            <input required placeholder="Length (ft)" value={form.lengthFt} onChange={(e) => setForm({ ...form, lengthFt: e.target.value })} />
            <input required placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <input required placeholder="Value USD" value={form.valueUSD} onChange={(e) => setForm({ ...form, valueUSD: e.target.value })} />
            <input placeholder="Engine" value={form.engine} onChange={(e) => setForm({ ...form, engine: e.target.value })} />
            <input placeholder="Power HP" value={form.totalPowerHP} onChange={(e) => setForm({ ...form, totalPowerHP: e.target.value })} />
            <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <input placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            <textarea required placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} style={{ gridColumn: "1 / -1" }} />
            <textarea placeholder="Full description" value={form.mainDescription} onChange={(e) => setForm({ ...form, mainDescription: e.target.value })} style={{ gridColumn: "1 / -1" }} />
          </div>
        </div>

        <div className="bl-form-section">
          <h3>Media Gallery</h3>
          <p className="bl-section-hint">Upload images and videos to showcase your boat. Drag & drop or click to browse.</p>
          <ImageUploader
            onFilesReady={(files) => setUploadedFiles(files)}
            onUploadStateChange={setMediaUploading}
            maxFiles={10}
          />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="bl-media-summary">
            <p>
              <strong>{uploadedFiles.filter((f) => f.status === "uploaded").length}</strong> media file(s) ready to upload
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || mediaUploading}
          className="bl-form-submit"
        >
          {loading || mediaUploading ? "Publishing..." : "Publish Listing"}
        </Button>
      </form>

      {message && (
        <div className="bl-form-success-box">
          <div className="bl-success-icon">✓</div>
          <div>
            <strong>Success!</strong>
            <p>{message}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bl-form-error-box">
          <div className="bl-error-icon">✕</div>
          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .bl-form-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .bl-form-section {
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .bl-form-section:last-of-type {
          border-bottom: none;
        }

        .bl-form-section h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }

        .bl-section-hint {
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
          color: #888;
        }

        .bl-media-summary {
          padding: 1rem;
          background: #e8f5e9;
          border-left: 4px solid #4caf50;
          border-radius: 4px;
          margin: 0;
        }

        .bl-media-summary p {
          margin: 0;
          font-size: 0.95rem;
          color: #2e7d32;
        }

        .bl-form-submit {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1rem;
        }

        .bl-form-success-box {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          background: #e8f5e9;
          border-left: 4px solid #4caf50;
          border-radius: 4px;
          margin-top: 1rem;
        }

        .bl-success-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          background: #4caf50;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .bl-form-success-box strong {
          color: #2e7d32;
          display: block;
          margin-bottom: 0.25rem;
        }

        .bl-form-success-box p {
          margin: 0;
          color: #1b5e20;
          font-size: 0.95rem;
        }

        .bl-form-error-box {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          background: #ffebee;
          border-left: 4px solid #f44336;
          border-radius: 4px;
          margin-top: 1rem;
        }

        .bl-error-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          background: #f44336;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .bl-form-error-box strong {
          color: #d32f2f;
          display: block;
          margin-bottom: 0.25rem;
        }

        .bl-form-error-box p {
          margin: 0;
          color: #b71c1c;
          font-size: 0.95rem;
        }
      `}</style>
    </Card>
  );
}
