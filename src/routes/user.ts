import express from 'express';
import { assignUserKey, checkUserHasKey } from '../util/userUtil';
import User from '../models/users';
import { generateToken } from '../util/tokenUtil';

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
    return res.json({ status: "ok" });
  } catch(error: any) {
    console.warn("Error:", error);
    return res.json({ status: "error", message: "Server error" });
  }
});

router.post('/login', async (req, res) => {
  const {
    username,
    password
  } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const correctPassword = user.checkPassword(password);
      if (correctPassword) {
        // if has key for jwt token or not
        const hasKey = checkUserHasKey(user);
        if (!hasKey) await assignUserKey(user);

        const token = generateToken(user.username, user.key);
        return res.json({ status: "ok", token, user: {
          username: user.username,
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          email: user.email
        }});
      } else {
        return res.json({
          status: "error",
          message: "Username or password is incorrect"
        });
      }
    }
    return res.json({
      status: "error",
      message: "Username or password is incorrect"
    });
  } catch(err: any) {
    console.warn("Error:", err);
    return res.json({ status: "error", message: "Server error" });
  }
})

router.get('/', (req, res) => {
  return res.json({ status: "ok" });
})

export default router;