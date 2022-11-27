import { env } from '$env/dynamic/private';

export const searchBooks = (search: string) => {
	return fetch(env.MONGO_URL + '/action/aggregate', {
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
			pipeline: [
				{ $match: { title: { $regex: search || '', $options: 'i' }, userId: '60a93babcc3928454b5d1cc6' } },
				{ $project: { _id: 1, title: 1, userId: 1 } },
				{ $sort: { title: 1 } }
			]
		})
	})
		.then(res => res.json())
		.then(res => res.documents)
		.catch(err => {
			console.log({ err });
		});
};
