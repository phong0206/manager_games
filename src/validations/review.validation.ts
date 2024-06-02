import Joi from 'joi';
import { password, objectId } from './custom.validation'

const createReview = {
  body: Joi.object().keys({
    review: Joi.string().required(),
    rating: Joi.number().required(),
    description: Joi.string().required(),
    gameId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    review: Joi.string(),
    description: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    reviewId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      review: Joi.string().email(),
      rating: Joi.number(),
      description: Joi.string(),
    })
    .min(1),
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

export default {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
