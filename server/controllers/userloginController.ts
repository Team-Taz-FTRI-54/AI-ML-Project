import User from '../models/userloginmodel.js';
import { Request, Response, NextFunction } from 'express';

type LoginControllerType = {
  createUser: (req: Request, res: Response, next: NextFunction) => void;
  verifyUser: (req: Request, res: Response, next: NextFunction) => void;
};
const loginController: LoginControllerType = {} as LoginControllerType;

loginController.createUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next({ err: 'Missing username or password!' });
    }
    if (password.length < 6)
      return next({ err: 'password must be at least 6 characters long' });
    const data = await User.create({ username, password });
    res.locals.userNew = data;
    console.log('New user saved', data);
    return next();
  } catch (err: any) {
    console.error('Error with createUser', err.message);
    res.status(500).json({ error: 'Create user failed' });
  }
};

loginController.verifyUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next({ err: 'Missing username or password!' });
    }

    const data = await User.findOne({ username, password });
    if (!data) {
      res.status(400).json({ message: 'Invalid username or password' });
    }
    res.locals.user = data;
    console.log('User verified success', data);
    return next();
  } catch (err: any) {
    console.error('Error in verifyUser', err.message);
  }
};

export default loginController;
