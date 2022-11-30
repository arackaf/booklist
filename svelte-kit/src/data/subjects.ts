import { getDbConnection } from './dbUtils';

const { db } = await getDbConnection();

type Subject = {
	_id: string;
	name: string;
	path: string;
};

type FullSubject = Subject & {
	children: Subject[];
	childLevel: number;
};

type SubjectHash = {
	[_id: string]: Subject;
};

const stackAndGetTopLevelSubjects = (rawSubjects: Subject[]): FullSubject[] => {
	//let subjects = Object.keys(subjectsHash).map(_id => ({ ...subjectsHash[_id] }));
	const subjects: FullSubject[] = rawSubjects.map(s => ({
		...s,
		childLevel: 0,
		children: []
	}));

	subjects.forEach(parent => {
		parent.children.push(...subjects.filter(child => new RegExp(`,${parent._id},$`).test(child.path)));
		parent.childLevel = !parent.path ? 0 : (parent.path.match(/\,/g) || []).length - 1;
	});

	return subjects.filter(s => s.path == null);
};

export const allSubjects = async () => {
	const nativeStart = +new Date();

	const result: Subject[] = (await db
		.collection('subjects')
		.aggregate([{ $match: { userId: '60a93babcc3928454b5d1cc6' } }, { $project: { _id: 1, name: 1, path: 1 } }, { $sort: { name: 1 } }])
		.toArray()) as Subject[];

	const nativeEnd = +new Date();

	console.log('Native time subjects', nativeEnd - nativeStart);
	const allSubjectsSorted = result.map(s => ({ ...s, _id: s._id.toString() }));

	const stackedSubjects = stackAndGetTopLevelSubjects(allSubjectsSorted);

	return {
		allSubjectsSorted,
		stackedSubjects
	};
};
