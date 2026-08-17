import { Router } from "express";
import { adminV2Controller } from "../controllers/admin-v2.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { collectionSchema, collectionUpdateSchema, inventoryAdjustmentSchema, stageSchema, noteSchema, quoteSchema, teamAccountSchema, teamAccountUpdateSchema, bannerSchema, campaignSchema, campaignUpdateSchema, settingsSchema, notificationReadSchema, adminMembershipSchema, mediaAssetSchema, quoteStatusSchema, adminTeamOrderCreateSchema, adminCustomKitCreateSchema, createAdminUserSchema, customKitAssetSchema, customKitRevisionSchema } from "../validators/admin-v2.validator.js";

export const adminV2Routes = Router();
adminV2Routes.use(requireAdmin);
adminV2Routes.get("/dashboard", requirePermission("dashboard.view"), adminV2Controller.dashboard);
adminV2Routes.get("/search", requirePermission("dashboard.view"), adminV2Controller.search);

adminV2Routes.get("/collections", requirePermission("collections.manage"), adminV2Controller.collections);
adminV2Routes.post("/collections", requirePermission("collections.manage"), validate(collectionSchema), adminV2Controller.createCollection);
adminV2Routes.patch("/collections/:id", requirePermission("collections.manage"), validate(collectionUpdateSchema), adminV2Controller.updateCollection);
adminV2Routes.delete("/collections/:id", requirePermission("collections.manage"), adminV2Controller.deleteCollection);

adminV2Routes.get("/inventory", requirePermission("inventory.manage"), adminV2Controller.inventory);
adminV2Routes.post("/inventory/:id/adjust", requirePermission("inventory.manage"), validate(inventoryAdjustmentSchema), adminV2Controller.adjustInventory);
adminV2Routes.get("/orders/:id", requirePermission("orders.manage"), adminV2Controller.orderDetail);

adminV2Routes.post("/team-orders", requirePermission("teamOrders.manage"), validate(adminTeamOrderCreateSchema), adminV2Controller.createTeamOrder);
adminV2Routes.get("/team-orders/:id", requirePermission("teamOrders.manage"), adminV2Controller.teamOrderDetail);
adminV2Routes.patch("/team-orders/:id/stage", requirePermission("teamOrders.manage"), validate(stageSchema), adminV2Controller.updateTeamStage);
adminV2Routes.post("/team-orders/:id/notes", requirePermission("teamOrders.manage"), validate(noteSchema), adminV2Controller.addTeamNote);
adminV2Routes.post("/custom-kits", requirePermission("customKits.manage"), validate(adminCustomKitCreateSchema), adminV2Controller.createCustomKit);
adminV2Routes.get("/custom-kits/:id", requirePermission("customKits.manage"), adminV2Controller.customKitDetail);
adminV2Routes.patch("/custom-kits/:id/stage", requirePermission("customKits.manage"), validate(stageSchema), adminV2Controller.updateKitStage);
adminV2Routes.post("/custom-kits/:id/assets", requirePermission("customKits.manage"), validate(customKitAssetSchema), adminV2Controller.addCustomKitAsset);
adminV2Routes.delete("/custom-kits/:id/assets/:assetId", requirePermission("customKits.manage"), adminV2Controller.deleteCustomKitAsset);
adminV2Routes.post("/custom-kits/:id/revisions", requirePermission("customKits.manage"), validate(customKitRevisionSchema), adminV2Controller.addCustomKitRevision);

adminV2Routes.get("/quotes", requirePermission("quotes.manage"), adminV2Controller.quotes);
adminV2Routes.post("/quotes", requirePermission("quotes.manage"), validate(quoteSchema), adminV2Controller.createQuote);
adminV2Routes.get("/quotes/:id", requirePermission("quotes.manage"), adminV2Controller.quoteDetail);
adminV2Routes.patch("/quotes/:id/status", requirePermission("quotes.manage"), validate(quoteStatusSchema), adminV2Controller.updateQuoteStatus);

adminV2Routes.get("/customers", requirePermission("customers.manage"), adminV2Controller.customers);
adminV2Routes.get("/customers/:id", requirePermission("customers.manage"), adminV2Controller.customerDetail);
adminV2Routes.post("/customers/:id/notes", requirePermission("customers.manage"), validate(noteSchema), adminV2Controller.addCustomerNote);

adminV2Routes.get("/team-accounts", requirePermission("customers.manage"), adminV2Controller.teamAccounts);
adminV2Routes.post("/team-accounts", requirePermission("customers.manage"), validate(teamAccountSchema), adminV2Controller.createTeamAccount);
adminV2Routes.patch("/team-accounts/:id", requirePermission("customers.manage"), validate(teamAccountUpdateSchema), adminV2Controller.updateTeamAccount);

adminV2Routes.get("/banner", requirePermission("marketing.manage"), adminV2Controller.banner);
adminV2Routes.put("/banner", requirePermission("marketing.manage"), validate(bannerSchema), adminV2Controller.updateBanner);
adminV2Routes.get("/campaigns", requirePermission("marketing.manage"), adminV2Controller.campaigns);
adminV2Routes.post("/campaigns", requirePermission("marketing.manage"), validate(campaignSchema), adminV2Controller.createCampaign);
adminV2Routes.patch("/campaigns/:id", requirePermission("marketing.manage"), validate(campaignUpdateSchema), adminV2Controller.updateCampaign);

adminV2Routes.get("/analytics/performance", requirePermission("analytics.view"), adminV2Controller.analyticsPerformance);
adminV2Routes.get("/analytics/products", requirePermission("analytics.view"), adminV2Controller.analyticsProducts);
adminV2Routes.get("/analytics/requests", requirePermission("analytics.view"), adminV2Controller.analyticsRequests);

adminV2Routes.get("/notifications", adminV2Controller.notifications);
adminV2Routes.patch("/notifications/:id", validate(notificationReadSchema), adminV2Controller.updateNotification);
adminV2Routes.post("/notifications/read-all", adminV2Controller.markAllNotifications);
adminV2Routes.get("/audit-logs", requirePermission("audit.view"), adminV2Controller.auditLogs);

adminV2Routes.get("/roles", requirePermission("admins.manage"), adminV2Controller.roles);
adminV2Routes.get("/admin-users", requirePermission("admins.manage"), adminV2Controller.adminUsers);
adminV2Routes.post("/admin-users", requirePermission("admins.manage"), validate(createAdminUserSchema), adminV2Controller.createAdminUser);
adminV2Routes.patch("/admin-users/:id/membership", requirePermission("admins.manage"), validate(adminMembershipSchema), adminV2Controller.updateAdminMembership);

adminV2Routes.get("/settings", requirePermission("settings.manage"), adminV2Controller.settings);
adminV2Routes.put("/settings", requirePermission("settings.manage"), validate(settingsSchema), adminV2Controller.updateSettings);
adminV2Routes.get("/media", requirePermission("media.manage"), adminV2Controller.media);
adminV2Routes.post("/media", requirePermission("media.manage"), validate(mediaAssetSchema), adminV2Controller.createMedia);
adminV2Routes.delete("/media/:id", requirePermission("media.manage"), adminV2Controller.deleteMedia);
