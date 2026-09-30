import { Request, Response, NextFunction } from "express";
import { BicycleDetailService } from "./bicycle-detail.service";

export class BicycleDetailController {

  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bicycles = await BicycleDetailService.findAll();

      res.json(bicycles);
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

      const bicycledetail = await BicycleDetailService.findById(id);

      if (!bicycledetail) {
        res.status(404).json({
          message: "BicycleDetail not found",
        });

        return;
      }

      res.json(bicycledetail);

    } catch (error) {
      next(error);
    }
  }

static async getEagerlyById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      const bicycledetail = await BicycleDetailService.findEagerlyById(id);

      if (!bicycledetail) {
        res.status(404).json({
          message: "BicycleDetail not found",
        });

        return;
      }
      res.json(bicycledetail);

    } catch (error) {
      next(error)
    }
  }

  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bicycleId, frameMaterial, wheelSize, weight, suspension } = req.body;

      if (!bicycleId || !frameMaterial || !wheelSize || !weight) {
        res.status(400).json({
          message: "bicycleId, frameMaterial, wheelSize, and weight are mandatory",
        });

        return;
      }

      const bicycledetail = await BicycleDetailService.create({
        bicycleId: bicycleId,
        frameMaterial,
        wheelSize,
        weight,
        suspension,
      });

      res.status(201).json(bicycledetail);

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

      const bicycledetail = await BicycleDetailService.findById(id);

      if (!bicycledetail) {
        res.status(404).json({
          message: "BicycleDetail not found",
        });

        return;
      }

      const updatedBicycleDetail = await BicycleDetailService.update(
        bicycledetail,
        req.body
      );

      res.json(updatedBicycleDetail);

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

      const bicycledetail = await BicycleDetailService.findById(id);

      if (!bicycledetail) {
        res.status(404).json({
          message: "BicycleDetail not found",
        });

        return;
      }

      await BicycleDetailService.delete(bicycledetail);

      res.status(204).send();

    } catch (error) {
      next(error);
    }
  }
}