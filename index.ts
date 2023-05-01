import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import sharedRoutes from './src/routes/shared';
import bibleRoutes from './src/routes/bibles';
import { BibleExceptions } from './src/exceptions/bibleExceptions';
import { StatusCode } from './src/helpers/statusCode';

dotenv.config();

const app = express();
const port: string = process.env.PORT as string;

const basePrefix = '/api/v1';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${ basePrefix }`, sharedRoutes);
app.use(`${ basePrefix }/bibles`, bibleRoutes);

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof BibleExceptions) {
		res.status(err.statusCode).json({
			status: err.statusCode,
			message: err.message,
		});
		return;
	}

	res.status(StatusCode.INTERNAL_SERVER).json({
		status: StatusCode.INTERNAL_SERVER,
		message: 'Internal Server Error',
	});
	return;

	next();
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${ port }`);
});
