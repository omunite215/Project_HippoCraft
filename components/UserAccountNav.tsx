"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import type { User } from "@/server/payload-types";
import { Button } from "./ui/button";

const UserAccountNav = ({ user }: { user: User }) => {
	const { signOut } = useAuth();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="overflow-visible">
				<Button variant="ghost" size="sm" className="relative">
					My account
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className=" bg-background w-60" align="end">
				<div className="flex items-center justify-start gap-2 p-2">
					<div className="flex flex-col space-y-0.5 leading-none">
						<p className="font-medium text-sm text-foreground">{user.email}</p>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/sell">Seller Dashboard</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer text-destructive"
					onClick={signOut}
				>
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAccountNav;
