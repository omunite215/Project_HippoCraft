import type { User } from "../server/payload-types";
import type { ExpressContext } from "../server/server";
import { TRPCError, initTRPC } from "@trpc/server";
import type { PayloadRequest } from "payload/types";

const t = initTRPC.context<ExpressContext>().create();
const middleware = t.middleware;

const isAuth = middleware(async ({ ctx, next }) => {
	const req = ctx.req as PayloadRequest;
	const { user } = req as { user: User | null };

	if (!user || !user.id) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({
		ctx: user,
	});
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProdcedure = t.procedure.use(isAuth);
