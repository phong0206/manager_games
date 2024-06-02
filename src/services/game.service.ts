import httpStatus from 'http-status';
import { Game } from '../models'
import ApiError from '../utils/ApiError';
import userService from './user.service';

/**
 * Query for games
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryGames = async (filter: any, options: any) => {
  const games = await Game.paginate(filter, options);
  return games;
};

/**
 * Create a Game
 * @param {any} gameBody
 * @returns {Promise<any>}
 */
const createGame = async (gameBody: any): Promise<any> => {
  const user = await userService.getUserById(gameBody.developerId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return Game.create(gameBody);
};

/**
 * Get game by id
 * @param {any} id
 * @returns {Promise<any>}
 */
const getById = async (id: any): Promise<any> => {
  return Game.findById(id).exec();
};

/**
 * Update game by id
 * @param {any} gameId
 * @param {Partial<any>} updateBody
 * @returns {Promise<any>}
 */
const updateGameById = async (
  gameId: any,
  updateBody: Partial<any>
): Promise<any> => {
  const game = await getById(gameId);
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }
  Object.assign(game, updateBody);
  await game.save();
  return game;
};

/**
 * Delete game by id
 * @param {any} gameId
 * @returns {Promise<any>}
 */
const deleteGameById = async (gameId: any): Promise<any> => {
  const game = await getById(gameId);
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }
  await game.deleteOne();
  return game;
};

export default {
  createGame,
  queryGames,
  getById,
  updateGameById,
  deleteGameById,
};
