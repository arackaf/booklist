import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	fetch(env.MONGO_URL + '/action/aggregate', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Request-Headers': '*',
			'api-key': env.MONGO_URL_API_KEY
		},
		body: JSON.stringify({
			collection: 'books',
			database: 'my-library',
			dataSource: 'Cluster0',
			pipeline: [{ $match: { title: { $regex: 'JAVA', $options: 'i' } } }, { $project: { _id: 1, title: 1 } }, { $sort: { title: 1 } }]
		})
	})
		.then((res) => {
			console.log(res.status);
			return res.json();
		})
		.then((res) => {
			console.log('RESULT', res);
		})
		.catch((err) => {
			console.log({ err });
		});

	return new Response(
		JSON.stringify({
			x: typeof fetch
		})
	);
};
