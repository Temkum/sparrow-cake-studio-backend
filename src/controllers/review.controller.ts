import { Request, Response, NextFunction } from 'express';
import * as service from '../services/review.service';
import { logger } from '../utils/logger';

export const getAll = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getAllReviews();
    res.json(data);
  } catch (err) {
    logger.error('Failed to get all reviews', { error: err });
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
      return res.status(400).json({ error: 'Invalid id' });
    }
    const review = await service.getReviewById(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    logger.error('Failed to get review', { error: err });
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Request body is required' });
    }
    const review = await service.createReview(req.body);
    res.status(201).json(review);
  } catch (err: any) {
    if (err.status >= 400 && err.status < 500) {
      // client errors: 400, 401, 403, 422 etc.
      return res.status(err.status).json({
        success: false,
        message: err.message,
        errors: err.errors || undefined, // Zod flatten or custom
        code: err.code || undefined,
      });
    }

    // unexpected / server errors → log fully + 500
    logger.error('Unexpected failure', {
      message: err.message,
      stack: err.stack,
      body: req.body,
      params: req.params,
      ip: req.ip,
    });

    next(err); // let global handler do 500
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
      return res.status(400).json({ error: 'Invalid id' });
    }
    const review = await service.updateReview(id, req.body);

    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    logger.error('Failed to update review', { error: err });
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
      return res.status(400).json({ error: 'Invalid id' });
    }
    const deleted = await service.deleteReview(id);
    if (!deleted) return res.status(404).json({ error: 'Review not found' });
    res.status(204).send();
  } catch (err) {
    logger.error('Failed to delete review', { error: err });
    next(err);
  }
};
