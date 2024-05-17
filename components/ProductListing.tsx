"use client";
import type { Product } from "@/server/payload-types";
import React, { useState } from "react";
import { Skeleton } from "./ui/skeleton";

type ProductListingProps = {
	product: Product | null;
	index: number;
};

const ProductListing = ({ product, index }: ProductListingProps) => {
	const [isVisible, setIsVisible] = useState(false);
	if (!product || !isVisible) return <ProductPlaceholder />;

	return <div>ProductListing</div>;
};

const ProductPlaceholder = () => {
	return (
		<div className="flex flex-col w-full">
			<div className="">
				<Skeleton className="size-full" />
			</div>
			<Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
			<Skeleton className="mt-2 w-16 h-4 rounded-lg" />
			<Skeleton className="mt-2 w-12 h-4 rounded-lg" />
		</div>
	);
};

export default ProductListing;
