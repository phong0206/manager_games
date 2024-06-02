import express from 'express';
import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import reviewValidation from '../../validations/review.validation';
import reviewController from '../../controllers/review.controller';

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(reviewValidation.createReview), reviewController.createReview)
  .get(auth(), validate(reviewValidation.getReviews), reviewController.getReviews);


router
  .route('/:reviewId')
  .get(auth(), validate(reviewValidation.getReview), reviewController.getReview)
  .patch(auth(), validate(reviewValidation.updateReview), reviewController.updateReview)
  .delete(auth(), validate(reviewValidation.deleteReview), reviewController.deleteReview);

export default router;
