import Link from "next/link";
import { supportLinks } from "./footer-data";

export default function FooterSupport() {
    return (
        <div>

            <h3 className="mb-6 text-xs uppercase tracking-[0.35em] text-gray-400">
                Customer Care
            </h3>

            <ul className="space-y-4">
                {supportLinks.map((item) => (
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
    );
}