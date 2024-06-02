import passport from 'passport';
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import rolesConfig from '../config/roles';

const { roles, roleRights } = rolesConfig;

// Define User type
interface User {
  id: string;
  role: string;
}

// Modify verifyCallback to include types for req, resolve, reject, and requiredRights
const verifyCallback = (req: Request, resolve: (value?: unknown) => void, reject: (reason?: any) => void, requiredRights: string[]) => async (err: Error | null, user: User | false, info: any) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role) || [];
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

// Define auth middleware with appropriate types
const auth = (...requiredRights: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;
