import jwt from 'jsonwebtoken';

const generateToken = (username: string, key: string) => {
  const token = jwt.sign({ username }, key);
  return token;
}

export { generateToken };