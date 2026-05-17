import Link from "next/link";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import SiteHero from "@/components/site/site-hero";
import FeaturedListings from "@/components/site/featured-listings";
import PricingCards from "@/components/site/pricing-cards";

export default function HomePage() {
	return (
		<main>
			<SiteHero />

			<section
				className="bl-container"
				style={{ paddingTop: "3rem", paddingBottom: "1rem" }}
			>
				<FeaturedListings />
			</section>

			<section
				className="bl-container"
				style={{ paddingTop: "2.5rem", paddingBottom: "3rem" }}
			>
				<PricingCards />
			</section>

			<section className="bl-section">
				<div className="bl-container bl-section-grid">
					<Card>
						<Badge tone="info">Browse and buy</Badge>
						<h3>Explore listings in a feed-first experience</h3>
						<p>Open details, compare prices, and contact sellers from one continuous marketplace flow.</p>
						<Button asChild><Link href="/listings">Go to marketplace</Link></Button>
					</Card>
					<Card>
						<Badge tone="success">Sell faster</Badge>
						<h3>Create listings with pricing and media that converts</h3>
						<p>Publish in minutes, then monitor messages and favorites from your seller dashboard.</p>
						<Button variant="secondary" asChild><Link href="/listings/create">Create listing</Link></Button>
					</Card>
					<Card>
						<Badge tone="warning">Inbox flow</Badge>
						<h3>Move from listing to conversation in one click</h3>
						<p>Buyers can send messages instantly, and sellers can manage chat threads like a marketplace inbox.</p>
						<Button variant="ghost" asChild><Link href="/messages">Open messages</Link></Button>
					</Card>
				</div>
			</section>
		</main>
	);
}
