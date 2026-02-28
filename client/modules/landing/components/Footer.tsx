import { IconMapPin } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/Logo.svg";

export const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-border mt-12 pt-8 pb-6">
      <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo & Address */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <Image src={Logo} alt="Joblify" width={28} height={28} />
              <h2 className="text-primary text-2xl font-bold">Joblify</h2>
            </div>
            <div className="flex items-start gap-2 max-w-sm">
              <IconMapPin size={18} className="text-primary mt-0.5 shrink-0" />
              <p className="text-muted-foreground text-sm leading-relaxed">
                123 Business Street, Suite 100, City, State 12345
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:gap-6 flex-wrap">
            {[
              { name: "Browse Jobs", href: "/find-jobs" },
              { name: "Find Talent", href: "/find-talent" },
              { name: "Post a Job", href: "/post-job" },
              { name: "About Us", href: "/about" },
              { name: "Create Profile", href: "/profile" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-6" />

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Joblify. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/about"
              className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
