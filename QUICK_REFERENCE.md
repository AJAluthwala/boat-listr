# ⚡ QUICK REFERENCE CARD

## 🚀 Start Here

```bash
npm run dev
# → Server runs on http://localhost:3002
```

---

## 📍 Key URLs

| Purpose | URL |
|---------|-----|
| Create Listing | `http://localhost:3002/listings/create` |
| View Listings | `http://localhost:3002/listings` |
| Register | `http://localhost:3002/auth/register` |
| Listing Detail | `http://localhost:3002/listings/{id}` |

---

## 📋 Test Account

```
Email: test@example.com
Password: TestPassword123!
(Or register a new one)
```

---

## 🎯 Test Flow (3 steps)

1. **Fill form** → Boat details (title, category, location, price)
2. **Upload files** → Drag/drop images/videos, click "Upload Files"
3. **Publish** → Click "Publish Listing", see success message

---

## 📁 Key Files

| File | What It Does |
|------|--------------|
| `image-uploader.tsx` | Uploads files to S3 |
| `media-gallery.tsx` | Displays uploaded media |
| `create-listing-form.tsx` | Creates listing + manages upload |
| `listing-detail.tsx` | Shows listing with gallery |

---

## 🛠️ API Endpoints

```
POST /api/upload/image           (Get S3 presigned URL for images)
POST /api/upload/video           (Get S3 presigned URL for videos)
POST /api/listings               (Create listing)
POST /api/listings/{id}/media    (Associate media with listing)
GET  /api/listings/{id}          (Get listing with media)
GET  /api/listings/{id}/media    (Get media list)
DELETE /api/listings/{id}/media  (Delete media)
```

---

## 💾 Database

**Listing Table:**
- id, title, category, location, valueUSD, status, userId

**Media Table:**
- id, listingId, url, s3Key, bucket, mimeType, sizeBytes, kind, isPrimary, sortOrder

**Query to check:**
```sql
SELECT * FROM Media WHERE listingId = {id};
```

---

## ☁️ AWS Setup (Already Done)

- ✅ S3 bucket: `boatlistr-media`
- ✅ IAM user: `boatlistr-user`
- ✅ Access keys: Configured in `.env.local`
- ✅ Region: `us-east-1`

---

## 📊 File Limits

| Type | Max Size | Formats |
|------|----------|---------|
| Image | 15 MB | JPG, PNG, WebP, GIF, AVIF |
| Video | 250 MB | MP4, WebM, Quicktime, MKV |
| Per Listing | 10 files | Any combination |

---

## 🔐 Security

- ✅ Presigned URLs (5 min expiry)
- ✅ JWT token required
- ✅ User must own listing
- ✅ File validation (MIME, size)
- ✅ Filename sanitization
- ✅ S3 encryption enabled

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| "ECONNREFUSED" | Run `npm run dev` |
| "Unauthorized" | Register/login first, use token |
| "File too large" | Keep under limits (15MB images, 250MB videos) |
| No files appear | Check browser Network tab (F12) for errors |
| "S3 upload failed" | Check AWS credentials in `.env.local` |

---

## 🧪 Quick Database Check

```sql
-- See your listings
SELECT * FROM Listing ORDER BY createdAt DESC LIMIT 5;

-- See uploaded media
SELECT * FROM Media WHERE listingId = 42 ORDER BY sortOrder;

-- Count media by listing
SELECT listingId, COUNT(*) as media_count FROM Media GROUP BY listingId;
```

---

## 📖 Documentation

- **UPLOAD_SYSTEM_SUMMARY.md** → Quick overview
- **USER_FLOW_GUIDE.md** → Detailed visual flow
- **LISTING_UPLOAD_FLOW.md** → Complete technical docs
- **VERIFICATION_CHECKLIST.md** → Testing procedures
- **DELIVERY_SUMMARY.md** → What was delivered

---

## 🎯 Component Lifecycle

```
CreateListingForm
├─ User fills form + selects files
├─ ImageUploader uploads to S3 (presigned URLs)
├─ User clicks "Publish Listing"
├─ Listing created in database
├─ Media associated with listing
└─ Success message shown

Listing Detail Page
├─ Fetches listing with media
├─ MediaGallery displays files
├─ User clicks thumbnails to view
└─ Can play videos inline
```

---

## 🔄 Data Flow

```
Browser
  ↓ (form data)
Backend: POST /api/listings
  ↓ (create record, return ID)
Database: Insert Listing
  ↓ (listing ID = 42)
Browser: POST /api/listings/42/media (for each file)
  ↓ (media data with S3 URLs)
Database: Insert Media records
  ↓ (linked to listing 42)
S3: Files stored (already uploaded via presigned URLs)
  ↓
Frontend: MediaGallery displays from database records
```

---

## 📱 Responsive Design

- ✅ Desktop: Full featured
- ✅ Tablet: Adjusted grid, touch-friendly
- ✅ Mobile: Stacked layout, large touch targets

---

## 🎨 UI States

**Upload Zone:**
- Default: Gray dashed border
- Hovering: Blue border, light blue background
- Files selected: Show file list with previews

**File Items:**
- Pending: Gray background
- Uploading: Progress ring overlay
- Uploaded: Green checkmark
- Error: Red X, error message

**Gallery:**
- Empty: Placeholder message
- Loaded: Main image + thumbnails
- Videos: Play button overlay

---

## ⏱️ Performance

- Upload starts immediately (5MB bypasses backend buffer)
- No page reload needed
- Real-time progress tracking
- Parallel file uploads (up to 10)

---

## 💬 Support Quick Links

- Error in console? → Check Network tab (F12) for failed requests
- Database issues? → Run SQL queries to verify records
- S3 issues? → Check AWS credentials and CORS config
- Form issues? → Check browser console for validation errors

---

## 📊 Stats After First Listing

```
Database:
- Listing table: +1 record
- Media table: +N records (one per file)

S3 Bucket:
- Objects: +N files in media/listing-{id}/{date}/ path

Disk Space:
- Depends on file sizes (15MB + 250MB example = ~265MB)
```

---

## 🎓 Learning Path

1. **Read**: UPLOAD_SYSTEM_SUMMARY.md (5 min)
2. **Watch**: USER_FLOW_GUIDE.md diagrams (5 min)
3. **Test**: Create listing with media (5 min)
4. **Verify**: Check database and S3 (3 min)
5. **Deep Dive**: LISTING_UPLOAD_FLOW.md (15 min)

**Total: ~30 minutes to full understanding**

---

## 🎊 Quick Wins

✅ Component created
✅ API integrated
✅ S3 configured
✅ Database ready
✅ Tests documented
✅ Ready to deploy

**Next: `npm run dev` and test!**

---

## 📞 Quick Troubleshooting

```bash
# Check if server is running
curl http://localhost:3002

# Check database connection
# (App will fail if DB is down)

# Check AWS credentials
# (S3 upload will fail if keys are wrong)

# Clear build cache if needed
rm -rf .next
npm run dev
```

---

## 🚀 Ready to Go!

```
✅ Code: Complete
✅ Tests: Documented
✅ Docs: Comprehensive
✅ AWS: Configured
✅ DB: Connected

Status: READY TO USE

Start: npm run dev
Test: http://localhost:3002/listings/create
```

---

**Questions?** Check the 4 documentation files in root directory.
**Found a bug?** Check browser console (F12) and Network tab.
**Want to extend?** Code is well-commented and ready for modifications.

**Enjoy! 🎉**
