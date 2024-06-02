import mongoose, { Document, Model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { toJSON } from './plugins';
import mongoosePaginate from 'mongoose-paginate-v2';
import rolesConfig from '../config/roles';

const { roles, roleRights } = rolesConfig;

export interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  password: string;
  isEmailVerified: boolean;
  isPasswordMatch(password: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(mongoosePaginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {mongoose.Types.ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre<IUser>('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model<IUser, any>('User', userSchema);

export default User;
