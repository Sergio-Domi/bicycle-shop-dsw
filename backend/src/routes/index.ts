import { Router } from "express";
import bicycleRoutes from "../modules/bicycles/bicycle.routes";
import brandRoutes from "../modules/brands/brand.routes";
import bicycleDetailRoutes from "../modules/bicycle-details/bicycle-detail.routes";
import customerRoutes from "../modules/customers/customer.routes";
import orderRoutes from "../modules/orders/order.routes";
import orderItemRoutes from "../modules/order-items/order-item.routes";
import modelRoutes from "../modules/models/model.routes";

const router = Router();

router.use("/bicycles", bicycleRoutes);
router.use("/brands", brandRoutes);
router.use("/bicycle-details", bicycleDetailRoutes);
router.use("/customers", customerRoutes);
router.use("/orders", orderRoutes);
router.use("/order-items", orderItemRoutes);
router.use("/models", modelRoutes);

export default router;