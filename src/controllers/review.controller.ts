import { Request, Response, NextFunction } from 'express';
import * as service from '../services/review.service';

export const getAll = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getAllReviews();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined;
    if (!id) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const review = await service.getReviewById(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const review = await service.createReview(req.body);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined;
    if (!id) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const review = await service.updateReview(id, req.body);

    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined;
    if (!id) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const deleted = await service.deleteReview(id);
    if (!deleted) return res.status(404).json({ error: 'Review not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
