import express from 'express';
import User from '../models/users';

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    username,
    email,
    password,
  } = req.body;

  try {
    const newUser = new User({
      username,
      email,
      password
    });
    await newUser.save();
    return res.status(201).json({ status: "ok" });
  } catch(error: any) {
    // tslint:disable-next-line:no-console
    console.warn("Error:", error);
    return res.status(400).json({ status: "bad request" });
  }
});

export default router;