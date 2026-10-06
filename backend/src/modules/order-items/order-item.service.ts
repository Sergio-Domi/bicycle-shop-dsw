
import { Bicycle } from "../bicycles/bicycle.model";
import { Order } from "../orders/order.model";
import { OrderItem } from "./order-item.model";

export class OrderItemService {

  static async findAll() {
    return OrderItem.findAll({
      include: [
        {
          model: Order,
          as: "order",
        },
        {
          model: Bicycle,
          as: "bicycle",
        },
      ],
      order: [["id", "ASC"]],
    });
  }


  static async findById(id: number) {
    return OrderItem.findByPk(id);
  }

  static async findByOrderId(orderId: number) {
    const items = await OrderItem.findAll({
      where: { orderId },
      include: [
        { model: Order, as: "order", attributes: ["id", "orderDate", "status"] },
        { model: Bicycle, as: "bicycle", attributes: ["id", "model", "price"] },
      ],
      order: [["id", "ASC"]],
    });

    const total = items.reduce(
      (sum, item) => sum + item.quantity * Number(item.unitPrice),
      0
    );

    return { orderId, items, total };
  }


  static async create(data: {
    orderId: number;
    bicycleId: number;
    quantity: number;
    unitPrice: number;
  }) {
    return OrderItem.create(data);
  }


  static async update(
    orderitem: OrderItem,
    data: {
      orderId?: number;
      bicycleId?: number;
      quantity?: number;
      unitPrice?: number;
    }
  ) {
    return orderitem.update(data);
  }


  static async delete(orderitem: OrderItem) {
    await orderitem.destroy();
  }
}