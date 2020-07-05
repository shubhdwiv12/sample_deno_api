import { Router } from "https://deno.land/x/oak@v5.3.1/mod.ts";
import {
  getProducts,
  getProduct,
  addProducts,
  updateProduct,
  delProducts,
} from "../controllers/products.ts";

const router = new Router();

router
  .get("/api/v1/products", getProducts)
  .get("/api/v1/products/:id", getProduct)
  .post("/api/v1/products", addProducts)
  .put("/api/v1/products/:id", updateProduct)
  .delete("/api/v1/products/:id", delProducts);

export default router;
