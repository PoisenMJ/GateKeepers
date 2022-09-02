import express from 'express';

import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';

import userRouter from './routes/user';

const app = express();

app.use(helmet());
app.use(compression({ filter: shouldCompress }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(userRouter);

function shouldCompress (req: express.Request, res: express.Response) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

export default app;