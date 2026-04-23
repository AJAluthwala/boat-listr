"use client";

import { useState } from "react";
import Button from "@/components/ui/button";

export type MediaItem = {
  id: number;
  listingId: number;
  url: string;
  type: string;
  kind: "IMAGE" | "VIDEO";
  s3Key: string;
  bucket: string;
  mimeType: string;
  sizeBytes: number;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
};

type MediaGalleryProps = {
  media: MediaItem[];
  listingId: number;
  editable?: boolean;
  onRemove?: (mediaId: number) => Promise<void>;
};

export default function MediaGallery({
  media,
  listingId,
  editable = false,
  onRemove,
}: MediaGalleryProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!media || media.length === 0) {
    return (
      <div className="bl-media-gallery-empty">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <p>No media uploaded yet</p>
      </div>
    );
  }

  const primaryMedia = media.find((m) => m.isPrimary) || media[0];
  const mediaIndex = media.findIndex((m) => m.id === primaryMedia.id);
  const selected = media[selectedIndex] || primaryMedia;

  const handleRemove = async (mediaId: number) => {
    if (!onRemove) return;
    setIsDeleting(mediaId);
    try {
      await onRemove(mediaId);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="bl-media-gallery">
      <div className="bl-gallery-main">
        {selected.kind === "VIDEO" ? (
          <video
            src={selected.url}
            controls
            className="bl-gallery-video"
          />
        ) : (
          <img src={selected.url} alt="Boat" className="bl-gallery-image" />
        )}
        {editable && (
          <Button
            onClick={() => handleRemove(selected.id)}
            disabled={isDeleting === selected.id}
            className="bl-gallery-remove"
            variant="secondary"
          >
            {isDeleting === selected.id ? "Removing..." : "Remove"}
          </Button>
        )}
      </div>

      {media.length > 1 && (
        <div className="bl-gallery-thumbnails">
          {media.map((item, index) => (
            <div
              key={item.id}
              className={`bl-thumbnail ${
                selectedIndex === index ? "active" : ""
              }`}
              onClick={() => setSelectedIndex(index)}
              role="button"
              tabIndex={0}
            >
              {item.kind === "VIDEO" ? (
                <>
                  <video src={item.url} className="bl-thumbnail-video" />
                  <div className="bl-video-badge">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </>
              ) : (
                <img src={item.url} alt={`Thumbnail ${index + 1}`} />
              )}
              {item.isPrimary && <div className="bl-primary-badge">★</div>}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .bl-media-gallery {
          width: 100%;
        }

        .bl-gallery-main {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          background: #f5f5f5;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .bl-gallery-image,
        .bl-gallery-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .bl-gallery-remove {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }

        .bl-gallery-thumbnails {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 0.75rem;
        }

        .bl-thumbnail {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border: 2px solid #ddd;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bl-thumbnail:hover {
          border-color: #0066cc;
        }

        .bl-thumbnail.active {
          border-color: #0066cc;
          background: #e3f2fd;
        }

        .bl-thumbnail-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .bl-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .bl-video-badge {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          color: white;
        }

        .bl-primary-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0, 102, 204, 0.8);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
        }

        .bl-media-gallery-empty {
          padding: 3rem;
          text-align: center;
          background: #fafafa;
          border-radius: 8px;
          border: 1px dashed #ddd;
        }

        .bl-media-gallery-empty svg {
          margin-bottom: 1rem;
          color: #ccc;
        }

        .bl-media-gallery-empty p {
          margin: 0;
          color: #999;
        }
      `}</style>
    </div>
  );
}
