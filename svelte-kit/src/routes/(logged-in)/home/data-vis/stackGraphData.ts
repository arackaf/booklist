import type { Book } from "$data/types";
import { computeParentId, getChildSubjectsSorted } from "$lib/state/subjectsState";

export const stackGraphData = (subjectHash: any, subjectIds: string[], books: Book[], childSubjectsOnly: boolean) => {
  let targetSubjectsLookup = new Set(subjectIds);

  let subjectResultsMap = new Map<string, number>([]);

  books.forEach(item => {
    let subjectsHeld = item.subjects
      .filter(_id => subjectHash[_id])
      .map(_id => (targetSubjectsLookup.has(_id) ? _id : getApplicableRootSubject(subjectHash[_id], childSubjectsOnly)?._id))
      .filter(_id => _id);

    if (!subjectsHeld.length) {
      return;
    }

    let uniqueSubjects = Array.from(new Set(subjectsHeld));
    let uniqueSubjectString = uniqueSubjects.sort().join(",");

    if (!subjectResultsMap.has(uniqueSubjectString)) {
      subjectResultsMap.set(uniqueSubjectString, 0);
    }
    subjectResultsMap.set(uniqueSubjectString, subjectResultsMap.get(uniqueSubjectString)! + 1);
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

  function getApplicableRootSubject(subject: any, childSubjectsOnly: boolean): any {
    let parentId = computeParentId(subject.path);

    if (!parentId) {
      return childSubjectsOnly ? null : subject;
    } else if (targetSubjectsLookup.has(parentId)) {
      return subjectHash[parentId];
    } else {
      return getApplicableRootSubject(subjectHash[parentId], childSubjectsOnly);
    }
  }
};
