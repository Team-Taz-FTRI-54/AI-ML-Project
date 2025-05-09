import User from '../models/userloginmodel.js';
import { Request, Response, NextFunction } from 'express';

type LoginControllerType = {
  createUser: (req: Request, res: Response, next: NextFunction) => void;
  verifyUser: (req: Request, res: Response, next: NextFunction) => void;
};
const userController: LoginControllerType = {} as LoginControllerType;

userController.createUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next({
        log: 'userController.createUser: Missing username or password!',
        status: 400,
        message: { err: 'Missing username or password!' },
      });
    }
    if (password.length < 6)
      return next({
        log: 'userController.createUser: password must be at least 6 characters long!',
        status: 400,
        message: { err: 'password must be at least 6 characters long' },
      });
    const data = await User.create({ username, password });
    res.locals.userNew = data;
    console.log('New user saved', data);
    return next();
  } catch (_err) {
    return next({
      log: 'createUser: Error: createUser',
      status: 500,
      message: { err: 'An error occurred createUser' },
    });
  }
};

userController.verifyUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next({
        log: 'missing username or password',
        status: 400,
        message: { err: 'missing username or password' },
      });
    }

    const data = await User.findOne({ username, password });
    if (!data) {
      res.status(400).json({ message: 'Invalid username or password' });
    }
    res.locals.user = data;
    console.log('User verified success', data);
    return next();
  } catch (_err) {
    return next({
      log: 'verifyUser: Error: verifyUser',
      status: 500,
      message: { err: 'An error occurred verifyUser' },
    });
  }
};

export default userController;
