import dotenv from 'dotenv';
// initialize .env files
dotenv.config();

import app from '../app';

const port = '3000' || process.env.PORT;

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log('gatek33pers backend is listening on port:', port); 
});