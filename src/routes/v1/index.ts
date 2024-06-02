import express from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';
import gameRoute from './game.route'
const router = express.Router();

interface Route {
  path: string;
  route: express.Router;
}

const defaultRoutes: Route[] = [
  {
    path: '/users',
    route: userRoute,
  },{
    path: '/auth',
    route: authRoute,
  },{
    path: '/games',
    route: gameRoute,
  }
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
