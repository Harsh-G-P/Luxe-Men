import { Suspense } from "react";
import ContactCards from "./Contact/ContactCards";
import ContactCTA from "./Contact/ContactCTA";
import ContactFAQ from "./Contact/ContactFAQ";
import ContactHero from "./Contact/ContactHero";
import Hero from "./Contact/Hero";

export default function ContactPage() {
    return (
        <div>
            <Hero />
            <Suspense fallback={null}>
                <ContactHero />
            </Suspense>
            <ContactCards />
            <ContactFAQ />
            <ContactCTA />
        </div>
    );
}