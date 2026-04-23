# Complete Listing Upload Flow - Setup Guide

## What Was Created

### 1. **ImageUploader Component** (`src/components/listings/image-uploader.tsx`)
A full-featured file uploader with:
- ✅ Drag & drop support
- ✅ Multiple file selection
- ✅ File validation (MIME type, size)
- ✅ Progress tracking (individual file upload progress)
- ✅ Presigned URL generation from backend
- ✅ Direct S3 upload (browser → S3, not through your backend)
- ✅ Retry failed uploads
- ✅ File preview thumbnails
- ✅ Support for images (up to 15MB) and videos (up to 250MB)

**Key Features:**
- Generates unique S3 keys automatically
- Shows upload percentage for each file
- Displays success/error status
- Allows removal of files before upload
- Supports up to 10 files per listing

### 2. **MediaGallery Component** (`src/components/listings/media-gallery.tsx`)
A gallery viewer for displaying uploaded media:
- ✅ Main media player (image or video)
- ✅ Thumbnail strip for quick navigation
- ✅ Primary media badge (★)
- ✅ Video indicator badge
- ✅ Optional remove button (in edit mode)
- ✅ Responsive grid layout

### 3. **Updated CreateListingForm** (`src/components/listings/create-listing-form.tsx`)
The form now integrates the complete flow:
- ✅ Boat details section (title, category, year, length, etc.)
- ✅ Media gallery section with ImageUploader
- ✅ Shows number of files ready to upload
- ✅ Two-step process:
  1. Create listing in database
  2. Associate uploaded media with listing
- ✅ Success/error notifications
- ✅ Form reset after successful publish

---

## How It Works - Complete Flow

### User Journey:
1. User fills in boat details (title, category, location, price, etc.)
2. User drags/drops or selects images and videos
3. User clicks "Upload Files" (in ImageUploader)
   - Component calls `/api/upload/image` or `/api/upload/video` for each file
   - Backend generates presigned URL valid for 5 minutes
   - Browser uploads file directly to S3 (bypassing your backend)
4. User clicks "Publish Listing"
   - Listing is created in database
   - Uploaded files are associated with the listing via `/api/listings/{id}/media`
   - Success message shows listing ID and media count

### Technical Flow:

```
Browser ──┐
          ├─→ POST /api/upload/image ──→ Backend ──→ AWS S3 (generates presigned URL)
          │                                             ↓
          └─→ PUT {presignedUrl} ──────────→ S3 (direct upload, no backend)
          
          └─→ POST /api/listings ──→ Backend ──→ Create listing in DB
          
          └─→ POST /api/listings/{id}/media ──→ Backend ──→ Save media reference in DB
```

### Database Integration:
- **Media Table**: Stores references to uploaded files
  - `url`: Public S3 URL (https://boatlistr-media.s3.amazonaws.com/...)
  - `s3Key`: S3 object key for later deletion
  - `kind`: "IMAGE" or "VIDEO"
  - `mimeType`: File MIME type
  - `sizeBytes`: File size in bytes
  - `isPrimary`: First upload = primary media
  - `sortOrder`: Display order in gallery

---

## Testing the Complete Flow

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Register/Login
**Endpoint:** `POST /api/auth/register`
```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123!",
  "name": "Test User"
}
```

Save the `accessToken` from response.

### Step 3: Go to Create Listing Page
Navigate to: `http://localhost:3002/listings/create`

### Step 4: Fill Form & Upload Media

**Form Data:**
```
Title: Beautiful 32ft Yacht
Category: yacht
Year: 2015
Length: 32 ft
Location: Miami, FL
Value: $85,000
Engine: Diesel 40HP
Brand: Beneteau
Power: 40 HP
Capacity: 6
Short Description: Well-maintained sailboat with modern equipment
Description: A stunning 32-foot sailboat perfect for cruising...
```

**Upload Media:**
1. Drag & drop or click "Browse" to select images/videos
2. You'll see thumbnails of selected files
3. Click "Upload Files" button
4. Watch progress bar as files upload to S3
5. See checkmark when each file completes

### Step 5: Publish Listing
Click "Publish Listing" button
- Listing is created
- Media files are associated
- Success message appears with listing ID

### Step 6: Verify in Database
```sql
-- Check listing was created
SELECT * FROM Listing WHERE title = 'Beautiful 32ft Yacht';

-- Check media was associated
SELECT * FROM Media WHERE listingId = {listing_id};
```

You should see:
- 1 listing record
- N media records with S3 keys and public URLs

---

## Postman Testing (API Level)

### 1. Register User
```
POST http://localhost:3002/api/auth/register
Content-Type: application/json

{
  "email": "postman@example.com",
  "password": "TestPassword123!",
  "name": "Postman User"
}
```

Save `accessToken` from response.

### 2. Create Listing
```
POST http://localhost:3002/api/listings
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Test Yacht",
  "category": "yacht",
  "manufacturedYear": 2015,
  "lengthFt": 32,
  "shortDescription": "A nice yacht",
  "location": "Miami, FL",
  "valueUSD": 85000
}
```

Save `listing.id` from response.

### 3. Get Presigned URL for Image
```
POST http://localhost:3002/api/upload/image
Content-Type: application/json

{
  "fileName": "boat-photo.jpg",
  "contentType": "image/jpeg",
  "fileSizeBytes": 2097152,
  "listingId": {listing_id}
}
```

Response will include:
- `uploadUrl`: Presigned S3 URL
- `key`: S3 object key
- `publicUrl`: Public HTTPS URL
- `expiresInSeconds`: 300

### 4. Upload File to S3 (using presigned URL)
```
PUT {uploadUrl}
Content-Type: image/jpeg

{binary file data}
```

### 5. Create Media Record
```
POST http://localhost:3002/api/listings/{listing_id}/media
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "url": "{publicUrl}",
  "type": "image/jpeg",
  "kind": "IMAGE",
  "s3Key": "{s3Key}",
  "bucket": "boatlistr-media",
  "mimeType": "image/jpeg",
  "sizeBytes": 2097152,
  "isPrimary": true,
  "sortOrder": 0
}
```

### 6. Get Listing with Media
```
GET http://localhost:3002/api/listings?search=Test
Authorization: Bearer {accessToken}
```

Response includes `media` array with all uploaded files.

---

## Key Files Updated

1. **[src/components/listings/image-uploader.tsx]** - NEW
   - 400+ lines of upload logic
   - Handles presigned URLs, S3 upload, progress tracking

2. **[src/components/listings/media-gallery.tsx]** - NEW
   - Gallery viewer with thumbnails
   - Video/image support

3. **[src/components/listings/create-listing-form.tsx]** - UPDATED
   - Integrated ImageUploader
   - Two-step listing + media creation
   - Better UX with sections

---

## Environment Variables (Already Set)
- `AWS_REGION=us-east-1`
- `AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET=boatlistr-media`

---

## Next Steps

1. ✅ Dev server running
2. ✅ All components created
3. ✅ S3 integration configured
4. 🔲 **Test the flow** (follow Testing section above)
5. 🔲 Create media editing page (drag to reorder, set primary, delete)
6. 🔲 Add media gallery to listing detail pages
7. 🔲 Implement video thumbnail generation

---

## Common Issues & Solutions

**Issue: "ECONNREFUSED 127.0.0.1:3002"**
- Solution: Start dev server with `npm run dev`

**Issue: "Invalid JWT token"**
- Solution: Register/login first to get token, use Bearer token format

**Issue: "S3 upload fails after getting presigned URL"**
- Solution: Check that CORS is configured on S3 bucket (should already be done)

**Issue: "Media not appearing in gallery"**
- Solution: Check Media table in database, verify s3Key and url are populated

---

## Architecture Benefits

✅ **Security**: AWS credentials never sent to browser
✅ **Performance**: Direct browser → S3 upload, 5MB+ files bypass backend
✅ **Scalability**: S3 handles storage, your backend only manages metadata
✅ **Reliability**: Automatic retry on upload failure
✅ **UX**: Real-time progress tracking, drag & drop support
✅ **Validation**: MIME type and size checked before upload
✅ **Uniqueness**: UUID + date + listing prefix prevents collisions

---

## Support

For issues with:
- **Image uploader**: Check browser console (F12) for errors
- **S3 credentials**: Verify .env.local has AWS_ variables
- **Media association**: Check /api/listings/{id}/media endpoint
- **Progress tracking**: Look at upload component state in React DevTools
