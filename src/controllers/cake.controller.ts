import { Request, Response, NextFunction } from 'express';
import * as service from '../services/cake.service';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cakes = await service.getAllCakes();
    res.json(cakes);
  } catch (err) {
    next(err);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined;
    if (!id) {
      return res.status(400).json({ error: true, message: 'Invalid cake id' });
    }
    const cake = await service.getCakeById(id);
    if (!cake)
      return res.status(404).json({ error: true, message: 'Cake not found' });
    res.json(cake);
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cake = await service.createCake(req.body);
    res.status(201).json(cake);
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined;
    if (!id) {
      return res.status(400).json({ error: true, message: 'Invalid cake id' });
    }
    const cake = await service.updateCake(id, req.body);
    if (!cake)
      return res.status(404).json({ error: true, message: 'Cake not found' });
    res.json(cake);
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined;
    if (!id) {
      return res.status(400).json({ error: true, message: 'Invalid cake id' });
    }
    const deleted = await service.deleteCake(id);
    if (!deleted)
      return res.status(404).json({ error: true, message: 'Cake not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
