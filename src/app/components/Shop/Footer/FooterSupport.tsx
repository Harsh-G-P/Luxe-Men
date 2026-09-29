import Link from "next/link";
import { supportLinks } from "./footer-data";

export default function FooterSupport() {
    return (
        <div>

            <h3 className="mb-7 text-[10px] uppercase tracking-[0.45em] text-white/40">
                Customer Care
            </h3>

            <ul className="space-y-4">
                {supportLinks.map((item) => (
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
    );
}
