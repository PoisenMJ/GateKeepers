import { randomBytes } from "crypto";
import { HydratedDocument } from "mongoose";
import { UserSchema } from "../models/users";

const checkUserHasKey = (user: HydratedDocument<UserSchema>) => {
  if (user) {
    return user.key ? true : false;
  } else return false;
}

const assignUserKey = async (user: HydratedDocument<UserSchema>) => {
  const key = randomBytes(32).toString('hex');
  user.key = key;
  try {
    await user.save();
    return true;
  } catch(err: any) {
    return false;
  }
}

export {
  assignUserKey,
  checkUserHasKey
};