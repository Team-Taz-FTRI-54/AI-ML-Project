import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router();

router.post('/signup', userController.createUser, (req, res) => {
  res.status(200).json('User created ' + res.locals.userNew);
});

router.post('/login', userController.verifyUser, (req, res) => {
  res.status(200).json({
    message: 'User verified',
    user: { id: res.locals.user._id, username: res.locals.user.username },
  });
});
export default router;
