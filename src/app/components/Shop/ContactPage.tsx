import { Suspense } from "react";
import ContactCards from "./Contact/ContactCards";
import ContactCTA from "./Contact/ContactCTA";
import ContactFAQ from "./Contact/ContactFAQ";
import ContactHero from "./Contact/ContactHero";

export default function ContactPage() {
    return (
        <div>
            <Suspense fallback={null}>
                <ContactHero />
            </Suspense>
            <ContactCards />
            <ContactFAQ />
            <ContactCTA />
        </div>
    );
}