import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import authRoutes from './src/routes/auth';
import bibleRoutes from './src/routes/bibles';
import { BibleExceptions } from './src/exceptions/bibleExceptions';
import { StatusCode } from './src/helpers/statusCode';
import bookRoutes from './src/routes/books';
import verseRoutes from './src/routes/verses';
import chapterRoutes from './src/routes/chapters';
import databaseRoutes from './src/routes/database';
import collectionRoutes from './src/routes/collection';
import itemRoutes from './src/routes/item';
import { BadRequestExceptions, ForbiddenExceptions, NotFoundExceptions, TooManyRequestsExceptions, UnauthorizedExceptions } from './src/exceptions/clientException';
import dailybreadRoutes from './src/routes/dailybread';
import { JoiExceptions } from './src/exceptions/joiException';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port: string = process.env.PORT as string;

const basePrefix = '/api/v1';

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.set('Content-Type', 'application/json');
app.set('x-powered-by', false);

app.use(`${ basePrefix }/`, dailybreadRoutes);
app.use(`${ basePrefix }/auth`, authRoutes);
app.use(`${ basePrefix }/bibles`, bibleRoutes);
app.use(`${ basePrefix }/bibles`, bookRoutes);
app.use(`${ basePrefix }/bibles`, verseRoutes);
app.use(`${ basePrefix }/bibles`, chapterRoutes);
app.use(`${ basePrefix }/collections`, collectionRoutes);
app.use(`${ basePrefix }/collections`, itemRoutes);
app.use(`${ basePrefix }/database`, databaseRoutes);

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
	console.log(err);

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
	if (err instanceof TooManyRequestsExceptions) {
		res.status(StatusCode.TOO_MANY_REQUESTS).json({
			status: StatusCode.TOO_MANY_REQUESTS,
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
	res.status(StatusCode.NOT_FOUND).json({
		status: StatusCode.NOT_FOUND,
		message: 'Are you lost? Read the bible instead.',
	});
	return;
});

app.listen(port, () => {
	console.log(`Server is running at ${ port }`);
});
