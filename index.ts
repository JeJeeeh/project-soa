import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import authRoutes from './src/routes/auth';
import bibleRoutes from './src/routes/bibles';
import { BibleExceptions } from './src/exceptions/bibleExceptions';
import { StatusCode } from './src/helpers/statusCode';
import bookRoutes from './src/routes/books';
import chapterRoutes from './src/routes/chapters';
import databaseRoutes from './src/routes/database';
import { BadRequestExceptions, ForbiddenExceptions, NotFoundExceptions, UnauthorizedExceptions } from './src/exceptions/clientException';
import { JoiExceptions } from './src/exceptions/joiException';

dotenv.config();

const app = express();
const port: string = process.env.PORT as string;

const basePrefix = '/api/v1';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('Content-Type', 'application/json');
app.set('x-powered-by', false);

app.use(`${ basePrefix }/auth`, authRoutes);
app.use(`${ basePrefix }/bibles`, bibleRoutes);
app.use(`${ basePrefix }/bibles`, bookRoutes);
app.use(`${ basePrefix }/bibles`, chapterRoutes);
app.use(`${ basePrefix }/database`, databaseRoutes);

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof BibleExceptions) {
		res.status(err.statusCode).json({
			status: err.statusCode,
			message: err.message,
		});
		return;
	}
	if (err instanceof JoiExceptions) {
		res.status(StatusCode.BAD_REQUEST).json({
			status: StatusCode.BAD_REQUEST,
			message: err.getDetailError(),
		});
		return;
	}
	if (err instanceof BadRequestExceptions) {
		res.status(StatusCode.BAD_REQUEST).json({
			status: StatusCode.BAD_REQUEST,
			message: err.message,
		});
		return;
	}
	if (err instanceof NotFoundExceptions) {
		res.status(StatusCode.NOT_FOUND).json({
			status: StatusCode.NOT_FOUND,
			message: err.message,
		});
		return;
	}
	if (err instanceof ForbiddenExceptions) {
		res.status(StatusCode.FORBIDDEN).json({
			status: StatusCode.FORBIDDEN,
			message: err.message,
		});
		return;
	}
	if (err instanceof UnauthorizedExceptions) {
		res.status(StatusCode.UNAUTHORIZED).json({
			status: StatusCode.UNAUTHORIZED,
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

app.all('*', (req: Request, res: Response) => {
	res.status(404).json({
		status: 404,
		message: 'Are you lost? Read the bible instead.',
	});
	return;
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${ port }`);
});
