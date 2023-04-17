import express from 'express'
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

const base_prefix = '/api/v1';
import sharedRoutes from './src/routes/shared';
import bibleRoutes from './src/routes/bibles';

app.use(`/${base_prefix}`, sharedRoutes);
app.use(`/${base_prefix}/bibles`, bibleRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export {};