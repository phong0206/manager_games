import mongoose, { Document, Model, Schema } from 'mongoose';
import { toJSON } from './plugins';
import mongoosePaginate from 'mongoose-paginate-v2';

interface IGame extends Document {
  title: string;
  genre: string;
  description: string;
  developerId: mongoose.Schema.Types.ObjectId;
}

const gameSchema: Schema<IGame> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    developerId: {
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
gameSchema.plugin(toJSON);
gameSchema.plugin(mongoosePaginate);


/**
 * @typedef Game
 */
const Game = mongoose.model<IGame, any>('Game', gameSchema);

export default Game;
