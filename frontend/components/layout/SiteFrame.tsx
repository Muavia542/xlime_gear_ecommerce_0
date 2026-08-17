import type { ReactNode } from "react";

import AnnouncementBanner from "./AnnouncementBanner";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import FloatingCartButton from "@/components/cart/FloatingCartButton";
import CartDrawer from "@/components/cart/CartDrawer";

export default function SiteFrame({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <AnnouncementBanner />
      <SiteHeader />

      {children}

      <FloatingCartButton />
      <CartDrawer />
      <SiteFooter />
    </>
  );
}