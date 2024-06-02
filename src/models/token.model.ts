import mongoose, { Document, Model, Schema } from 'mongoose';
import { toJSON } from './plugins';
import tokenTypes from '../config/tokens';

interface IToken extends Document {
  token: string;
  user: mongoose.Schema.Types.ObjectId;
  type: string;
  expires: Date;
}

const tokenSchema: Schema<IToken> = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token= mongoose.model<IToken>('Token', tokenSchema);

export default Token;
