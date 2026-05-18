import SiteHero from "@/components/site/site-hero";
import PromoBanner from "@/components/site/promo-banner";
import FeaturedListings from "@/components/site/featured-listings";
import BrowseHighlights from "@/components/site/browse-highlights";
import BoatCategories from "@/components/site/boat-categories";
import PricingCards from "@/components/site/pricing-cards";
import BenefitsSection from "@/components/site/benefits-section";
import CtaBanner from "@/components/site/cta-banner";

const SECTION_PADDING = {
	paddingTop: "4.5rem",
	paddingBottom: "2.5rem",
} as const;

export default function HomePage() {
	return (
		<main>
			<SiteHero />

			<section className="bl-container" style={SECTION_PADDING}>
				<PromoBanner />
			</section>

			<section className="bl-container" style={SECTION_PADDING}>
				<FeaturedListings />
			</section>

			<section className="bl-container" style={SECTION_PADDING}>
				<BrowseHighlights />
			</section>

			<section className="bl-container" style={SECTION_PADDING}>
				<BoatCategories />
			</section>

			<section className="bl-container" style={SECTION_PADDING}>
				<PricingCards />
			</section>

			<section className="bl-container" style={SECTION_PADDING}>
				<BenefitsSection />
			</section>

			<CtaBanner />
		</main>
	);
}
