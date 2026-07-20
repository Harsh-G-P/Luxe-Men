import Link from "next/link";
import { companyLinks, shopLinks } from "./footer-data";

export default function FooterLinks() {
    return (
        <div className="grid grid-cols-2 gap-16">

            <div>
                <h3 className="mb-6 text-xs uppercase tracking-[0.35em] text-gray-400">
                    Shop
                </h3>

                <ul className="space-y-4">
                    {shopLinks.map((item) => (
                        <li key={item.title}>
                            <Link
                                href={item.href}
                                className="transition-colors duration-300 hover:text-white text-white/70"
                            >
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="mb-6 text-xs uppercase tracking-[0.35em] text-gray-400">
                    Company
                </h3>

                <ul className="space-y-4">
                    {companyLinks.map((item) => (
                        <li key={item.title}>
                            <Link
                                href={item.href}
                                className="transition-colors duration-300 hover:text-white text-white/70"
                            >
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}