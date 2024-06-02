import httpStatus from 'http-status';
import { Review } from '../models'
import ApiError from '../utils/ApiError';
import userService from './user.service';
import gameService from './game.service';


/**
 * Query for reviews
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReviews = async (filter: any, options: any) => {
  const reviews = await Review.paginate(filter, options);
  return reviews;
};

/**
 * Create a review
 * @param {any} reviewBody
 * @returns {Promise<any>}
 */
const createReview = async (reviewBody: any): Promise<any> => {
  const [user, game] = await Promise.all([userService.getUserById(reviewBody.userId), gameService.getById(reviewBody.gameId)])
  // if (!user || !game) throw new ApiError(httpStatus.NOT_FOUND, 'User or Game not found');
  return Review.create(reviewBody);
};

/**
 * Get review by id
 * @param {any} id
 * @returns {Promise<any>}
 */
const getReviewById = async (id: any): Promise<any> => {
  return Review.findById(id).exec();
};


/**
 * Update review by id
 * @param {any} reviewId
 * @param {Partial<any>} updateBody
 * @returns {Promise<any>}
 */
const updateReviewById = async (
  reviewId: any,
  updateBody: Partial<any>
): Promise<any> => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  Object.assign(review, updateBody);
  await review.save();
  return review;
};

/**
 * Delete review by id
 * @param {any} reviewId
 * @returns {Promise<any>}
 */
const deleteReviewById = async (reviewId: any): Promise<any> => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  await review.deleteOne();
  return review;
};

export default {
  createReview,
  queryReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};
