"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

const AddToCartButton = () => {
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
    
    	useEffect(() => {
		const timeout = setTimeout(() => setIsSuccess(false), 2000);
		return () => clearTimeout(timeout);
	}, [isSuccess]);

	return (
		<Button onClick={() => setIsSuccess(true)} size="lg" className=" w-full">
			{isSuccess ? "Added to Cart!!" : "Add to Cart"}
		</Button>
	);
};

export default AddToCartButton;
