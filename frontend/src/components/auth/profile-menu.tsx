"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";
import { useState } from "react";
import UserAvatar from "../common/user-avatar";
const LogoutModal = dynamic(() => import("../auth/logout-modal"));

export default function ProfileMenu({ name, image }: { name: string; image?: string }) {
  const [LogOutOpen, setLogOutOpen] = useState(false);
  return (
    <>
      {LogOutOpen && <LogoutModal open={LogOutOpen} setOpen={setLogOutOpen} />}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar name={name} image={image} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLogOutOpen(true)}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
