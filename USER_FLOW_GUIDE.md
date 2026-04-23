# Complete Listing Upload - User Flow Guide

## 🎯 Main Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  CREATE LISTING PAGE: /listings/create                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Boat Details Section                                      │  │
│  │ ┌────────────────────────────────────────────────────┐   │  │
│  │ │ Title:         [Beautiful 32ft Yacht           ]   │   │  │
│  │ │ Category:      [yacht              ]            │   │  │
│  │ │ Year:          [2015               ]            │   │  │
│  │ │ Length:        [32                 ] ft         │   │  │
│  │ │ Location:      [Miami, FL          ]            │   │  │
│  │ │ Value:         [$85000             ]            │   │  │
│  │ │ Engine:        [Diesel 40HP        ]            │   │  │
│  │ │ Power:         [40                 ] HP         │   │  │
│  │ │ Brand:         [Beneteau           ]            │   │  │
│  │ │ Capacity:      [6                  ]            │   │  │
│  │ │ Short Desc:    [Well-maintained... ]            │   │  │
│  │ │ Full Desc:     [A stunning 32-ft...             │   │  │
│  │ └────────────────────────────────────────────────────┘   │  │
│  │                                                             │  │
│  │ Media Gallery Section                                       │  │
│  │ ┌────────────────────────────────────────────────────┐   │  │
│  │ │ Upload images and videos to showcase your boat    │   │  │
│  │ │                                                    │   │  │
│  │ │ ┌──────────────────────────────────────────────┐ │   │  │
│  │ │ │ 📁 DRAG & DROP files here                    │ │   │  │
│  │ │ │    or [browse]                              │ │   │  │
│  │ │ │ JPG, PNG, WebP, GIF, AVIF, MP4, WebM       │ │   │  │
│  │ │ └──────────────────────────────────────────────┘ │   │  │
│  │ │                                                    │   │  │
│  │ │ File List (after selection):                      │   │  │
│  │ │ ┌────────────────────────────────────────────┐   │   │  │
│  │ │ │ [Preview] boat-photo-1.jpg      2.1 MB   │X  │   │  │
│  │ │ │ [Preview] boat-photo-2.jpg      1.8 MB   │X  │   │  │
│  │ │ │ [Preview] boat-video.mp4        45.2 MB  │X  │   │  │
│  │ │ │                                            │   │   │  │
│  │ │ │ 3 files selected | ✓ 0 uploaded          │   │   │  │
│  │ │ │ [Upload Files]                            │   │   │  │
│  │ │ └────────────────────────────────────────────┘   │   │  │
│  │ └────────────────────────────────────────────────────┘   │  │
│  │                                                             │  │
│  │ Media Count: 3 files ready to upload ✓                    │  │
│  │                                                             │  │
│  │ ┌────────────────────────────────────────────────────┐   │  │
│  │ │            [Publish Listing]                       │   │  │
│  │ └────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    [USER CLICKS "Upload Files"]
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  FILE UPLOAD PROGRESS                                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ [Preview] boat-photo-1.jpg                               │  │
│  │ ████████████░░░░░░░░░░░░░░░░░░ 45% ⏳ Uploading...     │  │
│  │                                                             │  │
│  │ [Preview] boat-photo-2.jpg                               │  │
│  │ ██████████████████████████████ 100% ✓ Uploaded         │  │
│  │                                                             │  │
│  │ [Preview] boat-video.mp4                                 │  │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%  Pending...         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
            [ALL FILES UPLOADED - CHECKMARKS APPEAR]
                            ↓
                [USER CLICKS "Publish Listing"]
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  SUCCESS NOTIFICATION                                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ✓                                                         │  │
│  │ Success!                                                  │  │
│  │ Listing #42 published successfully with 3 media file(s) │  │
│  │ You can now optimize media and respond to leads.        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
            [USER VIEWS LISTING DETAIL PAGE]
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  LISTING DETAIL PAGE: /listings/42                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                             │  │
│  │    Main Image:                                             │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │                                                        │ │  │
│  │  │         [Beautiful Yacht Image - 4:3 ratio]          │ │  │
│  │  │                                                        │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                                                             │  │
│  │    Thumbnails:                                             │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐                         │  │
│  │  │ [Img1] │ │ [Img2] │ │ [▶ V1] │ ← Primary (★)          │  │
│  │  │   ★    │ │        │ │ Video  │                         │  │
│  │  └────────┘ └────────┘ └────────┘                         │  │
│  │                                                             │  │
│  │  Listing Details:                                          │  │
│  │  Yacht | Beautiful 32ft Yacht | Miami, FL                 │  │
│  │  $85,000                                                    │  │
│  │                                                             │  │
│  │  2015 | 32 ft | Diesel 40HP | Capacity: 6                │  │
│  │                                                             │  │
│  │  [Message Seller] [Save Listing]                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Technical Flow

### Step 1: Select Files
```
User Input
    ↓
Browser: FileList collected
    ↓
Component: Build preview (URL.createObjectURL)
    ↓
UI: Show thumbnails with filenames
```

### Step 2: Upload Files to S3
```
User clicks "Upload Files"
    ↓
For each file:
    ├─ Request 1: POST /api/upload/image
    │   └─ Backend: Generate presigned URL
    │       Backend: Return { uploadUrl, key, publicUrl }
    │
    ├─ Request 2: PUT {presignedUrl} with file data
    │   └─ Browser: Upload directly to S3 (no backend)
    │       No backend involved - direct browser→S3 connection
    │
    └─ UI: Show progress bar, then checkmark
```

### Step 3: Create Listing
```
User clicks "Publish Listing"
    ↓
Request 1: POST /api/listings
    ├─ Backend: Validate form data
    ├─ Backend: Create Listing record in DB
    └─ Response: { listing: { id: 42, ... } }
    ↓
For each uploaded file:
    Request 2: POST /api/listings/42/media
    ├─ Backend: Verify user owns listing
    ├─ Backend: Create Media record in DB
    └─ Response: { media: { id: 1, ... } }
    ↓
UI: Show success message with listing ID
```

---

## 💾 Database After Flow

### Listing Record Created:
```sql
INSERT INTO Listing (
  id=42,
  userId=5,
  title='Beautiful 32ft Yacht',
  category='yacht',
  location='Miami, FL',
  valueUSD=85000,
  status='PENDING',
  createdAt=NOW()
)
```

### Media Records Created (one per file):
```sql
INSERT INTO Media (
  id=1,
  listingId=42,
  url='https://boatlistr-media.s3.amazonaws.com/media/listing-42/2026/04/23/...-boat-photo-1.jpg',
  s3Key='media/listing-42/2026/04/23/uuid1-boat-photo-1.jpg',
  bucket='boatlistr-media',
  kind='IMAGE',
  mimeType='image/jpeg',
  sizeBytes=2097152,
  isPrimary=true,
  sortOrder=0,
  createdAt=NOW()
)

INSERT INTO Media (
  id=2,
  listingId=42,
  url='https://boatlistr-media.s3.amazonaws.com/media/listing-42/2026/04/23/...-boat-photo-2.jpg',
  s3Key='media/listing-42/2026/04/23/uuid2-boat-photo-2.jpg',
  bucket='boatlistr-media',
  kind='IMAGE',
  mimeType='image/jpeg',
  sizeBytes=1887436,
  isPrimary=false,
  sortOrder=1,
  createdAt=NOW()
)

INSERT INTO Media (
  id=3,
  listingId=42,
  url='https://boatlistr-media.s3.amazonaws.com/media/listing-42/2026/04/23/...-boat-video.mp4',
  s3Key='media/listing-42/2026/04/23/uuid3-boat-video.mp4',
  bucket='boatlistr-media',
  kind='VIDEO',
  mimeType='video/mp4',
  sizeBytes=47453132,
  isPrimary=false,
  sortOrder=2,
  createdAt=NOW()
)
```

### S3 Bucket Contents:
```
boatlistr-media/
├── media/
│   └── listing-42/
│       └── 2026/
│           └── 04/
│               └── 23/
│                   ├── f47ac10b-58cc-...-boat-photo-1.jpg (2.1 MB)
│                   ├── a1b2c3d4-e5f6-...-boat-photo-2.jpg (1.8 MB)
│                   └── x7y8z9w0-q1r2-...-boat-video.mp4 (45.2 MB)
```

---

## 🛣️ Component Render Flow

### CreateListingForm Component:
```
CreateListingForm
├─ State: form { title, category, year, ... }
├─ State: uploadedFiles [ { id, file, preview, ... } ]
├─ State: message "Listing #42 published..."
│
├─ Render:
│   ├─ Form Section
│   │   ├─ Title Input
│   │   ├─ Category Input
│   │   ├─ ... (8 more inputs)
│   │   └─ Textarea for descriptions
│   │
│   ├─ Media Section
│   │   └─ ImageUploader Component
│   │       ├─ Drag zone
│   │       ├─ File list with previews
│   │       ├─ Progress bars
│   │       └─ Upload button
│   │
│   ├─ Media Summary
│   │   └─ "3 media files ready"
│   │
│   ├─ Submit Button
│   │   └─ "Publish Listing"
│   │
│   └─ Success/Error Messages
```

### ImageUploader Component:
```
ImageUploader
├─ State: files [ { id, file, progress, status } ]
├─ State: isDragging
│
├─ Render:
│   ├─ Drag & Drop Zone
│   │   ├─ Highlight on drag over
│   │   ├─ File input (hidden)
│   │   └─ Browse button
│   │
│   └─ File List (if files selected)
│       ├─ File header with count
│       ├─ Grid of file items:
│       │   ├─ Preview thumbnail
│       │   ├─ Progress ring overlay
│       │   ├─ Success/error badge
│       │   ├─ Filename & size
│       │   └─ Delete button
│       │
│       └─ Upload button
```

### MediaGallery Component:
```
MediaGallery
├─ Props: media [ { id, url, kind, isPrimary } ]
├─ Props: listingId
│ State: selectedIndex
│
├─ Render:
│   ├─ Main Display
│   │   ├─ <img> for IMAGE
│   │   ├─ <video> for VIDEO
│   │   └─ Remove button (if editable)
│   │
│   └─ Thumbnail Strip (if multiple media)
│       ├─ Thumbnail 1 (★ primary)
│       ├─ Thumbnail 2
│       ├─ Thumbnail 3 (▶ video badge)
│       └─ ... (more thumbnails)
```

---

## 📋 State Management

### CreateListingForm State:
```javascript
{
  loading: boolean,                    // While publishing
  message: string,                     // Success message
  error: string,                       // Error message
  uploadedFiles: UploadedFile[],       // Files ready to associate
  listingId: number | null,            // Created listing ID
  form: {
    title: string,
    category: string,
    // ... (10 more fields)
  }
}
```

### ImageUploader State:
```javascript
{
  files: UploadedFile[],  // Selected/uploading files
  isDragging: boolean,    // Drag over active
  isUploading: boolean    // Upload in progress
}

UploadedFile = {
  id: string,             // Unique ID
  file: File,             // Original file object
  preview: string,        // ObjectURL for thumbnail
  uploadUrl?: string,     // Presigned S3 URL
  s3Key?: string,         // S3 object key
  publicUrl?: string,     // Public HTTPS URL
  progress: number,       // 0-100
  status: "pending" | "uploading" | "uploaded" | "error",
  error?: string          // Error message if failed
}
```

### MediaGallery State:
```javascript
{
  isDeleting: number | null,  // mediaId being deleted
  selectedIndex: number       // Currently selected media
}
```

---

## 🔀 Event Flow

### On File Select (Drag or Browse):
```
User drops file / selects file
    ↓
input onChange / drop event
    ↓
addFiles(fileList)
    ↓
for each file:
  - Create ObjectURL for preview
  - Add to files array with status="pending"
    ↓
UI updates: show thumbnails and "Upload Files" button
```

### On "Upload Files" Click:
```
Click event
    ↓
uploadFiles() function
    ↓
for each file with status="pending":
  Set status="uploading", progress=10%
    ↓
  GET presigned URL from backend
    ↓
  Upload file directly to S3
    ↓
  Set status="uploaded", progress=100%
    ↓
UI updates: show checkmark and success color
    ↓
Call onFilesReady() callback
```

### On "Publish Listing" Click:
```
Form submission
    ↓
onSubmit() function
    ↓
POST /api/listings (create listing)
    ↓
Get listing ID from response
    ↓
for each file with status="uploaded":
  POST /api/listings/{id}/media
    ↓
Set message with listing ID and media count
    ↓
Reset form and file list
```

---

## 🎨 UI States

### Upload Zone States:

**Idle:**
```
┌─────────────────────────────┐
│ 📁 Drag & drop files here   │
│    or [browse]              │
│                             │
│ JPG, PNG, WebP, GIF, ...   │
└─────────────────────────────┘
```

**Dragging:**
```
┌─────────────────────────────┐  ← Border becomes blue
│ 📁 Drag & drop files here   │  ← Background becomes light blue
│    or [browse]              │
│                             │
│ JPG, PNG, WebP, GIF, ...   │
└─────────────────────────────┘
```

### File Item States:

**Pending:**
```
┌─────────────────────┐
│ [preview image]  ×  │
│ boat-photo.jpg      │
│ 2.1 MB              │
└─────────────────────┘
```

**Uploading:**
```
┌─────────────────────┐
│ [preview image]     │  ← Overlay appears
│     45% ⏳           │  ← Progress ring
│ boat-photo.jpg      │
│ 2.1 MB              │
└─────────────────────┘
```

**Uploaded:**
```
┌─────────────────────┐
│ [preview image]     │  ← Green overlay
│      ✓              │  ← Checkmark
│ boat-photo.jpg      │
│ 2.1 MB              │
└─────────────────────┘
```

**Error:**
```
┌─────────────────────┐
│ [preview image]     │  ← Red overlay
│      ✕              │  ← X icon
│ boat-photo.jpg      │
│ 2.1 MB              │
│ ⚠️ Upload failed    │  ← Error message
│ [↻ Retry] [× Remove]│
└─────────────────────┘
```

---

## ⚙️ API Request/Response Examples

### Request: Get Presigned URL
```http
POST /api/upload/image HTTP/1.1
Content-Type: application/json

{
  "fileName": "boat-photo.jpg",
  "contentType": "image/jpeg",
  "fileSizeBytes": 2097152,
  "listingId": 42
}
```

### Response: Presigned URL
```json
{
  "key": "media/listing-42/2026/04/23/f47ac10b-...-boat-photo.jpg",
  "uploadUrl": "https://boatlistr-media.s3.amazonaws.com/media/listing-42/2026/04/23/f47ac10b-...-boat-photo.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
  "publicUrl": "https://boatlistr-media.s3.amazonaws.com/media/listing-42/2026/04/23/f47ac10b-...-boat-photo.jpg",
  "expiresInSeconds": 300
}
```

### Request: Upload to S3 (using presigned URL)
```http
PUT https://boatlistr-media.s3.amazonaws.com/media/listing-42/.../boat-photo.jpg?X-Amz-Algorithm=... HTTP/1.1
Content-Type: image/jpeg
Content-Length: 2097152

[binary JPEG data]
```

### Response: Upload Success
```http
HTTP/1.1 200 OK
ETag: "abc123def456"
```

---

## 📊 Browser Network Timeline

```
0ms     User clicks "Upload Files"
        ├─ POST /api/upload/image
        │  ├─ Request: ~200 bytes
        │  └─ Response: ~500 bytes (presigned URL)
        │     [████████████] 50ms complete
        │
100ms   │  PUT https://s3.amazonaws.com/.../boat-photo.jpg
        │  ├─ Request: 2MB file data
        │  └─ Response: Empty (just ETag)
        │     [████████████████████] 3000ms complete (varies by speed)
        │
3100ms  ├─ POST /api/upload/video
        │  ├─ Request: ~200 bytes
        │  └─ Response: ~500 bytes
        │     [████████████] 60ms complete
        │
3160ms  └─ PUT https://s3.amazonaws.com/.../boat-video.mp4
           ├─ Request: 45MB file data
           └─ Response: Empty
              [████████████████████████████████] 45000ms complete
        
48160ms User clicks "Publish Listing"
        ├─ POST /api/listings
        │  ├─ Request: Form data (~500 bytes)
        │  └─ Response: Listing record (~1KB)
        │     [████████████] 100ms complete
        │
48260ms ├─ POST /api/listings/42/media (boat-photo.jpg)
        │  ├─ Request: Media data (~300 bytes)
        │  └─ Response: Media record (~500 bytes)
        │     [████████████] 50ms complete
        │
48310ms ├─ POST /api/listings/42/media (boat-video.mp4)
        │  ├─ Request: Media data (~300 bytes)
        │  └─ Response: Media record (~500 bytes)
        │     [████████████] 50ms complete
        │
48360ms └─ Success! ✓
```

---

## 🎯 Key Takeaways

1. **Two-Phase Upload**: Files first → Listing second
2. **Direct S3 Upload**: Browser → S3, not through backend
3. **Metadata Separation**: Presigned URL from backend, actual file to S3
4. **Progress Tracking**: Real-time feedback per file
5. **Database Integration**: Media linked to listing via foreign key
6. **Secure URLs**: 5-minute expiration prevents abuse
7. **Error Resilience**: Can retry failed uploads
8. **User Experience**: Professional gallery with drag-drop and thumbnails

This architecture ensures:
- ✅ Security (credentials never exposed)
- ✅ Scalability (S3 handles storage)
- ✅ Performance (parallel uploads)
- ✅ Reliability (error handling & retries)
- ✅ UX (progress tracking & feedback)
