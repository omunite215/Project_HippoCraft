"use client";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/server/payload-types";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const AddToCartButton = ({ product }: { product: Product }) => {
	const { addItem } = useCart();
	const [isSuccess, setIsSuccess] = useState<boolean>(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const timeout = setTimeout(() => setIsSuccess(false), 2000);
		return () => clearTimeout(timeout);
	}, [isSuccess]);

	return (
		<Button
			onClick={() => {
				addItem(product);
				setIsSuccess(true);
			}}
			size="lg"
			className=" w-full"
		>
			{isSuccess ? "Added to Cart!!" : "Add to Cart"}
		</Button>
	);
};

export default AddToCartButton;
