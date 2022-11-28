import { getDbConnection } from './dbUtils';

const { db } = await getDbConnection();

export const searchBooks = async (search: string) => {
	const nativeStart = +new Date();

	const result = await db
		.collection('books')
		.aggregate([
			{ $match: { title: { $regex: search || '', $options: 'i' }, userId: '60a93babcc3928454b5d1cc6' } },
			{ $project: { _id: 1, title: 1, userId: 1 } },
			{ $limit: 50 },
			{ $sort: { title: 1 } }
		])
		.toArray();

	const nativeEnd = +new Date();

	console.log('Native time books', nativeEnd - nativeStart);
	return result.map(b => ({ ...b, _id: b._id.toString() }));
};
