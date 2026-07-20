import FooterBottom from "./Shop/Footer/FooterBottom";
import FooterLinks from "./Shop/Footer/FooterLinks";
import FooterLogo from "./Shop/Footer/FooterLogo";
import FooterNewsletter from "./Shop/Footer/FooterNewsletter";
import FooterSupport from "./Shop/Footer/FooterSupport";
import FooterDiscover from "./Shop/Footer/FooterDiscover";


export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <FooterNewsletter />

      <div className="mx-auto max-w-7xl px-8 py-20 grid gap-16 lg:grid-cols-3">
        <div className="space-y-16">
          <FooterLinks />
          <FooterSupport />
        </div>

        <div />

        <FooterDiscover />
      </div>

      <FooterBottom />
      <FooterLogo />
    </footer>
  );
}