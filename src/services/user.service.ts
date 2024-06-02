import httpStatus from 'http-status';
import { User } from '../models'
import ApiError from '../utils/ApiError';

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter: any, options: any) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Create a user
 * @param {any} userBody
 * @returns {Promise<any>}
 */
const createUser = async (userBody: any): Promise<any> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Get user by id
 * @param {any} id
 * @returns {Promise<any>}
 */
const getUserById = async (id: any): Promise<any> => {
  return User.findById(id).exec();
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<any>}
 */
const getUserByEmail = async (email: string): Promise<any> => {
  return User.findOne({ email }).exec();
};

/**
 * Update user by id
 * @param {any} userId
 * @param {Partial<any>} updateBody
 * @returns {Promise<any>}
 */
const updateUserById = async (
  userId: any,
  updateBody: Partial<any>
): Promise<any> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {any} userId
 * @returns {Promise<any>}
 */
const deleteUserById = async (userId: any): Promise<any> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.deleteOne();
  return user;
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
