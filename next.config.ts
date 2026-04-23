import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	webpack: (config, { dev }) => {
		if (dev) {
			// Avoid filesystem cache rename/open race issues on some Windows setups.
			config.cache = {
				type: "memory",
			};
		}

		return config;
	},
};

export default nextConfig;
