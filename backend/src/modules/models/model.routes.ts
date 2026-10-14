import { Router } from "express";
import { ModelController } from "./model.controller";

const router = Router();

router.get("/", ModelController.getAll);

router.get("/:id", ModelController.getById);

router.post("/", ModelController.create);

router.put("/:id", ModelController.update);

router.delete("/:id", ModelController.delete);

export default router;