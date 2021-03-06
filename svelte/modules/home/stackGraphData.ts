import { computeSubjectParentId, getChildSubjectsSorted } from "app/state/subjectsState";

export const stackGraphData = (subjectHash, subjectIds, data) => {
  if (!data) return null;

  let targetSubjectsLookup = new Set(subjectIds);

  let subjectResultsMap = new Map<string, number>([]);

  data.allBooks.Books.forEach(item => {
    let subjectsHeld = item.subjects
      .filter(_id => subjectHash[_id])
      .map(_id => (targetSubjectsLookup.has(_id) ? _id : getApplicableRootSubject(subjectHash[_id])._id));

    let uniqueSubjects = Array.from(new Set(subjectsHeld));
    let uniqueSubjectString = uniqueSubjects.sort().join(",");

    if (!subjectResultsMap.has(uniqueSubjectString)) {
      subjectResultsMap.set(uniqueSubjectString, 0);
    }
    subjectResultsMap.set(uniqueSubjectString, subjectResultsMap.get(uniqueSubjectString) + 1);
  });

  return Array.from(subjectResultsMap).map(([name, count], i) => {
    let _ids = name.split(",").filter(s => s);
    let names = _ids
      .map(_id => subjectHash[_id].name)
      .sort()
      .join(",");

    return {
      groupId: name,
      count,
      display: names,
      entries: _ids.map(_id => {
        let subject = subjectHash[_id];
        return {
          name: subject.name,
          color: subject.backgroundColor,
          children: getChildSubjectsSorted(_id, subjectHash)
        };
      })
    };
  });

  function getApplicableRootSubject(subject) {
    let parentId = computeSubjectParentId(subject.path);

    if (!parentId) {
      return subject;
    } else if (targetSubjectsLookup.has(parentId)) {
      return subjectHash[parentId];
    } else {
      return getApplicableRootSubject(subjectHash[parentId]);
    }
  }
};
