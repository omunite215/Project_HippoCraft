"use client";
import type { TQueryValidator } from "@/lib/validators/query-validator";
import type { Product } from "@/server/payload-types";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import React from "react";
import ProductListing from "./ProductListing";

interface ProductReelProps {
	title: string;
	subTitle?: string;
	href?: string;
	query: TQueryValidator;
}

const FALLBACK_LIMIT = 4;

const ProductReel = (props: ProductReelProps) => {
	const { title, subTitle, href, query } = props;
	const { data: queryResults, isLoading } =
		trpc.getInfiniteProducts.useInfiniteQuery(
			{
				limit: query.limit ?? FALLBACK_LIMIT,
				query,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextPage,
			},
		);

	const products = queryResults?.pages.flatMap((page) => page.items);

	let map: (Product | null)[] = [];
	if (products?.length) {
		map = products;
	} else if (isLoading) {
		map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
	}

	return (
		<section className=" py-12">
			<div className="md:flex md:items-center md:justify-between mb-4">
				<div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
					{title ? (
						<h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
							{title}
						</h1>
					) : null}
					{subTitle ? (
						<p className="mt-2 text-sm text-muted-foreground">{subTitle}</p>
					) : null}
				</div>

				{href ? (
					<Link
						href={href}
						className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
					>
						Shop the collection&nbsp;<span aria-hidden="true">&rarr;</span>
					</Link>
				) : null}
			</div>

			<div className="relative">
				<div className="mt-6 flex items-center w-full">
					<div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
						{map.map((product, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<ProductListing key={i} product={product} index={i} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default ProductReel;
