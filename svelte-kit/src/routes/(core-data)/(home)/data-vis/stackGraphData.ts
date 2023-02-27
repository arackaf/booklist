import type { BookSubjectStack } from "$data/types";
import { computeParentId, getChildSubjectsSorted } from "$lib/state/subjectsState";

export const stackGraphData = (subjectHash: any, subjectIds: string[], books: BookSubjectStack[], childSubjectsOnly: boolean) => {
  let targetSubjectsLookup = new Set(subjectIds);

  let subjectResultsMap = new Map<string, number>([]);

  if (childSubjectsOnly) {
    books = books.filter(b => {
      return b.subjects.some(s => {
        const actualSubject = subjectHash[s];
        return targetSubjectsLookup.has(s) || targetSubjectsLookup.has(getApplicableRootSubject(actualSubject).id);
      });
    });
  }

  books.forEach(item => {
    let subjectsHeld = item.subjects
      .filter(id => subjectHash[id])
      .map(id => (targetSubjectsLookup.has(id) ? id : getApplicableRootSubject(subjectHash[id]).id))
      .filter(id => id);

    if (!subjectsHeld.length) {
      return;
    }

    let uniqueSubjects = Array.from(new Set(subjectsHeld));
    let uniqueSubjectString = uniqueSubjects.sort().join(",");

    if (!subjectResultsMap.has(uniqueSubjectString)) {
      subjectResultsMap.set(uniqueSubjectString, 0);
    }
    subjectResultsMap.set(uniqueSubjectString, subjectResultsMap.get(uniqueSubjectString)! + item.count);
  });

  return Array.from(subjectResultsMap)
    .map(([name, count]) => {
      let _ids = name.split(",").filter(s => s);
      let names = _ids
        .map(id => subjectHash[id].name)
        .sort()
        .join(",");

      return {
        groupId: name,
        count,
        display: names,
        entries: _ids.map(id => {
          let subject = subjectHash[id];
          return {
            name: subject.name,
            color: subject.backgroundColor,
            children: getChildSubjectsSorted(id, subjectHash)
          };
        })
      };
    })
    .sort((a, b) => {
      if (a.display < b.display) {
        return -1;
      } else if (a.display > b.display) {
        return 1;
      }
      return 0;
    });

  function getApplicableRootSubject(subject: any): any {
    let parentId = computeParentId(subject.path);

    if (targetSubjectsLookup.has(subject.id)) {
      return subject;
    } else if (!parentId) {
      return subject;
    } else if (targetSubjectsLookup.has(parentId)) {
      return subjectHash[parentId];
    } else {
      return getApplicableRootSubject(subjectHash[parentId]);
    }
  }
};
