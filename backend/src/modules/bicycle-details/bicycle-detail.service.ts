
import { BicycleDetail } from "./bicycle-detail.model";

export class BicycleDetailService {

  static async findAll() {
    return BicycleDetail.findAll({
      order: [["id", "ASC"]],
    });
  }


  static async findById(id: number) {
    return BicycleDetail.findByPk(id);
  }


  static async findEagerlyById(id: number) {

    return BicycleDetail.findByPk(id, {
      include: [
        {
          model: BicycleDetail,
          as: 'bicycleDetail'
        }
      ]
    })
  }


  static async create(data: {
    bicycleId: number;
    frameMaterial: "Aluminum" | "Carbon" | "Steel" | "Titanium";
    wheelSize: number;
    weight: number;
    suspension?: string | null;
  }) {
    return BicycleDetail.create(data);
  }


  static async update(
    bicycledetail: BicycleDetail,
    data: {
      bicycleId?: number;
      frameMaterial?: "Aluminum" | "Carbon" | "Steel" | "Titanium";
      wheelSize?: number;
      weight?: number;
      suspension?: string | null;
    }
  ) {
    return bicycledetail.update(data);
  }


  static async delete(bicycledetail: BicycleDetail) {
    await bicycledetail.destroy();
  }
}