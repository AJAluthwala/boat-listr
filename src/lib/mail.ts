import nodemailer, { type Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
	if (cachedTransporter) return cachedTransporter;

	const host = process.env.SMTP_HOST;
	const port = Number(process.env.SMTP_PORT ?? 587);
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;

	if (!host || !user || !pass) {
		return null;
	}

	cachedTransporter = nodemailer.createTransport({
		host,
		port,
		secure: port === 465,
		auth: { user, pass },
	});

	return cachedTransporter;
}

export async function sendMail(
	to: string,
	subject: string,
	body: string,
	options: { html?: string } = {},
) {
	const transporter = getTransporter();
	const from = process.env.MAIL_FROM || process.env.SMTP_USER || "no-reply@boatlistr.local";

	if (!transporter) {
		// Dev fallback when SMTP isn't configured — log so devs can grab the value.
		console.log("[mail:dev]", { to, subject, body });
		return { accepted: [to], dev: true };
	}

	const info = await transporter.sendMail({
		from,
		to,
		subject,
		text: body,
		html: options.html,
	});

	return { accepted: info.accepted, messageId: info.messageId };
}

export function renderOtpEmail(otp: string, ttlMinutes: number): { text: string; html: string } {
	const text =
		`Your BoatListr password reset code is: ${otp}\n\n` +
		`This code expires in ${ttlMinutes} minutes. If you didn't request a password reset, you can safely ignore this email.`;

	const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f8f8;font-family:Arial,Helvetica,sans-serif;color:#0a3d62;">
  <div style="max-width:520px;margin:32px auto;background:#ffffff;border:1px solid #e1eef5;border-radius:18px;padding:32px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:22px;font-weight:800;color:#0a3d62;letter-spacing:-0.02em;">
        Boat<span style="color:#1883ff;">L</span>istr
      </div>
    </div>
    <h1 style="margin:0 0 12px;font-size:20px;color:#0a3d62;">Password reset code</h1>
    <p style="margin:0 0 20px;color:#55657a;font-size:14px;line-height:1.55;">
      Use the code below to reset your BoatListr account password. It expires in ${ttlMinutes} minutes.
    </p>
    <div style="background:#f6fafd;border:1px solid #e1eef5;border-radius:14px;padding:20px;text-align:center;margin-bottom:24px;">
      <div style="font-size:34px;font-weight:800;letter-spacing:0.4em;color:#1883ff;font-family:'Courier New',monospace;">
        ${otp}
      </div>
    </div>
    <p style="margin:0;color:#8ea3bb;font-size:12px;line-height:1.5;">
      If you didn't request this, you can safely ignore this email — your password won't change.
    </p>
  </div>
</body>
</html>`;

	return { text, html };
}
