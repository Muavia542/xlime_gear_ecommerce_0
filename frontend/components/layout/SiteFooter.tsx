import Link from "next/link";
import BrandLogo from "./BrandLogo";

import {
  Mail,
  MessageCircle,
} from "lucide-react";

import InstagramIcon from "@/components/icons/InstagramIcon";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <div className="logo logo-image">
            <BrandLogo
              className="brand-logo"
              width={165}
              height={104}
              alt="XLIME GEAR"
            />
          </div>

          <p
            style={{
              fontSize: 12,
              color: "#aeb2ab",
              maxWidth: 300,
            }}
          >
            Sports, Gym & Active, Leather, Fashion and custom teamwear —
            built around the XLIME GEAR identity.
          </p>

          <div className="socials">
            <a
              href="https://www.instagram.com/xlimegear"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="XLIME GEAR Instagram"
            >
              <InstagramIcon size={15} />
            </a>

            <a
              href="https://wa.me/447510926711"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="XLIME GEAR WhatsApp"
            >
              <MessageCircle size={15} />
            </a>

            <a
              href="mailto:info@xlimegear.com"
              aria-label="Email XLIME GEAR"
            >
              <Mail size={15} />
            </a>
          </div>
        </div>

        <div>
          <h4>Shop</h4>

          <Link href="/shop/sports">
            Sports
          </Link>

          <Link href="/shop/gym-active">
            Gym & Active
          </Link>

          <Link href="/shop/leather">
            Leather
          </Link>

          <Link href="/shop/fashion">
            Fashion
          </Link>
        </div>

        <div>
          <h4>Sports</h4>

          <Link href="/shop/sports/football-kits">
            Football Kits
          </Link>

          <Link href="/shop/sports/basketball">
            Basketball
          </Link>

          <Link href="/custom-kits">
            Custom Kits
          </Link>

          <Link href="/team-orders">
            Team Orders
          </Link>
        </div>

        <div>
          <h4>Help</h4>

          <a href="mailto:info@xlimegear.com">
            Contact
          </a>

          <span>Delivery</span>
          <span>Returns</span>
          <span>Size Guide</span>
          <span>FAQs</span>
        </div>

        <div>
          <h4>Contact</h4>

          <a
            href="https://wa.me/447510926711"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp +44 7510 926711
          </a>

          <a href="mailto:info@xlimegear.com">
            info@xlimegear.com
          </a>

          <a
            href="https://xlimegear.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            xlimegear.com
          </a>

          <a
            href="https://www.instagram.com/xlimegear"
            target="_blank"
            rel="noopener noreferrer"
          >
            @xlimegear
          </a>
        </div>

        <div className="newsletter">
          <h4>XLIME Updates</h4>

          <p
            style={{
              fontSize: 12,
              color: "#aeb2ab",
            }}
          >
            New arrivals, category drops and team-order updates.
          </p>

          <form
            action="mailto:info@xlimegear.com"
            method="post"
            encType="text/plain"
          >
            <input
              name="email"
              type="email"
              aria-label="Email address"
              placeholder="Email address"
            />

            <button
              className="btn primary full sm"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div
        className="wrap"
        style={{
          borderTop: "1px solid #252b24",
          marginTop: 32,
          paddingTop: 18,
          fontSize: 11,
          color: "#7e847c",
        }}
      >
        © 2026 XLIME GEAR • Premium sportswear, custom teamwear and lifestyle
        collections.
      </div>
    </footer>
  );
}