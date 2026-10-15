import Link from "next/link";
import { companyLinks, shopLinks } from "./footer-data";

export default function FooterLinks() {
    return (
        <div className="grid grid-cols-2 gap-16">

            <div>
                <h3 className="mb-7 text-[10px] uppercase tracking-[0.45em] text-white/40">
                    Shop
                </h3>

                <ul className="space-y-4">
                    {shopLinks.map((item) => (
                        <li key={item.title}>
                            <Link
                                href={item.href}
                                className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                            >
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="mb-7 text-[10px] uppercase tracking-[0.45em] text-white/40">
                    Company
                </h3>

                <ul className="space-y-4">
                    {companyLinks.map((item) => (
                        <li key={item.title}>
                            <Link
                                href={item.href}
                                className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
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
