"use client";
import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
	AuthCredentialsValidator,
	type TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const isSeller = searchParams.get("as") === "seller";
	const origin = searchParams.get("origin");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TAuthCredentialsValidator>({
		resolver: zodResolver(AuthCredentialsValidator),
	});

	const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
		onSuccess: () => {
			toast.success("Signed In Successfully!!");
			router.refresh();
			if (origin) {
				router.push(`/${origin}`);
				return;
			}
			if (isSeller) {
				router.push("/sell");
				return;
			}

			router.push("/");
		},
		onError: (err) => {
			if (err.data?.code === "UNAUTHORIZED") {
				toast.error("Invalid email or password");
			}
		},
	});
	const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
		// Send Data to Server
		signIn({ email, password });
	};

	return (
		<>
			<div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col items-center space-y-2 text-center">
						<Icons.logo className="h-20 w-20" />
						<h1 className="text-2xl font-bold">Sign in to your {isSeller ? "seller" : ""}account</h1>
						<Link
							href="/sign-up"
							className={buttonVariants({
								variant: "linkHover2",
								className: "gap-1.5 group text-primary",
							})}
						>
							Don&apos;t have an account? Sign-up&nbsp;
							<ArrowRight className=" size-5 group-hover:translate-x-1 transition-all duration-300 delay-150" />
						</Link>
					</div>
					<div className="grid gap-6">
						<form action="" onSubmit={handleSubmit(onSubmit)}>
							<div className="grid gap-2">
								<div className="grid gap-1 py-2">
									<Label htmlFor="email">Email</Label>
									<Input
										{...register("email")}
										className={cn({
											"focus-visible:ring-red-500": errors.email,
										})}
										placeholder="you@example.com"
									/>
									{errors?.email && (
										<p className="text-sm text-destructive">
											{errors?.email.message}
										</p>
									)}
								</div>
								<div className="grid gap-1 py-2">
									<Label htmlFor="password">Password</Label>
									<Input
										type="password"
										{...register("password")}
										className={cn({
											"focus-visible:ring-red-500": errors.password,
										})}
										placeholder="password"
									/>
									{errors?.password && (
										<p className="text-sm text-destructive">
											{errors?.password.message}
										</p>
									)}
								</div>
								<Button variant="gooeyLeft">Sign in</Button>
							</div>
						</form>
						<div className="relative" aria-hidden="true">
							<div className=" absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									or
								</span>
							</div>
						</div>
						{isSeller ? (
							<Button
								variant="secondary"
								disabled={isLoading}
								onClick={() => router.replace("/sign-in", undefined)}
							>
								Continue as customer
							</Button>
						) : (
							<Button
								variant="secondary"
								disabled={isLoading}
								onClick={() => router.push("?as=seller")}
							>
								Continue as seller
							</Button>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Page;
