import { env } from '$env/dynamic/private';
import { getDbConnection } from './dbUtils';

const { db } = await getDbConnection();

export const allSubjects = async () => {
	const nativeStart = +new Date();

	const result = await db
		.collection('subjects')
		.aggregate([{ $match: { userId: '60a93babcc3928454b5d1cc6' } }, { $project: { _id: 1, name: 1 } }, { $sort: { name: 1 } }])
		.toArray();

	const nativeEnd = +new Date();

	console.log('Native time subjects', nativeEnd - nativeStart);
	return result.map(s => ({ ...s, _id: s._id.toString() }));
};
