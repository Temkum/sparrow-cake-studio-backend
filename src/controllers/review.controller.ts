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
    const review = await service.getReviewById(req.params.id);
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
    const review = await service.updateReview(req.params.id, req.body);
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
    const deleted = await service.deleteReview(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Review not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
