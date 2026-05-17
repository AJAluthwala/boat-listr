import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "@/components/auth/auth-context";
import { AuthModalProvider } from "@/components/auth/auth-modal-context";
import AuthModal from "@/components/auth/auth-modal";
import { FavoritesProvider } from "@/components/listings/favorites-context";

export const metadata: Metadata = {
	title: "Boat Listr",
	description: "Boat listings marketplace",
};

type RootLayoutProps = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body suppressHydrationWarning={true}>
				<AuthProvider>
					<FavoritesProvider>
						<AuthModalProvider>
							<Navbar />
							{children}
							<Footer />
							<AuthModal />
						</AuthModalProvider>
					</FavoritesProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
