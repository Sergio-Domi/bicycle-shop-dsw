import { Brand } from "../brands/brand.model";
import { Bicycle } from "./bicycle.model";

export class BicycleService {

  static async findAll() {
    return Bicycle.findAll({
      order: [["id", "ASC"]],
    });
  }


  static async findById(id: number) {
    return Bicycle.findByPk(id);
  }


  static async findEagerlyById(id: number) {

    return Bicycle.findByPk(id, {
      include: [
        {
          model: Brand,
          as: 'brand'
        }
      ]
    })
  }


  static async create(data: {
    brandId: number;
    model: string;
    description?: string | null;
    price: number;
    stock: number;
  }) {
    return Bicycle.create(data);
  }


  static async update(
    bicycle: Bicycle,
    data: {
      brandId?: number;
      model?: string;
      description?: string | null;
      price?: number;
      stock?: number;
    }
  ) {
    return bicycle.update(data);
  }


  static async delete(bicycle: Bicycle) {
    await bicycle.destroy();
  }
}