import type { DisablableSubject, FullSubject, Hash, Subject } from "$data/types";
import { toHash } from "./helpers";

// TODO
export const subjectState = (allSubjectsSorted: Subject[] = []) => {
  const subjects = stackAndGetTopLevelSubjects(allSubjectsSorted);
  const subjectsUnwound = unwindSubjects(subjects);
  const subjectHash = toHash(subjectsUnwound);

  return {
    subjects,
    subjectsUnwound,
    subjectHash
  };
};

export const getSubjectsHash = (subjects: Subject[]): Hash<Subject> => {
  return toHash(subjects);
};

export const stackAndGetTopLevelSubjects = (allSubjects: Subject[]): FullSubject[] => {
  const subjects: FullSubject[] = allSubjects.map(s => ({
    ...s,
    childLevel: 0,
    children: []
  }));

  subjects.forEach(parent => {
    parent.children.push(...subjects.filter(child => new RegExp(`,${parent.id},$`).test(child.path || "")));
    parent.childLevel = !parent.path ? 0 : (parent.path.match(/\,/g) || []).length - 1;
  });

  return subjects.filter(s => s.path == null);
};

export const unwindSubjects = (subjects: FullSubject[]): FullSubject[] => {
  let result: FullSubject[] = [];
  subjects.forEach(s => result.push(s, ...unwindSubjects(s.children || [])));
  return result;
};

type LookupHash = { [id: string]: true };
type SearchFn = (s: Subject) => boolean;

export const filterSubjects = (subjects: Subject[], search?: string, lookupMap: Hash<FullSubject> = {}, alreadySelected: LookupHash = {}) => {
  let searchFn: SearchFn;
  if (!search) {
    searchFn = s => !alreadySelected[s.id];
  } else {
    let regex = new RegExp(search, "i");
    searchFn = s => regex.test(s.name) && !alreadySelected[s.id];
  }
  const forcedLookup: Set<number> = new Set([]);
  return subjects.reduce<DisablableSubject[]>((result, s) => {
    if (searchFn(s)) {
      const entry: DisablableSubject = { ...s, disabled: false };
      const toAdd: DisablableSubject[] = [entry];

      let currentSubject = s;
      let parentId;

      while ((parentId = computeParentId(currentSubject.path))) {
        const parent = lookupMap[parentId];

        if (!parent || forcedLookup.has(parentId)) {
          break;
        }

        const parentEntry: DisablableSubject = { ...parent, disabled: false };

        if (alreadySelected[parent.id] || !searchFn(parent)) {
          toAdd.unshift(parentEntry);
          forcedLookup.add(parentId);

          if (alreadySelected[parent.id]) {
            parentEntry.disabled = true;
          }
        }

        currentSubject = parent;
      }

      result.push(...toAdd);
    }
    return result;
  }, []);
};

export const computeParentId = (path: string | null) => {
  if (path) {
    let pathParts = path.split(",");
    return parseInt(pathParts[pathParts.length - 2]);
  } else {
    return 0;
  }
};

export const getChildSubjectsSorted = (id: number, subjectHash: Hash<Subject>) => {
  let regex = new RegExp(`,${id},$`);
  return Object.keys(subjectHash)
    .map(id => subjectHash[id])
    .filter(sc => regex.test(sc.path!))
    .sort(subjectSortCompare);
};

const subjectSortCompare = ({ name: name1 }: Subject, { name: name2 }: Subject) => {
  name1 = name1 || "";
  name2 = name2 || "";

  let name1After = name1.toLowerCase() > name2.toLowerCase(),
    bothEqual = name1.toLowerCase() === name2.toLowerCase();
  return bothEqual ? 0 : name1After ? 1 : -1;
};

export const getEligibleParents = (subjectHash: Hash<Subject>, id: number) => {
  let eligibleParents = id
    ? flattenSubjects(subjectHash).filter(s => s.id !== id && !new RegExp(`,${id},`).test(s.path || ""))
    : flattenSubjects(subjectHash);

  return eligibleParents.sort(subjectSortCompare);
};

export const flattenSubjects = (subjects: Hash<Subject>) => Object.keys(subjects).map(k => subjects[k]);
