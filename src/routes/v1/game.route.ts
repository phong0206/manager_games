import express from 'express';
import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import gameValidation from '../../validations/game.Validation';
import gameController from '../../controllers/game.controller';

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(gameValidation.createGame), gameController.createGame)
  .get(auth(), validate(gameValidation.getGames), gameController.getGames);


router
  .route('/:gameId')
  .get(auth(), validate(gameValidation.getGame), gameController.getGame)
  .patch(auth(), validate(gameValidation.updateGame), gameController.updateGame)
  .delete(auth(), validate(gameValidation.deleteGame), gameController.deleteGame);

export default router;
