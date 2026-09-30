import { Request, Response, NextFunction } from "express";
import { BicycleService } from "./bicycle.service";

export class BicycleController {

  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bicycles = await BicycleService.findAll();

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

      const bicycle = await BicycleService.findById(id);

      if (!bicycle) {
        res.status(404).json({
          message: "Bicycle not found",
        });

        return;
      }

      res.json(bicycle);

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

      const bicycle = await BicycleService.findEagerlyById(id);

      if (!bicycle) {
        res.status(404).json({
          messsage: "Bicycle not found",
        });

        return;
      }
      res.json(bicycle);

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
      const { brandId, model, description, price, stock } = req.body;

      if (!brandId || !model || price === undefined) {
        res.status(400).json({
          message: "brand, model, and price are mandatory",
        });

        return;
      }

      const bicycle = await BicycleService.create({
        brandId,
        model,
        description,
        price,
        stock,
      });

      res.status(201).json(bicycle);

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

      const bicycle = await BicycleService.findById(id);

      if (!bicycle) {
        res.status(404).json({
          message: "Bicycle not found",
        });

        return;
      }

      const updatedBicycle = await BicycleService.update(
        bicycle,
        req.body
      );

      res.json(updatedBicycle);

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

      const bicycle = await BicycleService.findById(id);

      if (!bicycle) {
        res.status(404).json({
          message: "Bicycle not found",
        });

        return;
      }

      await BicycleService.delete(bicycle);

      res.status(204).send();

    } catch (error) {
      next(error);
    }
  }
}