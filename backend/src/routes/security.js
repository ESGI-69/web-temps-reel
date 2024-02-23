import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userService from '../services/user.js';

dotenv.config();

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userService.findLogin({ username });
    if (!user) {
      return res.status(400).send({
        code: 'invalid_credentials',
        message: 'Invalid credentials',
      });
    }
    if (!await user.checkPassword(password)) {
      return res.status(400).send({
        code: 'invalid_credentials',
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1y',
      algorithm: 'HS256',
    });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;
