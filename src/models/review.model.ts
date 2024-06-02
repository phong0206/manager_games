import mongoose, { Document, Model, Schema } from 'mongoose';
import { toJSON } from './plugins';
import mongoosePaginate from 'mongoose-paginate-v2';

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
reviewSchema.plugin(mongoosePaginate);

/**
 * @typedef Review
 */
const Review = mongoose.model<IReview, any>('Review', reviewSchema);

export default Review;
