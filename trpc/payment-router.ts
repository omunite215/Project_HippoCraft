import { z } from "zod";
import { privateProdcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "@/server/get-payload";
import { stripe } from "../lib/stripe";
import type Stripe from "stripe";

export const paymentRouter = router({
	createSession: privateProdcedure
		.input(
			z.object({
				productIds: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { user } = ctx;
			const { productIds } = input;

			if (productIds.length === 0) {
				throw new TRPCError({ code: "BAD_REQUEST" });
			}

			const payload = await getPayloadClient();

			const { docs: products } = await payload.find({
				collection: "products",
				where: {
					id: {
						in: productIds,
					},
				},
			});

			const filteredProducts = products.filter((prod) => Boolean(prod.priceId));

			const order = await payload.create({
				collection: "orders",
				data: {
					_isPaid: false,
					products: productIds,
					user: user.id,
				},
			});
			const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

			for (const product of filteredProducts) {
				line_items.push({
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					price: product.priceId!,
					quantity: 1,
				});
			}
			try {
				const stripeSession = await stripe.checkout.sessions.create({
					success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId`,
					cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
					payment_method_types: ["card", "paypal"],
					mode: "payment",
					metadata: {
						userId: user.id,
						orderID: order.id,
					},
					line_items,
				});

				return { url: stripeSession.url };
			} catch (err) {
				console.log(err);
				return { url: null };
			}
		}),
});
