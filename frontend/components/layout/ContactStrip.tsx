import {
  ExternalLink,
  Mail,
  MessageCircle,
} from "lucide-react";

import InstagramIcon from "@/components/icons/InstagramIcon";

export default function ContactStrip() {
  const data = [
    [
      MessageCircle,
      "WhatsApp",
      "+44 7510 926711",
      "https://wa.me/447510926711",
    ],
    [
      Mail,
      "Email",
      "info@xlimegear.com",
      "mailto:info@xlimegear.com",
    ],
    [
      ExternalLink,
      "Website",
      "xlimegear.com",
      "https://xlimegear.com",
    ],
    [
      InstagramIcon,
      "Instagram",
      "@xlimegear",
      "https://www.instagram.com/xlimegear",
    ],
  ] as const;

  return (
    <div className="hero-contact-static">
      <div className="wrap hero-contact-grid">
        {data.map(([Icon, title, sub, href]) => {
          const isExternal = href.startsWith("http");

          return (
            <a
              key={title}
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
            >
              <span className="ico">
                <Icon size={16} />
              </span>

              <div>
                <b>{title}</b>
                <span>{sub}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}