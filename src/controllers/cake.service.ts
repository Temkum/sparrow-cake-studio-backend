import { Request, Response, NextFunction } from 'express';
import * as service from '../services/cake.service';
import { z } from 'zod';

const createSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string(),
  imageUrl: z.string().url().optional(),
});

export const getAllCakes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cakes = await service.getAll();
    res.json(cakes);
  } catch (err) {
    next(err);
  }
};

export const createCake = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createSchema.parse(req.body);
    const cake = await service.create(data);
    res.status(201).json(cake);
  } catch (err) {
    next(err);
  }
};
// add getById, update, delete similarly
