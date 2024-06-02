import Joi from 'joi';
import { password, objectId } from './custom.validation'

const createGame = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    genre: Joi.string().required(),
    description: Joi.string().required(),
    developerId:Joi.string().required().custom(objectId),
  }),
};

const getGames = {
  query: Joi.object().keys({
    title: Joi.string(),
    genre: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getGame = {
  params: Joi.object().keys({
    gameId: Joi.string().custom(objectId),
  }),
};

const updateGame = {
  params: Joi.object().keys({
    gameId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
      genre: Joi.string(),
    })
    .min(1),
};

const deleteGame = {
  params: Joi.object().keys({
    gameId: Joi.string().custom(objectId),
  }),
};

export default {
  createGame,
  getGames,
  getGame,
  updateGame,
  deleteGame,
};
