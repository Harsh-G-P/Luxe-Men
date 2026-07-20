import Banner from "./About/Banner";
import Craftsmanship from "./About/Craftsmanship";
import CTA from "./About/CTA";
import Hero from "./About/Hero";
import Philosophy from "./About/Philosophy";
import Story from "./About/Story";
import Values from "./About/Values";

export default function AboutPage() {
    return (
        <div>
            <Hero />
            <Story />
            <Craftsmanship />
            <Philosophy />
            <Values />
            <Banner />
            <CTA />
        </div>
    );
}