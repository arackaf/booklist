import { allSubjects } from '$data/subjects';

export function load() {
	const subjects = allSubjects();

	return {
		subjects
	};
}
