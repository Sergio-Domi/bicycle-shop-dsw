import { Customer } from "../customers/customer.model";
import { Order } from "./order.model";
import { Bicycle } from "../bicycles/bicycle.model";
import { BicycleDetail } from "../bicycle-details/bicycle-detail.model";
import { Op } from "sequelize";

export class OrderService {

  static async findAll() {
    return Order.findAll({
      order: [["id", "ASC"]],
    });
  }


  static async findById(id: number) {
    return Order.findByPk(id);
  }


  static async findByCustomerId(customerId: number) {
    return Order.findAll({
      where: { customerId },
      include: [{ model: Customer, as: "customer", attributes: ["id", "name", "email"] }],
      order: [["orderDate", "DESC"]],
    });
  }

  static async findWithCheapAndHeavyBicycles(maxPrice: number, minWeight: number) {
    return Order.findAll({
      include: [
        {
          model: Bicycle,
          as: "bicycles",
          where: { price: { [Op.lt]: maxPrice } },
          required: true,
          include: [
            {
              model: BicycleDetail,
              as: "detail",
              where: { weight: { [Op.gt]: minWeight } },
              required: true,
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });
  }



  static async create(data: {
    customerId: number;
    orderDate: Date;
    status: "pending" | "paid" | "shipped" | "cancelled";
  }) {
    return Order.create(data);
  }


  static async update(
    order: Order,
    data: {
      customerId?: number;
      orderDate?: Date;
      status?: "pending" | "paid" | "shipped" | "cancelled";
    }
  ) {
    return order.update(data);
  }


  static async delete(order: Order) {
    await order.destroy();
  }
}