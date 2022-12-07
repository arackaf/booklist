import type { FullSubject, Subject, SubjectHash, SubjectWithPrepends } from "$data/types";

export const subjectState = (allSubjectsSorted: Subject[] = []) => {
  const subjects = stackAndGetTopLevelSubjects(allSubjectsSorted);
  const subjectsUnwound = unwindSubjects(subjects);
  const subjectHash = toHash(allSubjectsSorted);

  return {
    subjects,
    subjectsUnwound,
    subjectHash
  };
};

export const stackAndGetTopLevelSubjects = (allSubjects: Subject[]): FullSubject[] => {
  //let subjects = Object.keys(subjectsHash).map(_id => ({ ...subjectsHash[_id] }));
  const subjects: FullSubject[] = allSubjects.map(s => ({
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

export const unwindSubjects = (subjects: FullSubject[]): FullSubject[] => {
  let result: FullSubject[] = [];
  subjects.forEach(s => result.push(s, ...unwindSubjects(s.children || [])));
  return result;
};

export const toHash = (subjects: Subject[]): SubjectHash => {
  return subjects.reduce<SubjectHash>((hash, tag) => {
    hash[tag._id] = tag;
    return hash;
  }, {});
};

type LookupHash = { [_id: string]: true };
type SearchFn = (s: Subject) => boolean;

export const filterSubjects = (subjects: Subject[], search?: string, lookupMap: SubjectHash = {}, alreadySelected: LookupHash = {}) => {
  let searchFn: SearchFn;
  if (!search) {
    searchFn = s => !alreadySelected[s._id];
  } else {
    let regex = new RegExp(search, "i");
    searchFn = s => regex.test(s.name) && !alreadySelected[s._id];
  }
  return subjects.reduce<SubjectWithPrepends[]>((result, s) => {
    if (searchFn(s)) {
      const entry: SubjectWithPrepends = { ...s, prepend: [] };

      let currentSubject = s;
      let parentId;
      let ancestorsInactive = 0;
      while ((parentId = computeSubjectParentId(currentSubject.path))) {
        if (!parentId) {
          break;
        }
        let parent = lookupMap[parentId];
        if (!parent) {
          break;
        }

        if (alreadySelected[parent._id] || !searchFn(parent)) {
          ancestorsInactive++;
        }

        entry.prepend.unshift(parent);
        currentSubject = parent;
      }

      if (!ancestorsInactive) {
        entry.prepend = [];
      }

      result.push(entry);
    }
    return result;
  }, []);
};

const computeSubjectParentId = (path: string) => {
  if (path) {
    let pathParts = path.split(",");
    return pathParts[pathParts.length - 2];
  } else {
    return "";
  }
};
