require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        status: true,
        title: true,
        _count: { select: { media: true } }
      }
    });

    console.log('=== 10 MOST RECENT LISTINGS ===');
    console.table(listings.map(l => ({
      id: l.id,
      status: l.status,
      title: l.title,
      mediaCount: l._count.media
    })));

    const mediaRows = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        listingId: true,
        s3Key: true,
        url: true,
        kind: true,
        mimeType: true,
        isPrimary: true
      }
    });

    console.log('=== 10 MOST RECENT MEDIA ROWS ===');
    console.table(mediaRows);

    const candidates = ['http://localhost:3000/api/listings', 'http://localhost:3002/api/listings'];
    let apiResult = null;

    for (const url of candidates) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        apiResult = { url, data };
        break;
      } catch (err) {
        console.log(`API check failed for ${url}: ${err.message}`);
      }
    }

    if (!apiResult) {
      console.log('=== API SAMPLE ===');
      console.log('No running server detected on localhost:3000 or localhost:3002.');
      return;
    }

    const data = apiResult.data;
    const listingsArray =
      Array.isArray(data) ? data :
      Array.isArray(data?.listings) ? data.listings :
      Array.isArray(data?.data) ? data.data :
      Array.isArray(data?.items) ? data.items :
      [];

    const sample = listingsArray[0] ?? data;

    let mediaUrlsPresent = false;
    if (sample && typeof sample === 'object') {
      const media = sample.media || sample.images || sample.photos || sample.assets;
      if (Array.isArray(media)) {
        mediaUrlsPresent = media.some(m => typeof m === 'string' ? /^https?:\/\//.test(m) : typeof m?.url === 'string' && m.url.length > 0);
      }
    }

    console.log('=== API SAMPLE ===');
    console.log(`Source: ${apiResult.url}`);
    console.log(`Media URLs present in sample response: ${mediaUrlsPresent}`);
    console.log('Sample excerpt:');
    console.dir(sample, { depth: 3, maxArrayLength: 5 });
  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    await prisma.$disconnect();
  }
})();
