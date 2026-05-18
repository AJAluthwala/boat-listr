import { json, parseId, readJson } from "@/lib/api";
import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
	name?: string;
	email?: string;
	phone?: string;
	message?: string;
	// Honeypot — bots fill this in, real users don't see it
	website?: string;
};

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function renderInquiryEmail({
	boatTitle,
	listingId,
	buyerName,
	buyerEmail,
	buyerPhone,
	buyerMessage,
	sellerName,
	siteUrl,
}: {
	boatTitle: string;
	listingId: number;
	buyerName: string;
	buyerEmail: string;
	buyerPhone: string;
	buyerMessage: string;
	sellerName: string;
	siteUrl: string;
}): { text: string; html: string } {
	const text =
		`New inquiry about your boat listing on BoatListr\n\n` +
		`Listing: ${boatTitle}\n` +
		`From:    ${buyerName} <${buyerEmail}>\n` +
		(buyerPhone ? `Phone:   ${buyerPhone}\n` : "") +
		`\nMessage:\n${buyerMessage}\n\n` +
		`Reply directly to this email to respond.\n` +
		`View listing: ${siteUrl}/listings/${listingId}\n`;

	const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f8f8;font-family:Arial,Helvetica,sans-serif;color:#0a3d62;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border:1px solid #e1eef5;border-radius:18px;overflow:hidden;">
    <div style="background-color:#0a3d62;background-image:linear-gradient(135deg,#051d35 0%,#0a3d62 40%,#1883ff 100%);padding:24px 28px;color:#ffffff;">
      <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;opacity:0.85;margin-bottom:6px;">
        BoatListr · New Inquiry
      </div>
      <div style="font-size:20px;font-weight:800;letter-spacing:-0.01em;">
        Hi ${escapeHtml(sellerName)}, you have a new buyer inquiry
      </div>
    </div>
    <div style="padding:24px 28px;">
      <div style="background:#f6fafd;border:1px solid #e1eef5;border-radius:12px;padding:18px;margin-bottom:18px;">
        <div style="font-size:11px;font-weight:700;color:#1883ff;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">
          Listing
        </div>
        <div style="font-size:16px;font-weight:700;color:#0a3d62;">${escapeHtml(boatTitle)}</div>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
        <tr>
          <td style="padding:6px 0;color:#8ea3bb;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;width:120px;vertical-align:top;">From</td>
          <td style="padding:6px 0;color:#0a3d62;font-size:14px;font-weight:600;">${escapeHtml(buyerName)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#8ea3bb;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;vertical-align:top;">Email</td>
          <td style="padding:6px 0;color:#0a3d62;font-size:14px;"><a href="mailto:${escapeHtml(buyerEmail)}" style="color:#1883ff;text-decoration:none;font-weight:600;">${escapeHtml(buyerEmail)}</a></td>
        </tr>
        ${
			buyerPhone
				? `<tr>
          <td style="padding:6px 0;color:#8ea3bb;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;vertical-align:top;">Phone</td>
          <td style="padding:6px 0;color:#0a3d62;font-size:14px;font-weight:600;">${escapeHtml(buyerPhone)}</td>
        </tr>`
				: ""
		}
      </table>

      <div style="font-size:11px;font-weight:700;color:#1883ff;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">
        Message
      </div>
      <div style="background:#ffffff;border:1px solid #e1eef5;border-radius:12px;padding:16px;color:#3d4f63;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(buyerMessage)}</div>

      <div style="margin-top:24px;padding-top:18px;border-top:1px solid #eef4f8;font-size:13px;color:#55657a;">
        <p style="margin:0 0 10px;">Reply directly to this email — your response will go to ${escapeHtml(buyerName)}.</p>
        <a href="${siteUrl}/listings/${listingId}" style="display:inline-block;padding:10px 20px;background:linear-gradient(135deg,#1883ff 0%,#0a6ed9 100%);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700;font-size:13px;">View listing</a>
      </div>
    </div>
    <div style="background:#f6fafd;padding:14px 28px;font-size:11px;color:#8ea3bb;text-align:center;">
      This message was sent through BoatListr's secure contact form. The sender's email is shown above so you can reply directly.
    </div>
  </div>
</body>
</html>`;

	return { text, html };
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
	const { id: rawId } = await context.params;
	const listingId = parseId(rawId);
	if (!listingId) return json({ error: "Invalid listing id" }, 400);

	let body: Body;
	try {
		body = await readJson<Body>(request);
	} catch {
		return json({ error: "Invalid request" }, 400);
	}

	// Honeypot — silently accept and discard
	if (body.website && body.website.trim() !== "") {
		return json({ ok: true });
	}

	const name = (body.name ?? "").trim();
	const email = (body.email ?? "").trim().toLowerCase();
	const phone = (body.phone ?? "").trim();
	const message = (body.message ?? "").trim();

	if (!name || name.length < 2) {
		return json({ error: "Please enter your name" }, 400);
	}
	if (!EMAIL_RE.test(email)) {
		return json({ error: "Please enter a valid email address" }, 400);
	}
	if (!message || message.length < 10) {
		return json({ error: "Please write a message of at least 10 characters" }, 400);
	}
	if (message.length > 5000) {
		return json({ error: "Message is too long" }, 400);
	}

	const listing = await prisma.listing.findUnique({
		where: { id: listingId },
		select: {
			id: true,
			title: true,
			user: { select: { id: true, name: true, email: true } },
		},
	});

	if (!listing || !listing.user) {
		return json({ error: "Listing not found" }, 404);
	}

	const sellerEmail = listing.user.email;
	const sellerName = listing.user.name ?? "Seller";

	const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	const { text, html } = renderInquiryEmail({
		boatTitle: listing.title,
		listingId: listing.id,
		buyerName: name,
		buyerEmail: email,
		buyerPhone: phone,
		buyerMessage: message,
		sellerName,
		siteUrl,
	});

	try {
		const subject = `New Inquiry About: ${listing.title}`;
		// Reply-To = buyer's email so seller can hit "Reply" and go straight to them
		await sendMail(sellerEmail, subject, text, { html, replyTo: email });
	} catch (err) {
		const messageStr = err instanceof Error ? err.message : "Failed to send";
		return json({ error: `Could not send message: ${messageStr}` }, 500);
	}

	return json({ ok: true, message: "Your message was sent to the seller." });
}
