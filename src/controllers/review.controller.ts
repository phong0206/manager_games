import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { reviewService } from '../services';
import * as _ from 'lodash'

interface User {
  _id: string;
  role: string;
}

const getReviews = catchAsync(async (req, res) => {
  let filter: any = _.pick(req.query, ['review', 'rating','description']);
  filter = Object.fromEntries(
    Object.entries(filter).map(([key, value]) => {
      return [key, new RegExp(String(value), 'i')];
    })
  );
  const options = _.pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.queryReviews(filter, options);
  res.send(result);
});

const createReview = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.createReview(req.body);
  res.status(httpStatus.CREATED).send(review);
});

const getReview = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.getReviewById(req.params.reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  res.send(review);
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.updateReviewById(req.params.reviewId, req.body);
  res.send(review);
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
  if (user.role === 'user' && user._id !== req.params.reviewId){
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Review invalid');
  }
  await reviewService.deleteReviewById(req.params.reviewId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createReview,
  getReview,
  getReviews,
  updateReview,
  deleteReview,
};
