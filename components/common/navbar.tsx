import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/events/new", label: "Create Event" },
];

const Navbar = () => {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://media.licdn.com/dms/image/v2/C4E12AQE26nrIhOLRjA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1611650499612?e=1773273600&v=beta&t=xEC540GBI1WnCdlidBeRicr-e_9VHKJF6ypKQdhMTnU"
            alt="DevEvent"
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </Link>

        <div className="flex items-center gap-3">
          {navLinks.slice(0, 2).map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/events/new">
            <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 rounded-none text-sm">
              Create Event
            </Badge>
          </Link>
          <Button asChild variant="outline" size="sm" className="md:hidden">
            <Link href="/events">Menu</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
