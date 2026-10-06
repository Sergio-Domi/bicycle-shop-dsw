import { Request, Response, NextFunction } from "express";
import { OrderItemService } from "./order-item.service";

export class OrderItemController {

  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orderItems = await OrderItemService.findAll();

      res.json(orderItems);
    } catch (error) {
      next(error);
    }
  }



  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      const orderItem = await OrderItemService.findById(id);

      if (!orderItem) {
        res.status(404).json({
          message: "OrderItem not found",
        });

        return;
      }

      res.json(orderItem);

    } catch (error) {
      next(error);
    }
  }

  static async getByOrderId(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Number(req.params.orderId);
      const result = await OrderItemService.findByOrderId(orderId);

      if (result.items.length === 0) {
        res.status(404).json({ message: "Order has no items or does not exist" });
        return;
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { orderId, bicycleId, quantity, unitPrice } = req.body;

      if (!orderId || !bicycleId || !quantity || !unitPrice) {
        res.status(400).json({
          message: "orderId, bicycleId, quantity, and unitPrice are mandatory",
        });

        return;
      }

      const orderItem = await OrderItemService.create({
        orderId,
        bicycleId,
        quantity,
        unitPrice
      });

      res.status(201).json(orderItem);

    } catch (error) {
      next(error);
    }
  }


  static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      const orderItem = await OrderItemService.findById(id);

      if (!orderItem) {
        res.status(404).json({
          message: "OrderItem not found",
        });

        return;
      }

      const updatedOrderItem = await OrderItemService.update(
        orderItem,
        req.body
      );

      res.json(updatedOrderItem);

    } catch (error) {
      next(error);
    }
  }


  static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      const orderItem = await OrderItemService.findById(id);

      if (!orderItem) {
        res.status(404).json({
          message: "OrderItem not found",
        });

        return;
      }

      await OrderItemService.delete(orderItem);

      res.status(204).send();

    } catch (error) {
      next(error);
    }
  }
}