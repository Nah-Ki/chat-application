import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Notfound() {
  return (
    <div className="h-screen flex justify-center item-center flex-col">
      <Image src="/images/404.svg" width={500} height={500} alt="404"></Image>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
