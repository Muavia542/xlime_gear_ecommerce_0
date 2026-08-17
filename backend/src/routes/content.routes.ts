import { Router } from "express";
import { prisma } from "../config/prisma.js";

export const contentRoutes = Router();
contentRoutes.get("/banner", async (_req, res) => {
  const banner = await prisma.announcementBanner.findUnique({ where: { name: "primary" } });
  if (!banner || !banner.isActive) return res.json({ banner: null });
  const now = new Date();
  if (banner.startAt && banner.startAt > now) return res.json({ banner: null });
  if (banner.endAt && banner.endAt < now) return res.json({ banner: null });
  res.json({ banner });
});
contentRoutes.get("/settings", async (_req, res) => {
  const keys = ["showPublicPrices", "enableCart", "enableTeamOrders", "enableCustomKits", "enableProductEnquiries", "contactDetails", "brand", "seo"];
  const rows = await prisma.storeSetting.findMany({ where: { key: { in: keys } } });
  res.json({ settings: Object.fromEntries(rows.map(r => [r.key, r.value])) });
});
