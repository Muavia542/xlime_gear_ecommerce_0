import { Router } from "express"; import { productController } from "../controllers/product.controller.js";
export const productRoutes = Router(); productRoutes.get("/", productController.list); productRoutes.get("/categories", productController.categories); productRoutes.get("/:slug", productController.bySlug);
