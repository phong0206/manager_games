import mongoose, { Document, Model, Schema } from 'mongoose';
import { toJSON } from './plugins';

interface IReview extends Document {
  review: string;
  rating: number;
  description: string;
  gameId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
}

const reviewSchema: Schema<IReview> = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
reviewSchema.plugin(toJSON);

/**
 * @typedef Review
 */
const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
