import { type ClassValue, clsx } from "clsx";
import type { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatPrice(
	price: number | string,
	options: {
		currency?: "USD" | "EUR" | "GBP" | "BDT";
		notation?: Intl.NumberFormatOptions["notation"];
	} = {},
) {
	const { currency = "USD", notation = "compact" } = options;

	const numericPrice =
		typeof price === "string" ? Number.parseFloat(price) : price;

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		notation,
		maximumFractionDigits: 2,
	}).format(numericPrice);
}

export function constructMetadata({
	title = "Hippocraft - the marketplace for digital assets",
	description = "Hippocraft is an open-source marketplace for high-quality digital goods.",
	image = "/thumbnail.png",
	icons = "/favicon.ico",
	noIndex = false,
}: {
	title?: string;
	description?: string;
	image?: string;
	icons?: string;
	noIndex?: boolean;
} = {}): Metadata {
	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: [
				{
					url: image,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [image],
			creator: "@omunite215",
		},
		icons,
		metadataBase: new URL("https://projecthippocraft.up.railway.app"),
		...(noIndex && {
			robots: {
				index: false,
				follow: false,
			},
		}),
	};
}
