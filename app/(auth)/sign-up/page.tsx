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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZodError } from "zod";

const Page = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TAuthCredentialsValidator>({
		resolver: zodResolver(AuthCredentialsValidator),
	});

	const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
		onError: (err) => {
			if (err.data?.code === "CONFLICT") {
				toast.error("This email is already in use. Sign in instead?");

				return;
			}

			if (err instanceof ZodError) {
				toast.error(err.issues[0].message);

				return;
			}

			toast.error("Something went wrong. Please try again.");
		},
		onSuccess: ({ sentToEmail }) => {
			toast.success(`Verification email sent to ${sentToEmail}.`);
			router.push(`/verify-email?to=${sentToEmail}`);
		},
	});
	const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
		// Send Data to Server
		mutate({ email, password });
	};

	return (
		<>
			<div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col items-center space-y-2 text-center">
						<Icons.logo className="h-20 w-20" />
						<h1 className="text-2xl font-bold">Create an Account</h1>
						<Link
							href="/sign-in"
							className={buttonVariants({
								variant: "linkHover2",
								className: "gap-1.5 group text-primary",
							})}
						>
							Already have an account? Sign-in&nbsp;
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
								<Button variant="gooeyLeft">Sign up</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Page;
