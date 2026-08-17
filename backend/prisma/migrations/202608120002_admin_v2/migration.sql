-- XLIME GEAR Admin V2 / operations hub expansion.
-- This migration is additive and preserves the existing V1 data.

ALTER TABLE `Category`
  ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN `subcategories` JSON NULL,
  ADD COLUMN `seoTitle` VARCHAR(191) NULL,
  ADD COLUMN `seoDescription` VARCHAR(320) NULL,
  ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

ALTER TABLE `Product`
  ADD COLUMN `sku` VARCHAR(191) NULL,
  ADD COLUMN `sport` VARCHAR(191) NULL,
  ADD COLUMN `gender` VARCHAR(191) NOT NULL DEFAULT 'Unisex',
  ADD COLUMN `fabric` VARCHAR(191) NULL,
  ADD COLUMN `fit` VARCHAR(191) NULL,
  ADD COLUMN `productType` VARCHAR(191) NOT NULL DEFAULT 'Standard',
  ADD COLUMN `altText` VARCHAR(191) NULL,
  ADD COLUMN `lowStockThreshold` INTEGER NOT NULL DEFAULT 10,
  ADD COLUMN `seoTitle` VARCHAR(191) NULL,
  ADD COLUMN `seoDescription` VARCHAR(320) NULL,
  ADD COLUMN `viewCount` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `enquiryCount` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `cartAddCount` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `teamRequestCount` INTEGER NOT NULL DEFAULT 0,
  ADD UNIQUE INDEX `Product_sku_key`(`sku`),
  ADD INDEX `Product_sport_idx`(`sport`);

ALTER TABLE `Order`
  ADD COLUMN `internalValuePence` INTEGER NULL,
  ADD COLUMN `assignedAdminId` VARCHAR(191) NULL;

ALTER TABLE `TeamOrderRequest`
  ADD COLUMN `sport` VARCHAR(191) NOT NULL DEFAULT 'Football',
  ADD COLUMN `packageInterest` VARCHAR(191) NULL,
  ADD COLUMN `deadline` DATETIME(3) NULL,
  ADD COLUMN `stage` VARCHAR(191) NOT NULL DEFAULT 'NEW_LEAD',
  ADD COLUMN `assignedAdminId` VARCHAR(191) NULL,
  ADD COLUMN `quoteValuePence` INTEGER NULL,
  ADD COLUMN `lastContactAt` DATETIME(3) NULL,
  ADD INDEX `TeamOrderRequest_stage_idx`(`stage`);

ALTER TABLE `CustomKitRequest`
  ADD COLUMN `stage` VARCHAR(191) NOT NULL DEFAULT 'NEW',
  ADD COLUMN `assignedAdminId` VARCHAR(191) NULL,
  ADD INDEX `CustomKitRequest_stage_idx`(`stage`);

ALTER TABLE `AuditLog`
  ADD COLUMN `description` TEXT NULL,
  ADD COLUMN `ipAddress` VARCHAR(191) NULL,
  ADD COLUMN `userAgent` TEXT NULL,
  ADD INDEX `AuditLog_entityType_entityId_idx`(`entityType`,`entityId`);

CREATE TABLE `ProductVariant` (
  `id` VARCHAR(191) NOT NULL,
  `sku` VARCHAR(191) NOT NULL,
  `size` VARCHAR(191) NULL,
  `color` VARCHAR(191) NULL,
  `stock` INTEGER NOT NULL DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  UNIQUE INDEX `ProductVariant_sku_key`(`sku`),
  INDEX `ProductVariant_productId_idx`(`productId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Collection` (
  `id` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `imageUrl` TEXT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `ruleJson` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `Collection_slug_key`(`slug`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CollectionProduct` (
  `collectionId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  INDEX `CollectionProduct_productId_idx`(`productId`),
  PRIMARY KEY (`collectionId`,`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `InventoryTransaction` (
  `id` VARCHAR(191) NOT NULL,
  `oldQuantity` INTEGER NOT NULL,
  `changeQuantity` INTEGER NOT NULL,
  `newQuantity` INTEGER NOT NULL,
  `reason` VARCHAR(191) NOT NULL,
  `note` TEXT NULL,
  `performedById` VARCHAR(191) NULL,
  `performedBy` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `productId` VARCHAR(191) NOT NULL,
  INDEX `InventoryTransaction_productId_createdAt_idx`(`productId`,`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `TeamOrderNote` (
  `id` VARCHAR(191) NOT NULL,
  `note` TEXT NOT NULL,
  `authorId` VARCHAR(191) NULL,
  `authorName` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `requestId` VARCHAR(191) NOT NULL,
  INDEX `TeamOrderNote_requestId_createdAt_idx`(`requestId`,`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `TeamAccount` (
  `id` VARCHAR(191) NOT NULL,
  `organisation` VARCHAR(191) NOT NULL,
  `organisationType` VARCHAR(191) NOT NULL DEFAULT 'Club',
  `sport` VARCHAR(191) NULL,
  `logoUrl` TEXT NULL,
  `primaryContact` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `secondaryContact` VARCHAR(191) NULL,
  `deliveryAddress` TEXT NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `TeamAccount_organisation_key`(`organisation`),
  INDEX `TeamAccount_email_idx`(`email`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CustomKitAsset` (
  `id` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'REFERENCE',
  `url` TEXT NOT NULL,
  `label` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `requestId` VARCHAR(191) NOT NULL,
  INDEX `CustomKitAsset_requestId_idx`(`requestId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CustomKitRevision` (
  `id` VARCHAR(191) NOT NULL,
  `version` INTEGER NOT NULL,
  `previewUrl` TEXT NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'REVIEW',
  `notes` TEXT NULL,
  `uploadedBy` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `requestId` VARCHAR(191) NOT NULL,
  UNIQUE INDEX `CustomKitRevision_requestId_version_key`(`requestId`,`version`),
  INDEX `CustomKitRevision_requestId_createdAt_idx`(`requestId`,`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Quote` (
  `id` VARCHAR(191) NOT NULL,
  `quoteNumber` VARCHAR(191) NOT NULL,
  `customerName` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `sourceType` VARCHAR(191) NOT NULL DEFAULT 'MANUAL',
  `sourceId` VARCHAR(191) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
  `subtotalPence` INTEGER NOT NULL DEFAULT 0,
  `discountPence` INTEGER NOT NULL DEFAULT 0,
  `deliveryPence` INTEGER NOT NULL DEFAULT 0,
  `totalPence` INTEGER NOT NULL DEFAULT 0,
  `validUntil` DATETIME(3) NULL,
  `internalNotes` TEXT NULL,
  `customerNotes` TEXT NULL,
  `createdById` VARCHAR(191) NULL,
  `sentAt` DATETIME(3) NULL,
  `approvedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `Quote_quoteNumber_key`(`quoteNumber`),
  INDEX `Quote_status_createdAt_idx`(`status`,`createdAt`),
  INDEX `Quote_sourceType_sourceId_idx`(`sourceType`,`sourceId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `QuoteItem` (
  `id` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NOT NULL,
  `quantity` INTEGER NOT NULL DEFAULT 1,
  `unitPence` INTEGER NOT NULL DEFAULT 0,
  `totalPence` INTEGER NOT NULL DEFAULT 0,
  `quoteId` VARCHAR(191) NOT NULL,
  INDEX `QuoteItem_quoteId_idx`(`quoteId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CustomerNote` (
  `id` VARCHAR(191) NOT NULL,
  `note` TEXT NOT NULL,
  `authorId` VARCHAR(191) NULL,
  `authorName` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `userId` VARCHAR(191) NOT NULL,
  INDEX `CustomerNote_userId_createdAt_idx`(`userId`,`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Notification` (
  `id` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `message` TEXT NOT NULL,
  `entityType` VARCHAR(191) NULL,
  `entityId` VARCHAR(191) NULL,
  `isRead` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `Notification_isRead_createdAt_idx`(`isRead`,`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AnnouncementBanner` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL DEFAULT 'primary',
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `isDismissible` BOOLEAN NOT NULL DEFAULT true,
  `text` VARCHAR(191) NOT NULL DEFAULT 'Built for performance. Custom team orders available.',
  `ctaText` VARCHAR(191) NULL DEFAULT 'Team Orders',
  `ctaUrl` VARCHAR(191) NULL DEFAULT '/team-orders',
  `background` VARCHAR(191) NOT NULL DEFAULT '#C8FF00',
  `textColor` VARCHAR(191) NOT NULL DEFAULT '#080A08',
  `startAt` DATETIME(3) NULL,
  `endAt` DATETIME(3) NULL,
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `AnnouncementBanner_name_key`(`name`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Campaign` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'SEASONAL',
  `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
  `headline` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `destination` VARCHAR(191) NULL,
  `startsAt` DATETIME(3) NULL,
  `endsAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `Campaign_status_startsAt_idx`(`status`,`startsAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `MediaAsset` (
  `id` VARCHAR(191) NOT NULL,
  `fileName` VARCHAR(191) NOT NULL,
  `url` TEXT NOT NULL,
  `mimeType` VARCHAR(191) NOT NULL,
  `alt` VARCHAR(191) NOT NULL,
  `folder` VARCHAR(191) NOT NULL DEFAULT 'general',
  `width` INTEGER NULL,
  `height` INTEGER NULL,
  `sizeBytes` INTEGER NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `MediaAsset_folder_createdAt_idx`(`folder`,`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AdminRole` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `AdminRole_key_key`(`key`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Permission` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  UNIQUE INDEX `Permission_key_key`(`key`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AdminRolePermission` (
  `roleId` VARCHAR(191) NOT NULL,
  `permissionId` VARCHAR(191) NOT NULL,
  INDEX `AdminRolePermission_permissionId_idx`(`permissionId`),
  PRIMARY KEY (`roleId`,`permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AdminMembership` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `roleId` VARCHAR(191) NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `AdminMembership_userId_key`(`userId`),
  INDEX `AdminMembership_roleId_idx`(`roleId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `StoreSetting` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `value` JSON NOT NULL,
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `StoreSetting_key_key`(`key`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `ProductVariant` ADD CONSTRAINT `ProductVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `CollectionProduct` ADD CONSTRAINT `CollectionProduct_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `CollectionProduct` ADD CONSTRAINT `CollectionProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `InventoryTransaction` ADD CONSTRAINT `InventoryTransaction_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TeamOrderNote` ADD CONSTRAINT `TeamOrderNote_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `TeamOrderRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `CustomKitAsset` ADD CONSTRAINT `CustomKitAsset_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `CustomKitRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `CustomKitRevision` ADD CONSTRAINT `CustomKitRevision_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `CustomKitRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `QuoteItem` ADD CONSTRAINT `QuoteItem_quoteId_fkey` FOREIGN KEY (`quoteId`) REFERENCES `Quote`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `CustomerNote` ADD CONSTRAINT `CustomerNote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `AdminRolePermission` ADD CONSTRAINT `AdminRolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `AdminRole`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `AdminRolePermission` ADD CONSTRAINT `AdminRolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `AdminMembership` ADD CONSTRAINT `AdminMembership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `AdminMembership` ADD CONSTRAINT `AdminMembership_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `AdminRole`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
