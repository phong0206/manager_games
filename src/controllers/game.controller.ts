import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { gameService } from '../services';
import * as _ from 'lodash'

const getGames = catchAsync(async (req, res) => {
  let filter: any = _.pick(req.query, ['title', 'genre']);
  filter = Object.fromEntries(
    Object.entries(filter).map(([key, value]) => {
      return [key, new RegExp(String(value), 'i')];
    })
  );
  const options = _.pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await gameService.queryGames(filter, options);
  res.send(result);
});

const createGame = catchAsync(async (req: Request, res: Response) => {
  const game = await gameService.createGame(req.body);
  res.status(httpStatus.CREATED).send(game);
});

const getGame = catchAsync(async (req: Request, res: Response) => {
  const game = await gameService.getById(req.params.gameId);
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }
  res.send(game);
});

const updateGame = catchAsync(async (req: Request, res: Response) => {
  const game = await gameService.updateGameById(req.params.gameId, req.body);
  res.send(game);
});

const deleteGame = catchAsync(async (req: Request, res: Response) => {
  await gameService.deleteGameById(req.params.gameId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createGame,
  getGame,
  getGames,
  updateGame,
  deleteGame,
};
