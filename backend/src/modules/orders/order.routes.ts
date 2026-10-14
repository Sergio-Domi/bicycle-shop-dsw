import { Router } from "express";
import { OrderController } from "./order.controller";
const router = Router();

router.get("/", OrderController.getAll);

router.get("/customers/:id", OrderController.getByCustomerId);

router.get("/bicycles/price-less/:price/weight-greater/:weight", OrderController.getWithCheapAndHeavyBicycles);

router.get("/:id", OrderController.getById);

router.post("/", OrderController.create);

router.put("/:id", OrderController.update);

router.delete("/:id", OrderController.delete);

export default router;