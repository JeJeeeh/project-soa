import express from 'express';
import * as dotenv from 'dotenv';
import sharedRoutes from './src/routes/shared';
import bibleRoutes from './src/routes/bibles';

dotenv.config();

const app = express();
const port: string = process.env.PORT as string;

const basePrefix = '/api/v1';

app.use(`/${basePrefix}`, sharedRoutes);
app.use(`/${basePrefix}/bibles`, bibleRoutes);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
