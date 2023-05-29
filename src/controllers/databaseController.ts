import { Request, Response } from 'express';
import { PrismaClient, Role, DailyBread } from '@prisma/client';
import { StatusCode } from '../helpers/statusCode';
const prisma = new PrismaClient();

interface ISeed {
	name: string;
	max_api_hits: number;
	max_collection: number;
	has_daily_bread: boolean;
}

interface ISeedDailyBread {
	bibleId: string;
	verseId: string;
}

export const seed = (req: Request, res: Response): void => {
	const data = req.body as Array<ISeed>;

	data.map(async (item) => {
		const result = await createRole(item);
		console.log(result);
	});

	res.status(StatusCode.OK).json({
		status: StatusCode.OK,
		message: 'Seeded successfully',
		data: data,
	});
	return;
};

export const seedDailyBread = (req: Request, res: Response): void => {
	const data = req.body as Array<ISeedDailyBread>;

	data.map(async (item) => {
		const result = await createDailyBread(item);
		console.log(result);
	});

	res.status(StatusCode.OK).json({
		status: StatusCode.OK,
		message: 'Seeded successfully',
		data: data,
	});
};

async function createRole(data: ISeed): Promise<Role | null> {
	try {
		const result = await prisma.role.create({
			data,
		});

		return result;
	} catch (error) {
		console.log(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
}

async function createDailyBread(data: ISeedDailyBread): Promise<DailyBread | null> {
	try {
		const result = await prisma.dailyBread.create({
			data,
		});

		return result;
	} catch (error) {
		console.log(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
}