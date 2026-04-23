export async function sendMail(to: string, subject: string, body: string) {
	if (process.env.NODE_ENV !== "production") {
		console.log("[mail]", { to, subject, body });
	}

	return { accepted: [to] };
}
