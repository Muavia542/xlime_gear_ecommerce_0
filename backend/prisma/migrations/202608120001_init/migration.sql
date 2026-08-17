-- XLIME GEAR initial MySQL schema
CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `role` ENUM('CUSTOMER','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `User_email_key`(`email`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Address` (
  `id` VARCHAR(191) NOT NULL,
  `label` VARCHAR(191) NOT NULL DEFAULT 'Home',
  `fullName` VARCHAR(191) NOT NULL,
  `line1` VARCHAR(191) NOT NULL,
  `line2` VARCHAR(191) NULL,
  `city` VARCHAR(191) NOT NULL,
  `postcode` VARCHAR(191) NOT NULL,
  `country` VARCHAR(191) NOT NULL DEFAULT 'United Kingdom',
  `phone` VARCHAR(191) NULL,
  `isDefault` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  INDEX `Address_userId_idx`(`userId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Category` (
  `id` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `imageUrl` TEXT NULL,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  UNIQUE INDEX `Category_slug_key`(`slug`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Product` (
  `id` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `shortDescription` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `subcategory` VARCHAR(191) NOT NULL,
  `imageUrl` TEXT NOT NULL,
  `featured` BOOLEAN NOT NULL DEFAULT false,
  `isCustomizable` BOOLEAN NOT NULL DEFAULT false,
  `teamOrderEligible` BOOLEAN NOT NULL DEFAULT false,
  `showPrice` BOOLEAN NOT NULL DEFAULT false,
  `pricePence` INTEGER NULL,
  `stockQuantity` INTEGER NULL DEFAULT 0,
  `status` ENUM('ACTIVE','DRAFT','ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
  `tags` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `categoryId` VARCHAR(191) NOT NULL,
  UNIQUE INDEX `Product_slug_key`(`slug`),
  INDEX `Product_categoryId_status_idx`(`categoryId`,`status`),
  INDEX `Product_subcategory_idx`(`subcategory`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ProductImage` (
  `id` VARCHAR(191) NOT NULL,
  `url` TEXT NOT NULL,
  `alt` VARCHAR(191) NOT NULL,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `productId` VARCHAR(191) NOT NULL,
  INDEX `ProductImage_productId_sortOrder_idx`(`productId`,`sortOrder`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Cart` (
  `id` VARCHAR(191) NOT NULL,
  `guestToken` VARCHAR(191) NULL,
  `userId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `Cart_guestToken_key`(`guestToken`),
  UNIQUE INDEX `Cart_userId_key`(`userId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CartItem` (
  `id` VARCHAR(191) NOT NULL,
  `quantity` INTEGER NOT NULL DEFAULT 1,
  `customisation` JSON NULL,
  `cartId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `CartItem_cartId_idx`(`cartId`),
  INDEX `CartItem_productId_idx`(`productId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Order` (
  `id` VARCHAR(191) NOT NULL,
  `orderNumber` VARCHAR(191) NOT NULL,
  `status` ENUM('REQUESTED','CONFIRMED','IN_PRODUCTION','READY_TO_SHIP','SHIPPED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'REQUESTED',
  `customerName` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `deliveryAddress` JSON NOT NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `userId` VARCHAR(191) NULL,
  UNIQUE INDEX `Order_orderNumber_key`(`orderNumber`),
  INDEX `Order_userId_idx`(`userId`),
  INDEX `Order_status_createdAt_idx`(`status`,`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `OrderItem` (
  `id` VARCHAR(191) NOT NULL,
  `productName` VARCHAR(191) NOT NULL,
  `productSlug` VARCHAR(191) NOT NULL,
  `imageUrl` TEXT NOT NULL,
  `quantity` INTEGER NOT NULL,
  `customisation` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `orderId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NULL,
  INDEX `OrderItem_orderId_idx`(`orderId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `TeamOrderRequest` (
  `id` VARCHAR(191) NOT NULL,
  `requestNumber` VARCHAR(191) NOT NULL,
  `organisation` VARCHAR(191) NOT NULL,
  `contactName` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `numberOfPlayers` INTEGER NULL,
  `requirements` TEXT NOT NULL,
  `status` ENUM('NEW','REVIEWING','QUOTED','APPROVED','IN_PRODUCTION','COMPLETED','CANCELLED') NOT NULL DEFAULT 'NEW',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `TeamOrderRequest_requestNumber_key`(`requestNumber`),
  INDEX `TeamOrderRequest_status_createdAt_idx`(`status`,`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CustomKitRequest` (
  `id` VARCHAR(191) NOT NULL,
  `requestNumber` VARCHAR(191) NOT NULL,
  `teamName` VARCHAR(191) NULL,
  `sport` VARCHAR(191) NOT NULL DEFAULT 'Football',
  `primaryColor` VARCHAR(191) NOT NULL DEFAULT '#C8FF00',
  `secondaryColor` VARCHAR(191) NOT NULL DEFAULT '#080A08',
  `playerName` VARCHAR(191) NULL,
  `playerNumber` VARCHAR(191) NULL,
  `crestUrl` TEXT NULL,
  `notes` TEXT NULL,
  `status` ENUM('NEW','REVIEWING','QUOTED','APPROVED','IN_PRODUCTION','COMPLETED','CANCELLED') NOT NULL DEFAULT 'NEW',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `userId` VARCHAR(191) NULL,
  UNIQUE INDEX `CustomKitRequest_requestNumber_key`(`requestNumber`),
  INDEX `CustomKitRequest_status_createdAt_idx`(`status`,`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AuditLog` (
  `id` VARCHAR(191) NOT NULL,
  `action` VARCHAR(191) NOT NULL,
  `entityType` VARCHAR(191) NOT NULL,
  `entityId` VARCHAR(191) NULL,
  `metadata` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `userId` VARCHAR(191) NULL,
  INDEX `AuditLog_createdAt_idx`(`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `CustomKitRequest` ADD CONSTRAINT `CustomKitRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
