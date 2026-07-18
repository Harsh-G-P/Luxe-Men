import ContactCards from "./Contact/ContactCards";
import ContactCTA from "./Contact/ContactCTA";
import ContactFAQ from "./Contact/ContactFAQ";
import ContactHero from "./Contact/ContactHero";

export default function ContactPage() {
    return (
        <div>
            <ContactHero />
            <ContactCards />
            <ContactFAQ />
            <ContactCTA />
        </div>
    );
}