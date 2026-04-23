import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
	return (
		<main className="bl-container bl-section" style={{ paddingTop: "1.2rem" }}>
			<div className="bl-market-feed">
				<div className="bl-market-toolbar">
					<div>
						<h1>Saved boats</h1>
						<p className="bl-market-muted">Review boats you bookmarked and jump back into chats.</p>
					</div>
					<Button asChild><Link href="/listings">Browse more</Link></Button>
				</div>

				<div className="bl-listing-grid">
					<article className="bl-market-card">
						<div className="bl-market-image" />
						<div className="bl-market-card-body">
							<div className="bl-market-price">$189,000</div>
							<h3>Sea Ray 350 Sundancer</h3>
							<p>Orlando · 2021</p>
						</div>
					</article>
					<article className="bl-market-card">
						<div className="bl-market-image" />
						<div className="bl-market-card-body">
							<div className="bl-market-price">$92,500</div>
							<h3>Boston Whaler 270</h3>
							<p>Tampa · 2018</p>
						</div>
					</article>
				</div>
			</div>
		</main>
	);
}
